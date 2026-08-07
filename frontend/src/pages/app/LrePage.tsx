import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  TableCellsIcon,
  ArrowDownTrayIcon,
  DocumentCheckIcon,
} from '@heroicons/react/24/outline';
import lreService from '../../services/lreService';
import AlertBanner from '../../components/common/AlertBanner';
import ExportHistoryTable from '../../components/common/ExportHistoryTable';
import { useAppSelector } from '../../store/store';

export const LrePage: React.FC = () => {
  const [periodYyyyMm, setPeriodYyyyMm] = useState('2026-07');
  const [isExporting, setIsExporting] = useState(false);
  const filterCompanyId = useAppSelector((state) => state.company.selectedCompanyId);

  const parsedCompanyId = filterCompanyId !== 'all' ? parseInt(filterCompanyId, 10) : undefined;

  // Fetch LRE Report Data
  const { data: lreReport, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['lreReport', periodYyyyMm, filterCompanyId],
    queryFn: () => lreService.getReport(periodYyyyMm, parsedCompanyId),
  });

  const handleDownloadCsv = async () => {
    if (!lreReport || lreReport.records.length === 0) return;
    setIsExporting(true);
    try {
      await lreService.downloadCsv(periodYyyyMm, parsedCompanyId);
      refetch();
    } catch {
      alert('Error al descargar el archivo LRE');
    } finally {
      setIsExporting(false);
    }
  };

  const errorMessage = (error as any)?.response?.data?.message || 'Error al cargar los datos del Libro de Remuneraciones Electrónico';

  return (
    <div className="space-y-6 max-w-5xl selection:bg-neutral-200">
      {/* Notion Glass Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/80 bg-white/60 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] ring-1 ring-white/60 backdrop-blur-3xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#37352F] text-white shadow-md shadow-neutral-900/10">
            <TableCellsIcon className="h-7 w-7 text-[#787774]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#37352F]">
              Libro de Remuneraciones (LRE)
            </h1>
            <p className="text-xs text-[#787774]">
              Reporte oficial para la Dirección del Trabajo (DT Chile) compatible con formato CSV de 45 campos.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={!lreReport || lreReport.records.length === 0 || isExporting}
          onClick={handleDownloadCsv}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#37352F] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#201F1C] focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50"
        >
          <ArrowDownTrayIcon className="h-4 w-4 text-emerald-400" />
          <span>{isExporting ? 'Generando CSV...' : 'Descargar LRE (.CSV - DT Chile)'}</span>
        </button>
      </div>

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

      {/* Main Content Area */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-[#787774]">Cargando informe del LRE...</div>
      ) : isError ? (
        <AlertBanner type="error" message={errorMessage} />
      ) : !lreReport || lreReport.records.length === 0 ? (
        <div className="rounded-2xl border border-white/80 bg-white/60 p-8 shadow-sm backdrop-blur-2xl text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-[#787774]">
            <DocumentCheckIcon className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-[#37352F]">Sin registros de remuneración</h3>
          <p className="text-xs text-[#787774] max-w-sm mx-auto">
            No se encontraron liquidaciones calculadas para el período <strong>{periodYyyyMm}</strong>.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/80 bg-white/60 p-4 shadow-sm backdrop-blur-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#787774] block mb-1">
                Trabajadores en LRE
              </span>
              <span className="text-xl font-bold font-mono text-[#37352F]">
                {lreReport.records.length}
              </span>
            </div>

            <div className="rounded-2xl border border-white/80 bg-white/60 p-4 shadow-sm backdrop-blur-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#787774] block mb-1">
                Total Imponible
              </span>
              <span className="text-xl font-bold font-mono text-[#37352F]">
                ${Number(lreReport.totalTaxable).toLocaleString('es-CL')}
              </span>
            </div>

            <div className="rounded-2xl border border-white/80 bg-white/60 p-4 shadow-sm backdrop-blur-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#787774] block mb-1">
                Líquido Total a Pagar
              </span>
              <span className="text-xl font-bold font-mono text-emerald-800">
                ${Number(lreReport.totalNetPayable).toLocaleString('es-CL')}
              </span>
            </div>
          </div>

          {/* LRE Preview Table */}
          <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/60 shadow-sm backdrop-blur-2xl">
            <div className="p-4 border-b border-neutral-200/60 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#37352F]">
                Vista Previa Registros LRE (45 Campos DT)
              </h3>
              <span className="text-[11px] font-mono text-[#787774]">
                Período: {lreReport.periodYyyyMm}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-neutral-200/60 bg-white/40 text-[#787774] uppercase tracking-wider text-[10px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Trabajador (RUT & Nombre)</th>
                    <th className="py-3 px-3">Días Trab.</th>
                    <th className="py-3 px-3 text-right">Sueldo Base</th>
                    <th className="py-3 px-3 text-right">Tot. Imponible</th>
                    <th className="py-3 px-3 text-right">Tot. No Impon.</th>
                    <th className="py-3 px-3 text-right">AFP</th>
                    <th className="py-3 px-3 text-right">Salud</th>
                    <th className="py-3 px-3 text-right">Tot. Descuentos</th>
                    <th className="py-3 px-4 text-right">Líquido a Pagar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/60 text-[#37352F]">
                  {lreReport.records.map((rec) => (
                    <tr key={rec.payrollId} className="hover:bg-white/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="block font-bold">{rec.workerName}</span>
                        <span className="text-[10px] text-[#787774] font-mono">{rec.workerRut}</span>
                      </td>
                      <td className="py-3 px-3 font-mono">{rec.workedDays}</td>
                      <td className="py-3 px-3 text-right font-mono">${rec.baseSalary.toLocaleString('es-CL')}</td>
                      <td className="py-3 px-3 text-right font-mono font-medium">${rec.totalTaxable.toLocaleString('es-CL')}</td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-800">${rec.totalNonTaxable.toLocaleString('es-CL')}</td>
                      <td className="py-3 px-3 text-right font-mono">${rec.afpDeduction.toLocaleString('es-CL')}</td>
                      <td className="py-3 px-3 text-right font-mono">${rec.healthDeduction.toLocaleString('es-CL')}</td>
                      <td className="py-3 px-3 text-right font-mono text-rose-700">${rec.totalLegalDeductions.toLocaleString('es-CL')}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800">${rec.netPayable.toLocaleString('es-CL')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Export History Log Table Component */}
      <ExportHistoryTable exportType="LRE_DT" title="Historial de Descargas de LRE (.CSV DT)" />
    </div>
  );
};

export default LrePage;
