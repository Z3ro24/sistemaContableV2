import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertNoveltyDto } from './dto/upsert-novelty.dto';

@Injectable()
export class NoveltiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, periodYyyyMm?: string, companyId?: number) {
    const where: any = {
      worker: { userId },
    };

    if (periodYyyyMm) {
      where.periodYyyyMm = periodYyyyMm;
    }

    if (companyId) {
      where.worker.companyId = companyId;
    }

    return this.prisma.monthlyNovelty.findMany({
      where,
      include: {
        worker: {
          include: {
            company: true,
          },
        },
      },
      orderBy: [
        { periodYyyyMm: 'desc' },
        { workerId: 'asc' },
      ],
    });
  }

  async findByWorkerAndPeriod(userId: string, workerId: number, periodYyyyMm: string) {
    const worker = await this.prisma.worker.findFirst({
      where: { id: workerId, userId },
    });

    if (!worker) {
      throw new NotFoundException(`Trabajador con ID ${workerId} no encontrado`);
    }

    const novelty = await this.prisma.monthlyNovelty.findUnique({
      where: {
        workerId_periodYyyyMm: {
          workerId,
          periodYyyyMm,
        },
      },
      include: {
        worker: {
          include: {
            company: true,
          },
        },
      },
    });

    if (novelty) {
      return novelty;
    }

    // Default fallback values if not pre-saved
    return {
      id: null,
      workerId,
      periodYyyyMm,
      workedDays: 30,
      sickLeaveDays: 0,
      absenceDays: 0,
      overtime50Hrs: 0,
      overtime100Hrs: 0,
      familyDependentsCount: 0,
      otherTaxableIncome: 0,
      otherNonTaxableIncome: 0,
      otherDeductions: 0,
      worker,
    };
  }

  async create(userId: string, dto: UpsertNoveltyDto) {
    const worker = await this.prisma.worker.findFirst({
      where: { id: dto.workerId, userId },
    });

    if (!worker) {
      throw new NotFoundException(`Trabajador con ID ${dto.workerId} no encontrado`);
    }

    // Duplicate check
    const existing = await this.prisma.monthlyNovelty.findUnique({
      where: {
        workerId_periodYyyyMm: {
          workerId: dto.workerId,
          periodYyyyMm: dto.periodYyyyMm,
        },
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Ya existe una novedad registrada para ${worker.name} en el período ${dto.periodYyyyMm}. Utilice la opción de edición para modificar los datos.`
      );
    }

    return this.prisma.monthlyNovelty.create({
      data: {
        workerId: dto.workerId,
        periodYyyyMm: dto.periodYyyyMm,
        workedDays: dto.workedDays ?? 30,
        sickLeaveDays: dto.sickLeaveDays ?? 0,
        absenceDays: dto.absenceDays ?? 0,
        overtime50Hrs: dto.overtime50Hrs ?? 0,
        overtime100Hrs: dto.overtime100Hrs ?? 0,
        familyDependentsCount: dto.familyDependentsCount ?? 0,
        otherTaxableIncome: dto.otherTaxableIncome ?? 0,
        otherNonTaxableIncome: dto.otherNonTaxableIncome ?? 0,
        otherDeductions: dto.otherDeductions ?? 0,
      },
      include: {
        worker: {
          include: {
            company: true,
          },
        },
      },
    });
  }

  async update(userId: string, id: number, dto: UpsertNoveltyDto) {
    const existing = await this.prisma.monthlyNovelty.findFirst({
      where: {
        id,
        worker: { userId },
      },
    });

    if (!existing) {
      throw new NotFoundException(`Registro de novedad con ID ${id} no encontrado`);
    }

    return this.prisma.monthlyNovelty.update({
      where: { id },
      data: {
        workedDays: dto.workedDays ?? existing.workedDays,
        sickLeaveDays: dto.sickLeaveDays ?? existing.sickLeaveDays,
        absenceDays: dto.absenceDays ?? existing.absenceDays,
        overtime50Hrs: dto.overtime50Hrs ?? existing.overtime50Hrs,
        overtime100Hrs: dto.overtime100Hrs ?? existing.overtime100Hrs,
        familyDependentsCount: dto.familyDependentsCount ?? existing.familyDependentsCount,
        otherTaxableIncome: dto.otherTaxableIncome ?? existing.otherTaxableIncome,
        otherNonTaxableIncome: dto.otherNonTaxableIncome ?? existing.otherNonTaxableIncome,
        otherDeductions: dto.otherDeductions ?? existing.otherDeductions,
      },
      include: {
        worker: {
          include: {
            company: true,
          },
        },
      },
    });
  }

  async upsert(userId: string, dto: UpsertNoveltyDto) {
    const worker = await this.prisma.worker.findFirst({
      where: { id: dto.workerId, userId },
    });

    if (!worker) {
      throw new NotFoundException(`Trabajador con ID ${dto.workerId} no encontrado`);
    }

    const workedDays = dto.workedDays ?? 30;
    const sickLeaveDays = dto.sickLeaveDays ?? 0;
    const absenceDays = dto.absenceDays ?? 0;
    const overtime50Hrs = dto.overtime50Hrs ?? 0;
    const overtime100Hrs = dto.overtime100Hrs ?? 0;
    const familyDependentsCount = dto.familyDependentsCount ?? 0;
    const otherTaxableIncome = dto.otherTaxableIncome ?? 0;
    const otherNonTaxableIncome = dto.otherNonTaxableIncome ?? 0;
    const otherDeductions = dto.otherDeductions ?? 0;

    return this.prisma.monthlyNovelty.upsert({
      where: {
        workerId_periodYyyyMm: {
          workerId: dto.workerId,
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
        otherDeductions,
      },
      create: {
        workerId: dto.workerId,
        periodYyyyMm: dto.periodYyyyMm,
        workedDays,
        sickLeaveDays,
        absenceDays,
        overtime50Hrs,
        overtime100Hrs,
        familyDependentsCount,
        otherTaxableIncome,
        otherNonTaxableIncome,
        otherDeductions,
      },
    });
  }

  async delete(userId: string, id: number) {
    const existing = await this.prisma.monthlyNovelty.findFirst({
      where: {
        id,
        worker: { userId },
      },
    });

    if (!existing) {
      throw new NotFoundException(`Registro de novedad con ID ${id} no encontrado`);
    }

    return this.prisma.monthlyNovelty.delete({
      where: { id },
    });
  }
}
