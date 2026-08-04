import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CalculatePayrollDto } from './dto/calculate-payroll.dto';

@Injectable()
export class PayrollsService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateAndSave(userId: string, dto: CalculatePayrollDto) {
    // 1. Fetch Worker & verify user ownership
    const worker = await this.prisma.worker.findFirst({
      where: { id: dto.workerId, userId },
      include: {
        company: true,
        afp: true,
        healthInstitution: true,
        contractType: true,
      },
    });

    if (!worker) {
      throw new NotFoundException(`Trabajador con ID ${dto.workerId} no encontrado`);
    }

    // 2. Fetch Monthly Parameters for period
    const param = await this.prisma.monthlyParameter.findUnique({
      where: {
        periodYyyyMm_userId: {
          periodYyyyMm: dto.periodYyyyMm,
          userId,
        },
      },
      include: {
        uniqueTaxBrackets: { orderBy: { bracketNumber: 'asc' } },
        familyAllowanceBrackets: { orderBy: { bracketLetter: 'asc' } },
      },
    });

    if (!param) {
      throw new BadRequestException(
        `Debe configurar los Parámetros Mensuales para el período ${dto.periodYyyyMm} antes de calcular liquidaciones`
      );
    }

    // 2.b Fetch pre-saved Monthly Novelties from DB (if any)
    const existingNovelty = await this.prisma.monthlyNovelty.findUnique({
      where: {
        workerId_periodYyyyMm: {
          workerId: worker.id,
          periodYyyyMm: dto.periodYyyyMm,
        },
      },
    });

    const workedDays = dto.workedDays ?? existingNovelty?.workedDays ?? 30;
    const sickLeaveDays = dto.sickLeaveDays ?? existingNovelty?.sickLeaveDays ?? 0;
    const absenceDays = dto.absenceDays ?? existingNovelty?.absenceDays ?? 0;
    const overtime50Hrs = dto.overtime50Hrs ?? (existingNovelty ? Number(existingNovelty.overtime50Hrs) : 0);
    const overtime100Hrs = dto.overtime100Hrs ?? (existingNovelty ? Number(existingNovelty.overtime100Hrs) : 0);
    const familyDependentsCount = dto.familyDependentsCount ?? existingNovelty?.familyDependentsCount ?? 0;
    const otherTaxableIncome = dto.otherTaxableIncome ?? (existingNovelty ? Number(existingNovelty.otherTaxableIncome) : 0);
    const otherNonTaxableIncome = dto.otherNonTaxableIncome ?? (existingNovelty ? Number(existingNovelty.otherNonTaxableIncome) : 0);
    const totalOtherDeductions = dto.otherDeductions ?? (existingNovelty ? Number(existingNovelty.otherDeductions) : 0);

    // 3. Imponibles Math
    const baseSalaryAgreed = Number(worker.baseSalary) || 0;
    const proportionalBaseSalary = Math.round((baseSalaryAgreed / 30) * workedDays);

    // Hourly rate approx: Base Salary / 180
    const hourlyRate = baseSalaryAgreed / 180;
    const overtime50Amount = Math.round(hourlyRate * 1.5 * overtime50Hrs);
    const overtime100Amount = Math.round(hourlyRate * 2.0 * overtime100Hrs);

    const totalTaxable = proportionalBaseSalary + overtime50Amount + overtime100Amount + otherTaxableIncome;

    // 4. Legal Deductions Math
    const ufValue = Number(param.ufClosingValue);
    const utmValue = Number(param.utmValue);
    const afpCapAmount = Number(param.afpCappingUf) * ufValue;
    const afcCapAmount = Number(param.afcCappingUf) * ufValue;

    // AFP
    const afpCapBase = Math.min(totalTaxable, afpCapAmount);
    const afpRate = worker.afp ? Number(worker.afp.commissionRate) + 10.0 : 10.0;
    const afpDeduction = Math.round(afpCapBase * (afpRate / 100));

    // Health
    const health7Percent = Math.round(totalTaxable * 0.07);
    const agreedUf = Number(worker.healthAgreedUf) || 0;
    const agreedUfAmount = Math.round(agreedUf * ufValue);
    const healthDeduction = worker.healthInstitution?.isIsapre
      ? Math.max(health7Percent, agreedUfAmount)
      : health7Percent;

    // AFC (Seguro de Cesantía)
    const afcCapBase = Math.min(totalTaxable, afcCapAmount);
    const afcWorkerDiscount = worker.contractType?.afcWorkerDiscount ?? true;
    const afcDeduction = afcWorkerDiscount ? Math.round(afcCapBase * 0.006) : 0;

    // Unique Tax
    const taxableBaseForTax = Math.max(0, totalTaxable - afpDeduction - healthDeduction - afcDeduction);
    const taxableBaseInUtm = taxableBaseForTax / utmValue;

    let uniqueTaxDeduction = 0;
    const taxBracket = param.uniqueTaxBrackets.find((b) => {
      const from = Number(b.fromUtm);
      const to = b.toUtm ? Number(b.toUtm) : Infinity;
      return taxableBaseInUtm >= from && taxableBaseInUtm <= to;
    });

    if (taxBracket) {
      const factor = Number(taxBracket.factor);
      const deductionUtm = Number(taxBracket.deductionUtm);
      uniqueTaxDeduction = Math.max(0, Math.round(taxableBaseForTax * factor - deductionUtm * utmValue));
    }

    const totalLegalDeductions = afpDeduction + healthDeduction + afcDeduction + uniqueTaxDeduction;

    // 5. Non-Taxable Income Math
    const familyBracket = param.familyAllowanceBrackets.find((f) => {
      const from = Number(f.incomeFrom);
      const to = Number(f.incomeTo);
      return totalTaxable >= from && totalTaxable <= to;
    });

    const familyAllowanceAmount = familyDependentsCount * (familyBracket ? Number(familyBracket.amountPerDependent) : 0);
    const totalNonTaxable = familyAllowanceAmount + otherNonTaxableIncome;

    // 6. Other Deductions & Net Salary
    const netPayable = totalTaxable + totalNonTaxable - totalLegalDeductions - totalOtherDeductions;

    // 7. Save Monthly Novelty
    await this.prisma.monthlyNovelty.upsert({
      where: {
        workerId_periodYyyyMm: {
          workerId: worker.id,
          periodYyyyMm: dto.periodYyyyMm,
        },
      },
      update: {
        workedDays,
        sickLeaveDays,
        absenceDays,
        overtime50Hrs,
        overtime100Hrs,
        familyDependentsCount,
        otherTaxableIncome,
        otherNonTaxableIncome,
        otherDeductions: totalOtherDeductions,
      },
      create: {
        workerId: worker.id,
        periodYyyyMm: dto.periodYyyyMm,
        workedDays,
        sickLeaveDays,
        absenceDays,
        overtime50Hrs,
        overtime100Hrs,
        familyDependentsCount,
        otherTaxableIncome,
        otherNonTaxableIncome,
        otherDeductions: totalOtherDeductions,
      },
    });

    // 8. Details breakdown
    const detailsData = [
      {
        conceptCode: 'SUELDO_BASE',
        conceptLabel: `Sueldo Base Proporcional (${workedDays} días)`,
        conceptType: 'TAXABLE_INCOME',
        amount: proportionalBaseSalary,
      },
    ];

    if (overtime50Amount > 0) {
      detailsData.push({
        conceptCode: 'HORAS_EXTRAS_50',
        conceptLabel: `Horas Extras 50% (${overtime50Hrs} hrs)`,
        conceptType: 'TAXABLE_INCOME',
        amount: overtime50Amount,
      });
    }

    if (overtime100Amount > 0) {
      detailsData.push({
        conceptCode: 'HORAS_EXTRAS_100',
        conceptLabel: `Horas Extras 100% (${overtime100Hrs} hrs)`,
        conceptType: 'TAXABLE_INCOME',
        amount: overtime100Amount,
      });
    }

    if (otherTaxableIncome > 0) {
      detailsData.push({
        conceptCode: 'OTROS_HABERES_IMPONIBLES',
        conceptLabel: 'Otros Haberes Imponibles / Bonos',
        conceptType: 'TAXABLE_INCOME',
        amount: otherTaxableIncome,
      });
    }

    // Legal deductions details
    detailsData.push({
      conceptCode: 'AFP',
      conceptLabel: `Descuento AFP (${worker.afp?.name || 'AFP'} ${afpRate.toFixed(2)}%)`,
      conceptType: 'LEGAL_DEDUCTION',
      amount: afpDeduction,
    });

    detailsData.push({
      conceptCode: 'SALUD',
      conceptLabel: `Descuento Salud (${worker.healthInstitution?.name || 'Fonasa'})`,
      conceptType: 'LEGAL_DEDUCTION',
      amount: healthDeduction,
    });

    if (afcDeduction > 0) {
      detailsData.push({
        conceptCode: 'AFC',
        conceptLabel: 'Seguro de Cesantía AFC (0.6%)',
        conceptType: 'LEGAL_DEDUCTION',
        amount: afcDeduction,
      });
    }

    if (uniqueTaxDeduction > 0) {
      detailsData.push({
        conceptCode: 'IMPUESTO_UNICO',
        conceptLabel: 'Impuesto Único de Segunda Categoría',
        conceptType: 'LEGAL_DEDUCTION',
        amount: uniqueTaxDeduction,
      });
    }

    // Non-taxable details
    if (familyAllowanceAmount > 0) {
      detailsData.push({
        conceptCode: 'ASIG_FAMILIAR',
        conceptLabel: `Asignación Familiar (${familyDependentsCount} cargas)`,
        conceptType: 'NON_TAXABLE_INCOME',
        amount: familyAllowanceAmount,
      });
    }

    if (otherNonTaxableIncome > 0) {
      detailsData.push({
        conceptCode: 'OTROS_HABERES_NO_IMPONIBLES',
        conceptLabel: 'Otros Haberes No Imponibles (Colación / Movilización)',
        conceptType: 'NON_TAXABLE_INCOME',
        amount: otherNonTaxableIncome,
      });
    }

    if (totalOtherDeductions > 0) {
      detailsData.push({
        conceptCode: 'OTROS_DESCUENTOS',
        conceptLabel: 'Otros Descuentos / Anticipos',
        conceptType: 'OTHER_DEDUCTION',
        amount: totalOtherDeductions,
      });
    }

    // Upsert Payroll record
    const existingPayroll = await this.prisma.payroll.findUnique({
      where: {
        workerId_periodYyyyMm: {
          workerId: worker.id,
          periodYyyyMm: dto.periodYyyyMm,
        },
      },
    });

    if (existingPayroll) {
      await this.prisma.payrollDetail.deleteMany({
        where: { payrollId: existingPayroll.id },
      });

      return this.prisma.payroll.update({
        where: { id: existingPayroll.id },
        data: {
          baseSalaryAgreed,
          totalTaxable,
          totalNonTaxable,
          totalLegalDeductions,
          totalOtherDeductions,
          netPayable,
          afpHistoricalName: worker.afp?.name || 'AFP Standard',
          afpHistoricalRate: afpRate,
          healthHistoricalName: worker.healthInstitution?.name || 'Fonasa',
          details: {
            create: detailsData,
          },
        },
        include: {
          worker: {
            include: { company: true },
          },
          details: true,
        },
      });
    }

    return this.prisma.payroll.create({
      data: {
        workerId: worker.id,
        periodYyyyMm: dto.periodYyyyMm,
        baseSalaryAgreed,
        totalTaxable,
        totalNonTaxable,
        totalLegalDeductions,
        totalOtherDeductions,
        netPayable,
        afpHistoricalName: worker.afp?.name || 'AFP Standard',
        afpHistoricalRate: afpRate,
        healthHistoricalName: worker.healthInstitution?.name || 'Fonasa',
        details: {
          create: detailsData,
        },
      },
      include: {
        worker: {
          include: { company: true },
        },
        details: true,
      },
    });
  }

  async findAll(userId: string, periodYyyyMm?: string, companyId?: number) {
    const where: any = {
      worker: {
        userId,
      },
    };

    if (periodYyyyMm) {
      where.periodYyyyMm = periodYyyyMm;
    }

    if (companyId) {
      where.worker.companyId = companyId;
    }

    return this.prisma.payroll.findMany({
      where,
      orderBy: { periodYyyyMm: 'desc' },
      include: {
        worker: {
          include: { company: true, afp: true, healthInstitution: true, contractType: true },
        },
        details: true,
      },
    });
  }

  async findOne(userId: string, id: number) {
    const payroll = await this.prisma.payroll.findFirst({
      where: {
        id,
        worker: { userId },
      },
      include: {
        worker: {
          include: { company: true, afp: true, healthInstitution: true, contractType: true, bank: true },
        },
        details: true,
      },
    });

    if (!payroll) {
      throw new NotFoundException(`Liquidación con ID ${id} no encontrada`);
    }

    return payroll;
  }

  async delete(userId: string, id: number) {
    const payroll = await this.prisma.payroll.findFirst({
      where: {
        id,
        worker: { userId },
      },
    });

    if (!payroll) {
      throw new NotFoundException(`Liquidación con ID ${id} no encontrada`);
    }

    return this.prisma.payroll.delete({
      where: { id },
    });
  }
}
