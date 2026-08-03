import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  TableCellsIcon,
  ArrowDownTrayIcon,
  DocumentCheckIcon,
} from '@heroicons/react/24/outline';
import lreService from '../../services/lreService';
import companiesService from '../../services/companiesService';
import CustomSelect from '../../components/common/CustomSelect';
import AlertBanner from '../../components/common/AlertBanner';
import ExportHistoryTable from '../../components/common/ExportHistoryTable';

interface SelectOption {
  value: string;
  label: string;
}

export const LrePage: React.FC = () => {
  const [periodYyyyMm, setPeriodYyyyMm] = useState('2026-07');
  const [filterCompanyId, setFilterCompanyId] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  // Fetch Companies for filter
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: companiesService.getAll,
  });

  const parsedCompanyId = filterCompanyId !== 'all' ? parseInt(filterCompanyId, 10) : undefined;

  // Fetch LRE Report Data
  const { data: lreReport, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['lreReport', periodYyyyMm, filterCompanyId],
    queryFn: () => lreService.getReport(periodYyyyMm, parsedCompanyId),
  });

  const filterCompanyOptions: SelectOption[] = [
    { value: 'all', label: 'Todas las Empresas' },
    ...companies.map((c) => ({ value: c.id.toString(), label: c.name })),
  ];

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
            <TableCellsIcon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#37352F]">
              Libro de Remuneraciones Electrónico (LRE)
            </h1>
            <p className="text-xs text-[#787774]">
              Exportador estandarizado de remuneraciones exigido por la Dirección del Trabajo (DT Chile - Res. Ex. Nº 39).
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="w-full sm:w-64">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#787774] block mb-1">
            Empresa
          </label>
          <CustomSelect<SelectOption>
            options={filterCompanyOptions}
            value={filterCompanyOptions.find((o) => o.value === filterCompanyId) || filterCompanyOptions[0]}
            onChange={(opt) => setFilterCompanyId(opt?.value || 'all')}
          />
        </div>

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

      {/* Metrics Summary Cards */}
      {lreReport && lreReport.records.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/80 bg-white/60 p-4 shadow-2xs backdrop-blur-2xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#787774]">Registros DT</span>
            <p className="text-xl font-bold text-[#37352F]">{lreReport.totalWorkers} Trabajador(es)</p>
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/60 p-4 shadow-2xs backdrop-blur-2xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#787774]">Total Imponible</span>
            <p className="text-xl font-bold font-mono text-[#37352F]">${lreReport.totalTaxable.toLocaleString('es-CL')}</p>
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/60 p-4 shadow-2xs backdrop-blur-2xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#787774]">Desc. Legales</span>
            <p className="text-xl font-bold font-mono text-rose-700">-${lreReport.totalLegalDeductions.toLocaleString('es-CL')}</p>
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/60 p-4 shadow-2xs backdrop-blur-2xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#787774]">Líquido General</span>
            <p className="text-xl font-bold font-mono text-emerald-800">${lreReport.totalNetPayable.toLocaleString('es-CL')}</p>
          </div>
        </div>
      )}

      {/* Main Content & Table */}
      {isLoading ? (
        <div className="p-8 text-center text-sm text-[#787774]">Cargando informe LRE de la Dirección del Trabajo...</div>
      ) : isError ? (
        <AlertBanner type="error" message={Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage} />
      ) : !lreReport || lreReport.records.length === 0 ? (
        <div className="rounded-2xl border border-white/80 bg-white/60 p-8 shadow-sm backdrop-blur-2xl text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-[#787774]">
            <TableCellsIcon className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-[#37352F]">Sin liquidaciones para este período</h3>
          <p className="text-xs text-[#787774] max-w-sm mx-auto">
            No se encontraron liquidaciones de sueldo calculadas para el período <strong>{periodYyyyMm}</strong>. Calcula las liquidaciones en el módulo de remuneraciones antes de exportar el LRE.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/60 shadow-sm backdrop-blur-2xl space-y-4">
          <div className="px-6 py-4 border-b border-neutral-200/60 flex justify-between items-center bg-white/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#37352F] flex items-center gap-2">
              <DocumentCheckIcon className="h-4 w-4 text-emerald-700" />
              <span>Pre-visualización de Registro LRE (DT Chile)</span>
            </h3>
            <span className="text-[11px] text-[#787774] font-medium">
              Empresa: <strong>{lreReport.companyName}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200/60 bg-white/40 text-[#787774] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3">RUT</th>
                  <th className="px-6 py-3">Nombre Trabajador</th>
                  <th className="px-6 py-3">AFP / Salud</th>
                  <th className="px-6 py-3 text-right">Sueldo Base</th>
                  <th className="px-6 py-3 text-right">Tot. Imponible</th>
                  <th className="px-6 py-3 text-right">Tot. No Imponible</th>
                  <th className="px-6 py-3 text-right">Desc. Legales</th>
                  <th className="px-6 py-3 text-right">Líquido A Pagar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60 text-[#37352F]">
                {lreReport.records.map((r) => (
                  <tr key={r.payrollId} className="hover:bg-white/40 transition-colors">
                    <td className="px-6 py-3.5 font-mono font-medium">{r.workerRut}</td>
                    <td className="px-6 py-3.5 font-semibold">
                      {r.workerName}
                      <span className="block text-[10px] text-[#787774] font-normal">{r.companyName}</span>
                    </td>
                    <td className="px-6 py-3.5 text-[11px]">
                      {r.afpName} / {r.healthName}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-medium">
                      ${r.baseSalary.toLocaleString('es-CL')}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-medium">
                      ${r.totalTaxable.toLocaleString('es-CL')}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono text-emerald-800">
                      +${r.totalNonTaxable.toLocaleString('es-CL')}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono text-rose-700">
                      -${r.totalLegalDeductions.toLocaleString('es-CL')}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-bold text-sm text-[#37352F]">
                      ${r.netPayable.toLocaleString('es-CL')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Export History Log Table */}
      <ExportHistoryTable exportType="LRE_CSV" periodYyyyMm={periodYyyyMm} companyId={parsedCompanyId} />
    </div>
  );
};

export default LrePage;
