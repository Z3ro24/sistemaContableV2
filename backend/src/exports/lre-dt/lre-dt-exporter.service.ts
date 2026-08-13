import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExportLogsService } from '../export-logs/export-logs.service';

@Injectable()
export class LreDtExporterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly exportLogsService: ExportLogsService
  ) {}

  async generateLreCsv(userId: string, periodYyyyMm: string, companyId?: number): Promise<string> {
    if (!periodYyyyMm) {
      throw new BadRequestException('El período (periodYyyyMm) es obligatorio');
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
          },
        },
        details: true,
      },
      orderBy: { workerId: 'asc' },
    });

    let totalAmount = 0;
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

    const rows = payrolls.map((p) => {
      const w = p.worker;
      const workerFullName = [w?.name, w?.paternalLastName, w?.maternalLastName]
        .filter(Boolean)
        .join(' ');

      const afpDetail = p.details.find((d) => d.conceptCode === 'AFP');
      const healthDetail = p.details.find((d) => d.conceptCode === 'SALUD');
      const afcDetail = p.details.find((d) => d.conceptCode === 'AFC');
      const taxDetail = p.details.find((d) => d.conceptCode === 'IMPUESTO_UNICO');

      const netPayable = Number(p.netPayable);
      totalAmount += netPayable;

      return [
        `"${w?.rut || ''}"`,
        `"${workerFullName}"`,
        `"${w?.company?.name || 'Sin Empresa'}"`,
        `"${p.periodYyyyMm}"`,
        30,
        Number(p.baseSalaryAgreed),
        Number(p.totalTaxable),
        Number(p.totalNonTaxable),
        `"${p.afpHistoricalName || w?.afp?.name || 'AFP'}"`,
        afpDetail ? Number(afpDetail.amount) : 0,
        `"${p.healthHistoricalName || w?.healthInstitution?.name || 'Fonasa'}"`,
        healthDetail ? Number(healthDetail.amount) : 0,
        afcDetail ? Number(afcDetail.amount) : 0,
        taxDetail ? Number(taxDetail.amount) : 0,
        Number(p.totalLegalDeductions),
        Number(p.totalOtherDeductions),
        netPayable,
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const companyName = payrolls[0]?.worker?.company?.name || 'Empresa';
    const filename = `LRE_DT_${companyName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${periodYyyyMm}.csv`;

    // Persist Export Log
    await this.exportLogsService.create({
      userId,
      companyId,
      exportType: 'LRE_CSV',
      periodYyyyMm,
      recordCount: payrolls.length,
      totalAmount,
      filename,
      fileData: csvContent,
    });

    return csvContent;
  }
}
