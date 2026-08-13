import React, { useRef } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon, ArrowDownTrayIcon, PrinterIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';
import { numberToWordsCLP } from '../../utils/numberToWords';

// @ts-ignore
import html2pdf from 'html2pdf.js';

interface PayrollDetail {
  id?: number;
  conceptCode: string;
  conceptLabel: string;
  conceptType: string;
  amount: number | string;
}

interface PayrollPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  payroll: {
    id: number;
    periodYyyyMm: string;
    issueDate?: string;
    baseSalaryAgreed: number | string;
    totalTaxable: number | string;
    totalNonTaxable: number | string;
    totalLegalDeductions: number | string;
    totalOtherDeductions: number | string;
    netPayable: number | string;
    afpHistoricalName?: string | null;
    afpHistoricalRate?: number | string | null;
    healthHistoricalName?: string | null;
    details?: PayrollDetail[];
    worker?: {
      name: string;
      paternalLastName?: string | null;
      maternalLastName?: string | null;
      rut: string;
      entryDate?: string | null;
      company?: {
        name: string;
        rutCompany: string;
        address?: string | null;
      } | null;
      afp?: { name: string; commissionRate: number | string } | null;
      healthInstitution?: { name: string; isIsapre: boolean } | null;
      contractType?: { name: string } | null;
      jobPosition?: { name: string } | null;
    };
  } | null;
}

export const PayrollPdfModal: React.FC<PayrollPdfModalProps> = ({ isOpen, onClose, payroll }) => {
  const documentRef = useRef<HTMLDivElement>(null);

  if (!payroll) return null;

  const worker = payroll.worker;
  const company = worker?.company;

  const workerFullName = [worker?.name, worker?.paternalLastName, worker?.maternalLastName]
    .filter(Boolean)
    .join(' ');

  const taxableItems = payroll.details?.filter((d) => d.conceptType === 'TAXABLE_INCOME') || [];
  const nonTaxableItems = payroll.details?.filter((d) => d.conceptType === 'NON_TAXABLE_INCOME') || [];
  const legalDeductions = payroll.details?.filter((d) => d.conceptType === 'LEGAL_DEDUCTION') || [];
  const otherDeductions = payroll.details?.filter((d) => d.conceptType === 'OTHER_DEDUCTION') || [];

  const handleDownloadPdf = async () => {
    if (!documentRef.current) return;

    // Clone element to a standalone invisible container at (0,0) with z-index -9999
    // This avoids html2canvas negative offset crop bugs and modal scroll clipping
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '0px';
    container.style.top = '0px';
    container.style.zIndex = '-9999';
    container.style.opacity = '1';
    container.style.pointerEvents = 'none';
    container.style.width = '750px';
    container.style.backgroundColor = '#ffffff';

    const clone = documentRef.current.cloneNode(true) as HTMLElement;
    clone.style.margin = '0';
    clone.style.maxWidth = '100%';
    clone.style.boxShadow = 'none';
    clone.style.border = 'none';

    container.appendChild(clone);
    document.body.appendChild(container);

    const opt = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: `Liquidacion_${worker?.rut || 'Trabajador'}_${payroll.periodYyyyMm}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 750,
        onclone: (clonedDoc: Document) => {
          const styleTags = clonedDoc.querySelectorAll('style');
          styleTags.forEach((tag) => {
            if (tag.innerHTML.includes('oklch')) {
              tag.innerHTML = tag.innerHTML.replace(/oklch\([^)]+\)/g, '#37352f');
            }
          });
        },
      },
      jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' as const },
    };

    try {
      await html2pdf().set(opt).from(container).save();
    } finally {
      document.body.removeChild(container);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formattedPeriod = () => {
    if (!payroll.periodYyyyMm) return '';
    const [year, month] = payroll.periodYyyyMm.split('-');
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const monthName = months[parseInt(month, 10) - 1] || month;
    return `${monthName} ${year}`;
  };

  const netPayableNumber = Number(payroll.netPayable);
  const netPayableInWords = numberToWordsCLP(netPayableNumber);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" aria-hidden="true" />

      {/* Modal Container */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-2 sm:p-4">
        <DialogPanel className="w-full max-w-4xl max-h-[95vh] flex flex-col rounded-3xl border border-white/80 bg-white shadow-2xl backdrop-blur-2xl transition-all selection:bg-neutral-200">
          
          {/* Header Action Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/80 rounded-t-3xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#37352F] text-white shadow-xs">
                <DocumentCheckIcon className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-[#37352F]">
                  Liquidación de Sueldo ({formattedPeriod()})
                </DialogTitle>
                <p className="text-xs text-[#787774]">
                  Documento Oficial de Remuneración conforme a la Dirección del Trabajo (DT Chile)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#37352F] shadow-2xs hover:bg-neutral-100 transition-all"
              >
                <PrinterIcon className="h-4 w-4 text-[#787774]" />
                <span className="hidden sm:inline">Imprimir</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                className="flex items-center gap-1.5 rounded-xl bg-[#37352F] px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#201F1C] transition-all"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Descargar PDF</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-1.5 text-[#787774] hover:bg-neutral-200 hover:text-[#37352F] transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Printable Document Body */}
          <div className="p-6 overflow-y-auto flex-1 bg-neutral-100">
            <div
              ref={documentRef}
              style={{ backgroundColor: '#ffffff', color: '#37352F', borderColor: '#d4d4d4' }}
              className="max-w-3xl mx-auto p-8 rounded-xl border shadow-md font-sans text-xs space-y-6 print:p-0 print:border-none print:shadow-none"
            >
              {/* Document Header */}
              <div style={{ borderColor: '#37352F' }} className="flex justify-between items-start border-b-2 pb-4">
                <div>
                  <h2 style={{ color: '#37352F' }} className="text-base font-extrabold uppercase tracking-tight">
                    {company?.name || 'EMPRESA NO ASIGNADA'}
                  </h2>
                  <p style={{ color: '#787774' }} className="text-[11px]">RUT Empresa: <strong>{company?.rutCompany || 'N/A'}</strong></p>
                  <p style={{ color: '#787774' }} className="text-[11px]">Dirección: {company?.address || 'Chile'}</p>
                </div>
                <div className="text-right">
                  <h1 style={{ color: '#37352F' }} className="text-lg font-black uppercase tracking-wide">
                    Liquidación de Sueldo
                  </h1>
                  <span style={{ backgroundColor: '#f5f5f5', color: '#37352F', borderColor: '#d4d4d4' }} className="inline-block px-3 py-1 rounded-md text-xs font-bold font-mono border mt-1">
                    PERÍODO: {payroll.periodYyyyMm}
                  </span>
                </div>
              </div>

              {/* Worker & Employment Info Section */}
              <div style={{ backgroundColor: '#f9f9f9', borderColor: '#e5e5e5' }} className="grid grid-cols-2 gap-4 p-4 rounded-xl border">
                <div className="space-y-1">
                  <p><strong>Nombre Trabajador:</strong> <span className="uppercase">{workerFullName || 'N/A'}</span></p>
                  <p><strong>RUT Trabajador:</strong> <span className="font-mono">{worker?.rut || 'N/A'}</span></p>
                  <p><strong>Cargo / Función:</strong> {worker?.jobPosition?.name || 'Dependiente'}</p>
                  <p><strong>Tipo de Contrato:</strong> {worker?.contractType?.name || 'Indefinido'}</p>
                </div>
                <div className="space-y-1">
                  <p><strong>Fecha de Ingreso:</strong> {worker?.entryDate ? new Date(worker.entryDate).toLocaleDateString('es-CL') : 'N/A'}</p>
                  <p><strong>Días Trabajados:</strong> 30 días</p>
                  <p><strong>AFP Afiliada:</strong> {payroll.afpHistoricalName || worker?.afp?.name || 'N/A'} ({payroll.afpHistoricalRate || worker?.afp?.commissionRate || 10}%)</p>
                  <p><strong>Salud:</strong> {payroll.healthHistoricalName || worker?.healthInstitution?.name || 'Fonasa'}</p>
                </div>
              </div>

              {/* Earnings vs Deductions Side-by-Side Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column: Haberes */}
                <div style={{ borderColor: '#d4d4d4' }} className="border rounded-xl overflow-hidden flex flex-col justify-between">
                  <div style={{ backgroundColor: '#262626', color: '#ffffff' }} className="text-[11px] font-bold uppercase px-3 py-2">
                    I. Haberes (Ingresos)
                  </div>
                  <div className="p-3 space-y-2 text-xs flex-1">
                    <p style={{ color: '#737373', borderColor: '#e5e5e5' }} className="font-bold border-b pb-1 text-[10px] uppercase">A. Haberes Imponibles</p>
                    <div className="flex justify-between">
                      <span>Sueldo Base Pactado</span>
                      <span className="font-mono">${Number(payroll.baseSalaryAgreed).toLocaleString('es-CL')}</span>
                    </div>
                    {taxableItems.map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{item.conceptLabel}</span>
                        <span className="font-mono">${Number(item.amount).toLocaleString('es-CL')}</span>
                      </div>
                    ))}
                    <div style={{ borderColor: '#e5e5e5', color: '#171717' }} className="flex justify-between font-bold border-t pt-1">
                      <span>Total Imponible</span>
                      <span className="font-mono">${Number(payroll.totalTaxable).toLocaleString('es-CL')}</span>
                    </div>

                    <p style={{ color: '#737373', borderColor: '#e5e5e5' }} className="font-bold border-b pb-1 text-[10px] uppercase pt-2">B. Haberes No Imponibles</p>
                    {nonTaxableItems.length === 0 ? (
                      <p style={{ color: '#a3a3a3' }} className="text-[11px] italic">Sin haberes no imponibles</p>
                    ) : (
                      nonTaxableItems.map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <span>{item.conceptLabel}</span>
                          <span className="font-mono">${Number(item.amount).toLocaleString('es-CL')}</span>
                        </div>
                      ))
                    )}
                    <div style={{ borderColor: '#e5e5e5', color: '#171717' }} className="flex justify-between font-bold border-t pt-1">
                      <span>Total No Imponible</span>
                      <span className="font-mono">${Number(payroll.totalNonTaxable).toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#f5f5f5', borderColor: '#d4d4d4' }} className="p-3 font-bold border-t flex justify-between">
                    <span>TOTAL HABERES</span>
                    <span className="font-mono text-sm">${(Number(payroll.totalTaxable) + Number(payroll.totalNonTaxable)).toLocaleString('es-CL')}</span>
                  </div>
                </div>

                {/* Right Column: Descuentos */}
                <div style={{ borderColor: '#d4d4d4' }} className="border rounded-xl overflow-hidden flex flex-col justify-between">
                  <div style={{ backgroundColor: '#262626', color: '#ffffff' }} className="text-[11px] font-bold uppercase px-3 py-2">
                    II. Descuentos
                  </div>
                  <div className="p-3 space-y-2 text-xs flex-1">
                    <p style={{ color: '#737373', borderColor: '#e5e5e5' }} className="font-bold border-b pb-1 text-[10px] uppercase">A. Descuentos Previsionales y Tributarios</p>
                    {legalDeductions.map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{item.conceptLabel}</span>
                        <span className="font-mono">${Number(item.amount).toLocaleString('es-CL')}</span>
                      </div>
                    ))}
                    <div style={{ borderColor: '#e5e5e5', color: '#171717' }} className="flex justify-between font-bold border-t pt-1">
                      <span>Total Descuentos Legales</span>
                      <span className="font-mono">${Number(payroll.totalLegalDeductions).toLocaleString('es-CL')}</span>
                    </div>

                    <p style={{ color: '#737373', borderColor: '#e5e5e5' }} className="font-bold border-b pb-1 text-[10px] uppercase pt-2">B. Otros Descuentos</p>
                    {otherDeductions.length === 0 ? (
                      <p style={{ color: '#a3a3a3' }} className="text-[11px] italic">Sin otros descuentos</p>
                    ) : (
                      otherDeductions.map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <span>{item.conceptLabel}</span>
                          <span className="font-mono">${Number(item.amount).toLocaleString('es-CL')}</span>
                        </div>
                      ))
                    )}
                    <div style={{ borderColor: '#e5e5e5', color: '#171717' }} className="flex justify-between font-bold border-t pt-1">
                      <span>Total Otros Descuentos</span>
                      <span className="font-mono">${Number(payroll.totalOtherDeductions).toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#f5f5f5', borderColor: '#d4d4d4' }} className="p-3 font-bold border-t flex justify-between">
                    <span>TOTAL DESCUENTOS</span>
                    <span className="font-mono text-sm">${(Number(payroll.totalLegalDeductions) + Number(payroll.totalOtherDeductions)).toLocaleString('es-CL')}</span>
                  </div>
                </div>
              </div>

              {/* Net Payable Highlight Banner */}
              <div style={{ backgroundColor: '#37352F', color: '#ffffff' }} className="p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span style={{ color: '#a3a3a3' }} className="text-[10px] uppercase font-bold block tracking-wider">
                    ALCANCE LÍQUIDO A RECIBIR
                  </span>
                  <span style={{ color: '#e5e5e5' }} className="text-xs italic font-medium">
                    Son: {netPayableInWords}
                  </span>
                </div>
                <span style={{ color: '#ffffff' }} className="text-2xl font-black font-mono tracking-tight self-end sm:self-auto">
                  ${netPayableNumber.toLocaleString('es-CL')} CLP
                </span>
              </div>

              {/* Signatures Footer Block */}
              <div style={{ color: '#525252' }} className="pt-12 grid grid-cols-2 gap-8 text-center text-xs">
                <div className="space-y-2">
                  <div style={{ borderColor: '#a3a3a3' }} className="border-t mx-4" />
                  <p style={{ color: '#37352F' }} className="font-bold">Firma Trabajador</p>
                  <p style={{ color: '#a3a3a3' }} className="text-[10px]">Recibí Conforme</p>
                </div>
                <div className="space-y-2">
                  <div style={{ borderColor: '#a3a3a3' }} className="border-t mx-4" />
                  <p style={{ color: '#37352F' }} className="font-bold">Firma Empleador</p>
                  <p style={{ color: '#a3a3a3' }} className="text-[10px]">{company?.name || 'Representante Legal'}</p>
                </div>
              </div>

              <div style={{ color: '#a3a3a3', borderColor: '#e5e5e5' }} className="text-[9px] text-center pt-4 border-t">
                Documento emitido por Sistema Contable V2 - Validez conforme a la legislación laboral chilena.
              </div>
            </div>
          </div>

        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default PayrollPdfModal;
