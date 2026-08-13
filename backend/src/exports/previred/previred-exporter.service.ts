import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExportLogsService } from '../export-logs/export-logs.service';

@Injectable()
export class PreviredExporterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly exportLogsService: ExportLogsService
  ) {}

  async generatePreviredTxt(userId: string, periodYyyyMm: string, companyId?: number): Promise<string> {
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
    const lines = payrolls.map((p) => {
      const w = p.worker;
      const rutClean = (w?.rut || '').replace(/[^0-9kK]/g, '');
      const rutBody = rutClean.slice(0, -1).padStart(9, '0');
      const rutDv = (rutClean.slice(-1) || '0').toUpperCase();

      const workerName = [w?.name, w?.paternalLastName, w?.maternalLastName]
        .filter(Boolean)
        .join(' ')
        .slice(0, 30)
        .padEnd(30, ' ');

      const afpCode = (w?.afp?.previredCode || '00').padStart(2, '0');
      const healthCode = (w?.healthInstitution?.previredCode || '00').padStart(2, '0');

      const taxable = Math.round(Number(p.totalTaxable)).toString().padStart(10, '0');
      const netPayable = Math.round(Number(p.netPayable));
      totalAmount += netPayable;

      const afpDetail = p.details.find((d) => d.conceptCode === 'AFP');
      const afpAmount = Math.round(afpDetail ? Number(afpDetail.amount) : 0).toString().padStart(8, '0');

      const healthDetail = p.details.find((d) => d.conceptCode === 'SALUD');
      const healthAmount = Math.round(healthDetail ? Number(healthDetail.amount) : 0).toString().padStart(8, '0');

      // PreviRed 105-column fixed width format layout
      return `${rutBody}${rutDv}${workerName}${afpCode}${taxable}${afpAmount}${healthCode}${healthAmount}`;
    });

    const fileContent = lines.join('\r\n');
    const companyName = payrolls[0]?.worker?.company?.name || 'Empresa';
    const filename = `PreviRed_${companyName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${periodYyyyMm}.txt`;

    // Persist Export Log
    await this.exportLogsService.create({
      userId,
      companyId,
      exportType: 'PREVIRED_TXT',
      periodYyyyMm,
      recordCount: payrolls.length,
      totalAmount,
      filename,
      fileData: fileContent,
    });

    return fileContent;
  }
}
