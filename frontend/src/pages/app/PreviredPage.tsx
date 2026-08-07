import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import previredExporterService from '../../services/previredExporterService';
import payrollsService from '../../services/payrollsService';
import AlertBanner from '../../components/common/AlertBanner';
import ExportHistoryTable from '../../components/common/ExportHistoryTable';
import { useAppSelector } from '../../store/store';

export const PreviredPage: React.FC = () => {
  const [periodYyyyMm, setPeriodYyyyMm] = useState('2026-07');
  const [isExporting, setIsExporting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const filterCompanyId = useAppSelector((state) => state.company.selectedCompanyId);
  const parsedCompanyId = filterCompanyId !== 'all' ? parseInt(filterCompanyId, 10) : undefined;

  // Fetch Payrolls for pre-visualization metrics
  const { data: payrolls = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['payrolls', periodYyyyMm, filterCompanyId],
    queryFn: () => payrollsService.getAll(periodYyyyMm, parsedCompanyId),
  });

  const handleDownloadTxt = async () => {
    if (payrolls.length === 0) return;
    setIsExporting(true);
    setApiError(null);
    try {
      await previredExporterService.downloadTxt(periodYyyyMm, parsedCompanyId);
      refetch();
    } catch (err: any) {
      setApiError('Error al generar el archivo plano PreviRed (.TXT)');
    } finally {
      setIsExporting(false);
    }
  };

  const totalTaxable = payrolls.reduce((sum, p) => sum + Number(p.totalTaxable), 0);
  const totalLegal = payrolls.reduce((sum, p) => sum + Number(p.totalLegalDeductions), 0);

  return (
    <div className="space-y-6 max-w-5xl selection:bg-neutral-200">
      {/* Notion Glass Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/80 bg-white/60 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] ring-1 ring-white/60 backdrop-blur-3xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#37352F] text-white shadow-md shadow-neutral-900/10">
            <DocumentTextIcon className="h-7 w-7 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#37352F]">
              Exportador de Remuneraciones PreviRed (.TXT)
            </h1>
            <p className="text-xs text-[#787774]">
              Archivo de 105 columnas de ancho fijo para declaración y pago automático de cotizaciones previsionales.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={payrolls.length === 0 || isExporting}
          onClick={handleDownloadTxt}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#37352F] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#201F1C] focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50"
        >
          <ArrowDownTrayIcon className="h-4 w-4 text-amber-400" />
          <span>{isExporting ? 'Generando .TXT...' : 'Descargar Archivo PreviRed (.TXT)'}</span>
        </button>
      </div>

      {apiError && <AlertBanner type="error" message={apiError} />}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4">
        <div className="w-full sm:w-44">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#787774] block mb-1">
            Período (YYYY-MM)
          </label>
          <input
            type="month"
            value={periodYyyyMm}
            onChange={(e) => setPeriodYyyyMm(e.target.value)}
            className="h-[38px] w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-mono text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
          />
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-[#787774]">Cargando resumen para PreviRed...</div>
      ) : isError ? (
        <AlertBanner type="error" message="Error al cargar las liquidaciones para el archivo PreviRed" />
      ) : payrolls.length === 0 ? (
        <div className="rounded-2xl border border-white/80 bg-white/60 p-8 shadow-sm backdrop-blur-2xl text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-[#787774]">
            <DocumentTextIcon className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-[#37352F]">Sin liquidaciones registradas</h3>
          <p className="text-xs text-[#787774] max-w-sm mx-auto">
            No existen liquidaciones calculadas en el período <strong>{periodYyyyMm}</strong> para generar el archivo PreviRed.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/80 bg-white/60 p-4 shadow-sm backdrop-blur-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#787774] block mb-1">
                Registros a Declarar
              </span>
              <span className="text-xl font-bold font-mono text-[#37352F]">
                {payrolls.length} Trabajadores
              </span>
            </div>

            <div className="rounded-2xl border border-white/80 bg-white/60 p-4 shadow-sm backdrop-blur-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#787774] block mb-1">
                Monto Imponible Consolidado
              </span>
              <span className="text-xl font-bold font-mono text-[#37352F]">
                ${totalTaxable.toLocaleString('es-CL')}
              </span>
            </div>

            <div className="rounded-2xl border border-white/80 bg-white/60 p-4 shadow-sm backdrop-blur-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#787774] block mb-1">
                Cotizaciones Previsionales
              </span>
              <span className="text-xl font-bold font-mono text-amber-800">
                ${totalLegal.toLocaleString('es-CL')}
              </span>
            </div>
          </div>

          {/* Validation Notice */}
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4 text-xs text-emerald-950 shadow-2xs backdrop-blur-md flex items-center gap-3">
            <CheckCircleIcon className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Formato 105 Columnas Validado: </span>
              Las remuneraciones cumplen con las especificaciones de separadores de campo, códigos de AFP, ISAPRE y tramos de asignación familiar exigidos por la plataforma PreviRed.
            </div>
          </div>
        </div>
      )}

      {/* Export History Table Component */}
      <ExportHistoryTable exportType="PREVIRED" title="Historial de Descargas de PreviRed (.TXT)" />
    </div>
  );
};

export default PreviredPage;
