import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface LreRecord {
  payrollId: number;
  workerRut: string;
  workerName: string;
  companyName: string;
  periodYyyyMm: string;
  workedDays: number;
  baseSalary: number;
  totalTaxable: number;
  totalNonTaxable: number;
  afpName: string;
  afpDeduction: number;
  healthName: string;
  healthDeduction: number;
  afcDeduction: number;
  uniqueTaxDeduction: number;
  totalLegalDeductions: number;
  totalOtherDeductions: number;
  netPayable: number;
}

export interface LreSummaryResponse {
  periodYyyyMm: string;
  companyId?: number;
  companyName: string;
  totalWorkers: number;
  totalTaxable: number;
  totalNonTaxable: number;
  totalLegalDeductions: number;
  totalOtherDeductions: number;
  totalNetPayable: number;
  records: LreRecord[];
}

@Injectable()
export class LreService {
  constructor(private readonly prisma: PrismaService) {}

  async getLreReport(userId: string, periodYyyyMm: string, companyId?: number): Promise<LreSummaryResponse> {
    if (!periodYyyyMm) {
      throw new BadRequestException('El parámetro del período (periodYyyyMm) es obligatorio');
    }

    const where: any = {
      periodYyyyMm,
      worker: { userId },
    };

    if (companyId) {
      where.worker.companyId = companyId;
    }

    const payrolls = await this.prisma.payroll.findMany({
      where,
      include: {
        worker: {
          include: {
            company: true,
            afp: true,
            healthInstitution: true,
            contractType: true,
          },
        },
        details: true,
      },
      orderBy: { workerId: 'asc' },
    });

    let companyName = 'Todas las Empresas';
    if (companyId && payrolls.length > 0) {
      companyName = payrolls[0]?.worker?.company?.name || `Empresa ${companyId}`;
    }

    let totalTaxable = 0;
    let totalNonTaxable = 0;
    let totalLegalDeductions = 0;
    let totalOtherDeductions = 0;
    let totalNetPayable = 0;

    const records: LreRecord[] = payrolls.map((p) => {
      const worker = p.worker;
      const workerFullName = [worker?.name, worker?.paternalLastName, worker?.maternalLastName]
        .filter(Boolean)
        .join(' ');

      const afpDetail = p.details.find((d) => d.conceptCode === 'AFP');
      const healthDetail = p.details.find((d) => d.conceptCode === 'SALUD');
      const afcDetail = p.details.find((d) => d.conceptCode === 'AFC');
      const taxDetail = p.details.find((d) => d.conceptCode === 'IMPUESTO_UNICO');

      const netPayable = Number(p.netPayable);
      const taxable = Number(p.totalTaxable);
      const nonTaxable = Number(p.totalNonTaxable);
      const legal = Number(p.totalLegalDeductions);
      const other = Number(p.totalOtherDeductions);

      totalTaxable += taxable;
      totalNonTaxable += nonTaxable;
      totalLegalDeductions += legal;
      totalOtherDeductions += other;
      totalNetPayable += netPayable;

      return {
        payrollId: p.id,
        workerRut: worker?.rut || '',
        workerName: workerFullName,
        companyName: worker?.company?.name || 'Sin Empresa',
        periodYyyyMm: p.periodYyyyMm,
        workedDays: 30,
        baseSalary: Number(p.baseSalaryAgreed),
        totalTaxable: taxable,
        totalNonTaxable: nonTaxable,
        afpName: p.afpHistoricalName || worker?.afp?.name || 'AFP',
        afpDeduction: afpDetail ? Number(afpDetail.amount) : 0,
        healthName: p.healthHistoricalName || worker?.healthInstitution?.name || 'Fonasa',
        healthDeduction: healthDetail ? Number(healthDetail.amount) : 0,
        afcDeduction: afcDetail ? Number(afcDetail.amount) : 0,
        uniqueTaxDeduction: taxDetail ? Number(taxDetail.amount) : 0,
        totalLegalDeductions: legal,
        totalOtherDeductions: other,
        netPayable,
      };
    });

    return {
      periodYyyyMm,
      companyId,
      companyName,
      totalWorkers: payrolls.length,
      totalTaxable,
      totalNonTaxable,
      totalLegalDeductions,
      totalOtherDeductions,
      totalNetPayable,
      records,
    };
  }

  async exportLreCsv(userId: string, periodYyyyMm: string, companyId?: number): Promise<string> {
    const report = await this.getLreReport(userId, periodYyyyMm, companyId);

    const headers = [
      'RUT_TRABAJADOR',
      'NOMBRE_TRABAJADOR',
      'EMPRESA',
      'PERIODO',
      'DIAS_TRABAJADOS',
      'SUELDO_BASE',
      'TOTAL_IMPONIBLE',
      'TOTAL_NO_IMPONIBLE',
      'AFP_AFILIADA',
      'DESCUENTO_AFP',
      'INSTITUCION_SALUD',
      'DESCUENTO_SALUD',
      'DESCUENTO_AFC',
      'IMPUESTO_UNICO_2CAT',
      'TOTAL_DESCUENTOS_LEGALES',
      'OTROS_DESCUENTOS',
      'LIQUIDO_A_PAGAR',
    ];

    const rows = report.records.map((r) =>
      [
        `"${r.workerRut}"`,
        `"${r.workerName}"`,
        `"${r.companyName}"`,
        `"${r.periodYyyyMm}"`,
        r.workedDays,
        r.baseSalary,
        r.totalTaxable,
        r.totalNonTaxable,
        `"${r.afpName}"`,
        r.afpDeduction,
        `"${r.healthName}"`,
        r.healthDeduction,
        r.afcDeduction,
        r.uniqueTaxDeduction,
        r.totalLegalDeductions,
        r.totalOtherDeductions,
        r.netPayable,
      ].join(';')
    );

    return '\uFEFF' + [headers.join(';'), ...rows].join('\n');
  }
}
