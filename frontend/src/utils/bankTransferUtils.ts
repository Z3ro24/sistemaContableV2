import { saveAs } from 'file-saver';
import type { PayrollExportData } from './massExportUtils';

export interface InvalidWorkerBankData {
  payrollId: number;
  workerName: string;
  rut: string;
  missingFields: string[];
}

export interface BankValidationResult {
  validPayrolls: PayrollExportData[];
  invalidPayrolls: InvalidWorkerBankData[];
  totalAmountToTransfer: number;
}

export type BankFormatType = 'SANTANDER' | 'BANCO_ESTADO_PAE' | 'BANCO_DE_CHILE' | 'UNIVERSAL_TEF';

/**
 * Validates worker bank info before generating transfer file
 */
export function validateWorkerBankData(payrolls: PayrollExportData[]): BankValidationResult {
  const validPayrolls: PayrollExportData[] = [];
  const invalidPayrolls: InvalidWorkerBankData[] = [];
  let totalAmountToTransfer = 0;

  payrolls.forEach((p) => {
    const worker = p.worker;
    const missing: string[] = [];

    if (!worker?.bank && !worker?.bankAccountType) {
      missing.push('Banco');
    }
    if (!worker?.bankAccountType) {
      missing.push('Tipo de Cuenta');
    }
    if (!worker?.bankAccountNumber || worker.bankAccountNumber.trim() === '') {
      missing.push('Número de Cuenta');
    }

    const workerFullName = [worker?.name, worker?.paternalLastName, worker?.maternalLastName]
      .filter(Boolean)
      .join(' ') || 'Trabajador';

    if (missing.length > 0) {
      invalidPayrolls.push({
        payrollId: p.id,
        workerName: workerFullName,
        rut: worker?.rut || 'Sin RUT',
        missingFields: missing,
      });
    } else {
      validPayrolls.push(p);
      totalAmountToTransfer += Number(p.netPayable);
    }
  });

  return {
    validPayrolls,
    invalidPayrolls,
    totalAmountToTransfer,
  };
}

/**
 * Clean RUT (e.g. "12.345.678-9" -> "12345678-9")
 */
function cleanRut(rut?: string): string {
  if (!rut) return '';
  return rut.replace(/\./g, '').trim();
}

/**
 * Generate Santander CSV format
 */
export function generateSantanderCsv(payrolls: PayrollExportData[], companyName: string): void {
  const period = payrolls[0]?.periodYyyyMm || 'Periodo';
  const cleanCompanyName = companyName.replace(/[^a-zA-Z0-9_-]/g, '_');

  const headers = ['RUT;Nombre;TipoCuenta;NumeroCuenta;Monto;Email'];

  const rows = payrolls.map((p) => {
    const worker = p.worker;
    const rut = cleanRut(worker?.rut);
    const workerName = [worker?.name, worker?.paternalLastName, worker?.maternalLastName]
      .filter(Boolean)
      .join(' ');
    const accountType = worker?.bankAccountType || 'Cuenta Corriente';
    const accountNum = worker?.bankAccountNumber || '';
    const amount = Math.round(Number(p.netPayable));

    return `${rut};${workerName};${accountType};${accountNum};${amount};`;
  });

  const csvContent = '\uFEFF' + [...headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `Nomina_Santander_${cleanCompanyName}_${period}.csv`);
}

/**
 * Generate BancoEstado PAE (.txt) fixed-width format
 */
export function generateBancoEstadoPaeTxt(payrolls: PayrollExportData[], companyName: string): void {
  const period = payrolls[0]?.periodYyyyMm || 'Periodo';
  const cleanCompanyName = companyName.replace(/[^a-zA-Z0-9_-]/g, '_');

  const rows = payrolls.map((p) => {
    const worker = p.worker;
    // Format RUT to 9 digits (no dash, right-aligned with leading spaces/zeros)
    const rawRut = cleanRut(worker?.rut).replace(/-/g, '').padStart(9, '0');
    const workerName = [worker?.name, worker?.paternalLastName, worker?.maternalLastName]
      .filter(Boolean)
      .join(' ')
      .slice(0, 30)
      .padEnd(30, ' ');
    const bankCode = '012'; // BancoEstado SBIF Code
    const accountNum = (worker?.bankAccountNumber || '').replace(/[^0-9]/g, '').padStart(12, '0');
    const amount = Math.round(Number(p.netPayable)).toString().padStart(10, '0');

    return `${rawRut}${workerName}${bankCode}${accountNum}${amount}`;
  });

  const txtContent = rows.join('\r\n');
  const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
  saveAs(blob, `Nomina_BancoEstado_PAE_${cleanCompanyName}_${period}.txt`);
}

/**
 * Generate Banco de Chile CSV format
 */
export function generateBancoDeChileCsv(payrolls: PayrollExportData[], companyName: string): void {
  const period = payrolls[0]?.periodYyyyMm || 'Periodo';
  const cleanCompanyName = companyName.replace(/[^a-zA-Z0-9_-]/g, '_');

  const headers = ['RUT;Nombre;Banco;TipoCuenta;NumeroCuenta;MontoLiquido'];

  const rows = payrolls.map((p) => {
    const worker = p.worker;
    const rut = cleanRut(worker?.rut);
    const workerName = [worker?.name, worker?.paternalLastName, worker?.maternalLastName]
      .filter(Boolean)
      .join(' ');
    const bankName = worker?.bank?.name || 'Banco de Chile';
    const accountType = worker?.bankAccountType || 'Cuenta Corriente';
    const accountNum = worker?.bankAccountNumber || '';
    const amount = Math.round(Number(p.netPayable));

    return `${rut};${workerName};${bankName};${accountType};${accountNum};${amount}`;
  });

  const csvContent = '\uFEFF' + [...headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `Nomina_BancoDeChile_${cleanCompanyName}_${period}.csv`);
}

/**
 * Generate Universal TEF Multibanco CSV format
 */
export function generateUniversalTefCsv(payrolls: PayrollExportData[], companyName: string): void {
  const period = payrolls[0]?.periodYyyyMm || 'Periodo';
  const cleanCompanyName = companyName.replace(/[^a-zA-Z0-9_-]/g, '_');

  const headers = ['RUT Trabajador;Nombre Completo;Empresa;Banco Destino;Tipo Cuenta;Numero Cuenta;Monto a Transferir ($)'];

  const rows = payrolls.map((p) => {
    const worker = p.worker;
    const rut = cleanRut(worker?.rut);
    const workerName = [worker?.name, worker?.paternalLastName, worker?.maternalLastName]
      .filter(Boolean)
      .join(' ');
    const company = worker?.company?.name || companyName;
    const bankName = worker?.bank?.name || 'No especificado';
    const accountType = worker?.bankAccountType || 'No especificado';
    const accountNum = worker?.bankAccountNumber || '';
    const amount = Math.round(Number(p.netPayable));

    return `${rut};${workerName};${company};${bankName};${accountType};${accountNum};${amount}`;
  });

  const csvContent = '\uFEFF' + [...headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `Nomina_Transferencia_Universal_${cleanCompanyName}_${period}.csv`);
}

/**
 * Dispatcher function for mass transfer file export
 */
export function exportBankTransferFile(
  payrolls: PayrollExportData[],
  format: BankFormatType,
  companyName = 'Todas_Las_Empresas'
): void {
  switch (format) {
    case 'SANTANDER':
      generateSantanderCsv(payrolls, companyName);
      break;
    case 'BANCO_ESTADO_PAE':
      generateBancoEstadoPaeTxt(payrolls, companyName);
      break;
    case 'BANCO_DE_CHILE':
      generateBancoDeChileCsv(payrolls, companyName);
      break;
    case 'UNIVERSAL_TEF':
    default:
      generateUniversalTefCsv(payrolls, companyName);
      break;
  }
}
