import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExportLogsService } from '../export-logs/export-logs.service';

export type BankFormatCode = 'SANTANDER' | 'BANCO_ESTADO_PAE' | 'BANCO_DE_CHILE' | 'UNIVERSAL_TEF';

@Injectable()
export class BancosExporterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly exportLogsService: ExportLogsService
  ) {}

  async generateBankFile(
    userId: string,
    format: BankFormatCode,
    periodYyyyMm: string,
    companyId?: number
  ): Promise<{ fileContent: string; filename: string }> {
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
            bank: true,
          },
        },
      },
      orderBy: { workerId: 'asc' },
    });

    let totalAmount = 0;
    const companyName = payrolls[0]?.worker?.company?.name || 'Empresa';
    const cleanCompany = companyName.replace(/[^a-zA-Z0-9_-]/g, '_');

    let fileContent = '';
    let filename = '';

    if (format === 'BANCO_ESTADO_PAE') {
      filename = `Nomina_BancoEstado_PAE_${cleanCompany}_${periodYyyyMm}.txt`;
      const lines = payrolls.map((p) => {
        const w = p.worker;
        const rawRut = (w?.rut || '').replace(/[^0-9kK]/g, '').padStart(9, '0');
        const workerName = [w?.name, w?.paternalLastName, w?.maternalLastName]
          .filter(Boolean)
          .join(' ')
          .slice(0, 30)
          .padEnd(30, ' ');
        const bankCode = '012';
        const accountNum = (w?.bankAccountNumber || '').replace(/[^0-9]/g, '').padStart(12, '0');
        const amount = Math.round(Number(p.netPayable)).toString().padStart(10, '0');
        totalAmount += Number(p.netPayable);

        return `${rawRut}${workerName}${bankCode}${accountNum}${amount}`;
      });
      fileContent = lines.join('\r\n');
    } else {
      let headers: string[] = [];
      let rows: string[] = [];

      if (format === 'SANTANDER') {
        filename = `Nomina_Santander_${cleanCompany}_${periodYyyyMm}.csv`;
        headers = ['RUT;Nombre;TipoCuenta;NumeroCuenta;Monto;Email'];
        rows = payrolls.map((p) => {
          const w = p.worker;
          const rut = (w?.rut || '').replace(/\./g, '');
          const workerName = [w?.name, w?.paternalLastName, w?.maternalLastName].filter(Boolean).join(' ');
          const accountType = w?.bankAccountType || 'Cuenta Corriente';
          const accountNum = w?.bankAccountNumber || '';
          const amount = Math.round(Number(p.netPayable));
          totalAmount += amount;
          return `${rut};${workerName};${accountType};${accountNum};${amount};`;
        });
      } else if (format === 'BANCO_DE_CHILE') {
        filename = `Nomina_BancoDeChile_${cleanCompany}_${periodYyyyMm}.csv`;
        headers = ['RUT;Nombre;Banco;TipoCuenta;NumeroCuenta;MontoLiquido'];
        rows = payrolls.map((p) => {
          const w = p.worker;
          const rut = (w?.rut || '').replace(/\./g, '');
          const workerName = [w?.name, w?.paternalLastName, w?.maternalLastName].filter(Boolean).join(' ');
          const bankName = w?.bank?.name || 'Banco de Chile';
          const accountType = w?.bankAccountType || 'Cuenta Corriente';
          const accountNum = w?.bankAccountNumber || '';
          const amount = Math.round(Number(p.netPayable));
          totalAmount += amount;
          return `${rut};${workerName};${bankName};${accountType};${accountNum};${amount}`;
        });
      } else {
        // UNIVERSAL_TEF
        filename = `Nomina_Transferencia_Universal_${cleanCompany}_${periodYyyyMm}.csv`;
        headers = ['RUT Trabajador;Nombre Completo;Empresa;Banco Destino;Tipo Cuenta;Numero Cuenta;Monto a Transferir ($)'];
        rows = payrolls.map((p) => {
          const w = p.worker;
          const rut = (w?.rut || '').replace(/\./g, '');
          const workerName = [w?.name, w?.paternalLastName, w?.maternalLastName].filter(Boolean).join(' ');
          const company = w?.company?.name || companyName;
          const bankName = w?.bank?.name || 'No especificado';
          const accountType = w?.bankAccountType || 'No especificado';
          const accountNum = w?.bankAccountNumber || '';
          const amount = Math.round(Number(p.netPayable));
          totalAmount += amount;
          return `${rut};${workerName};${company};${bankName};${accountType};${accountNum};${amount}`;
        });
      }

      fileContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
    }

    // Persist Export Log
    await this.exportLogsService.create({
      userId,
      companyId,
      exportType: `BANCO_${format}`,
      periodYyyyMm,
      recordCount: payrolls.length,
      totalAmount,
      filename,
      fileData: fileContent,
    });

    return { fileContent, filename };
  }
}
