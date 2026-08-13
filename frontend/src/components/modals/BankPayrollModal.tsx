import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  BuildingLibraryIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import type { PayrollExportData } from '../../utils/massExportUtils';
import {
  validateWorkerBankData,
  exportBankTransferFile,
  type BankFormatType,
} from '../../utils/bankTransferUtils';
import CustomSelect from '../common/CustomSelect';

interface BankPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  payrolls: PayrollExportData[];
  companyName: string;
}

interface FormatOption {
  value: BankFormatType;
  label: string;
  description: string;
}

const BANK_FORMAT_OPTIONS: FormatOption[] = [
  {
    value: 'UNIVERSAL_TEF',
    label: '🌐 Estándar Universal TEF (CSV Multibanco)',
    description: 'Compatible con cualquier portal web bancario empresa en Chile',
  },
  {
    value: 'SANTANDER',
    label: '🟢 Banco Santander Chile (CSV)',
    description: 'Estructura oficial para Nóminas de Pago Santander (separador ;)',
  },
  {
    value: 'BANCO_ESTADO_PAE',
    label: '🔵 BancoEstado PAE (.TXT Ancho Fijo / Cta RUT)',
    description: 'Archivo de Pago Automático de Empresas para BancoEstado',
  },
  {
    value: 'BANCO_DE_CHILE',
    label: '🔴 Banco de Chile / Edwards (CSV)',
    description: 'Formato directo para Banco de Chile y Banco Edwards',
  },
];

export const BankPayrollModal: React.FC<BankPayrollModalProps> = ({
  isOpen,
  onClose,
  payrolls,
  companyName,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<BankFormatType>('UNIVERSAL_TEF');
  const [onlyValid, setOnlyValid] = useState<boolean>(true);

  if (!isOpen) return null;

  const validation = validateWorkerBankData(payrolls);

  const { validPayrolls, invalidPayrolls } = validation;
  const targetPayrolls = onlyValid ? validPayrolls : payrolls;

  const totalAmount = targetPayrolls.reduce((sum, p) => sum + Number(p.netPayable), 0);
  const period = payrolls[0]?.periodYyyyMm || '2026-07';

  const handleDownload = () => {
    if (targetPayrolls.length === 0) return;
    exportBankTransferFile(targetPayrolls, selectedFormat, companyName);
    onClose();
  };

  const selectedOption = BANK_FORMAT_OPTIONS.find((o) => o.value === selectedFormat) || BANK_FORMAT_OPTIONS[0];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" aria-hidden="true" />

      {/* Modal Container */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl transition-all selection:bg-neutral-200 space-y-5">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200/60">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#37352F] text-white shadow-sm">
                <BuildingLibraryIcon className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-[#37352F]">
                  Generar Nómina Bancaria de Transferencia
                </DialogTitle>
                <p className="text-xs text-[#787774]">
                  Archivo de pago masivo de sueldos para el portal de tu banco en Chile.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#787774] hover:bg-neutral-100 hover:text-[#37352F] transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Stats Summary Card */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl border border-neutral-200/80 bg-neutral-50/80 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#787774] block">Empresa</span>
              <span className="font-bold text-[#37352F] truncate block">{companyName}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#787774] block">Período</span>
              <span className="font-mono font-bold text-[#37352F]">{period}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#787774] block">Total a Transferir</span>
              <span className="font-mono font-bold text-sm text-emerald-800">${totalAmount.toLocaleString('es-CL')} CLP</span>
            </div>
          </div>

          {/* Data Integrity Pre-Validation Banner */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#37352F] uppercase tracking-wider flex items-center gap-1.5">
              <span>Integridad de Datos Bancarios</span>
            </h4>

            {invalidPayrolls.length === 0 ? (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-900">
                <CheckCircleIcon className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>Todos los <strong>{validPayrolls.length} trabajadores</strong> cuentan con banco y número de cuenta configurados.</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 p-3.5 text-xs text-amber-900">
                  <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">
                      Se detectaron {invalidPayrolls.length} trabajador(es) con datos bancarios incompletos:
                    </p>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
                      {invalidPayrolls.map((inv) => (
                        <li key={inv.payrollId}>
                          <strong>{inv.workerName}</strong> ({inv.rut}): Faltan [{inv.missingFields.join(', ')}]
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-[#37352F]">
                    <input
                      type="checkbox"
                      checked={onlyValid}
                      onChange={(e) => setOnlyValid(e.target.checked)}
                      className="h-4 w-4 rounded-md border-neutral-300 text-[#37352F] focus:ring-[#37352F]"
                    />
                    <span>Exportar solo los <strong>{validPayrolls.length} trabajadores válidos</strong> (Excluir incompletos)</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Bank Format Selector */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-[#37352F] uppercase tracking-wider block">
              Formato de Banco Emisor *
            </label>
            <CustomSelect<FormatOption>
              options={BANK_FORMAT_OPTIONS}
              value={selectedOption}
              onChange={(opt) => setSelectedFormat(opt?.value || 'UNIVERSAL_TEF')}
            />
            <p className="text-[11px] italic text-[#787774] px-1">
              {selectedOption.description}
            </p>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200/60 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-[#37352F] shadow-2xs hover:bg-neutral-100"
            >
              Cancelar
            </button>

            <button
              type="button"
              disabled={targetPayrolls.length === 0}
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-xl bg-[#37352F] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#201F1C] disabled:opacity-50 transition-all"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>Descargar Nómina ({targetPayrolls.length})</span>
            </button>
          </div>

        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default BankPayrollModal;
