import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateExportLogDto {
  userId: string;
  companyId?: number;
  exportType: string;
  periodYyyyMm: string;
  recordCount: number;
  totalAmount: number;
  filename: string;
  fileData?: string;
}

@Injectable()
export class ExportLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateExportLogDto) {
    return this.prisma.exportLog.create({
      data: {
        userId: dto.userId,
        companyId: dto.companyId,
        exportType: dto.exportType,
        periodYyyyMm: dto.periodYyyyMm,
        recordCount: dto.recordCount,
        totalAmount: dto.totalAmount,
        filename: dto.filename,
        fileData: dto.fileData,
      },
    });
  }

  async findAll(userId: string, exportType?: string, periodYyyyMm?: string, companyId?: number) {
    const where: any = { userId };
    if (exportType) where.exportType = exportType;
    if (periodYyyyMm) where.periodYyyyMm = periodYyyyMm;
    if (companyId) where.companyId = companyId;

    return this.prisma.exportLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        exportType: true,
        periodYyyyMm: true,
        recordCount: true,
        totalAmount: true,
        filename: true,
        createdAt: true,
        companyId: true,
      },
    });
  }

  async findOne(userId: string, id: number) {
    const log = await this.prisma.exportLog.findFirst({
      where: { id, userId },
    });

    if (!log) {
      throw new NotFoundException(`Registro de exportación ID ${id} no encontrado`);
    }

    return log;
  }
}
