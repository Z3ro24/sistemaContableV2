import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdjustmentsHorizontalIcon, PlusIcon, TrashIcon, CalendarIcon } from '@heroicons/react/24/outline';
import monthlyParametersService from '../../services/monthlyParametersService';
import AlertBanner from '../../components/common/AlertBanner';

// Default SII Tax Brackets (Chile)
const defaultTaxBrackets = [
  { bracketNumber: 1, fromUtm: 0.0, toUtm: 13.5, factor: 0.0, deductionUtm: 0.0 },
  { bracketNumber: 2, fromUtm: 13.5, toUtm: 30.0, factor: 0.04, deductionUtm: 0.54 },
  { bracketNumber: 3, fromUtm: 30.0, toUtm: 50.0, factor: 0.08, deductionUtm: 1.74 },
  { bracketNumber: 4, fromUtm: 50.0, toUtm: 70.0, factor: 0.135, deductionUtm: 4.49 },
  { bracketNumber: 5, fromUtm: 70.0, toUtm: 90.0, factor: 0.23, deductionUtm: 11.14 },
  { bracketNumber: 6, fromUtm: 90.0, toUtm: 120.0, factor: 0.304, deductionUtm: 17.8 },
  { bracketNumber: 7, fromUtm: 120.0, toUtm: 310.0, factor: 0.35, deductionUtm: 23.32 },
  { bracketNumber: 8, fromUtm: 310.0, toUtm: null, factor: 0.4, deductionUtm: 38.82 },
];

// Default Family Allowance Brackets (Chile)
const defaultFamilyBrackets = [
  { bracketLetter: 'A', incomeFrom: 0, incomeTo: 586227, amountPerDependent: 21243 },
  { bracketLetter: 'B', incomeFrom: 586228, incomeTo: 856247, amountPerDependent: 13036 },
  { bracketLetter: 'C', incomeFrom: 856248, incomeTo: 1335447, amountPerDependent: 4119 },
  { bracketLetter: 'D', incomeFrom: 1335448, incomeTo: 99999999, amountPerDependent: 0 },
];

export const MonthlyParametersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [periodYyyyMm, setPeriodYyyyMm] = useState('2026-07');
  const [ufClosingValue, setUfClosingValue] = useState('38500');
  const [utmValue, setUtmValue] = useState('67500');
  const [minimumWage, setMinimumWage] = useState('500000');
  const [afpCappingUf, setAfpCappingUf] = useState('84.3');
  const [afcCappingUf, setAfcCappingUf] = useState('126.6');
  const [sisRate, setSisRate] = useState('1.54');

  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { data: parameters = [], isLoading } = useQuery({
    queryKey: ['monthlyParameters'],
    queryFn: monthlyParametersService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: monthlyParametersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthlyParameters'] });
      setSuccessMsg(`Parámetros configurados correctamente para el período ${periodYyyyMm}`);
      setApiError(null);
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Error al guardar los parámetros mensuales';
      setApiError(Array.isArray(message) ? message.join(', ') : message);
      setSuccessMsg(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: monthlyParametersService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthlyParameters'] });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Error al eliminar parámetros';
      setApiError(Array.isArray(message) ? message.join(', ') : message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMsg(null);

    createMutation.mutate({
      periodYyyyMm,
      ufClosingValue: parseFloat(ufClosingValue),
      utmValue: parseFloat(utmValue),
      minimumWage: parseFloat(minimumWage),
      afpCappingUf: parseFloat(afpCappingUf),
      afcCappingUf: parseFloat(afcCappingUf),
      sisRate: parseFloat(sisRate),
      uniqueTaxBrackets: defaultTaxBrackets,
      familyAllowanceBrackets: defaultFamilyBrackets,
    });
  };

  const handleDelete = (id: number, period: string) => {
    if (window.confirm(`¿Estás seguro de eliminar los parámetros del período ${period}?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl selection:bg-neutral-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/80 bg-white/60 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] ring-1 ring-white/60 backdrop-blur-3xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#37352F] text-white shadow-md shadow-neutral-900/10">
            <AdjustmentsHorizontalIcon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#37352F]">
              Parámetros Mensuales (SII / Previred)
            </h1>
            <p className="text-xs text-[#787774]">
              Configuración de UF, UTM, Sueldo Mínimo y Tramos Tributarios por Período.
            </p>
          </div>
        </div>
      </div>

      {apiError && <AlertBanner type="error" message={apiError} />}
      {successMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-3 text-xs font-medium text-emerald-800">
          {successMsg}
        </div>
      )}

      {/* Grid Layout: Config Form + Configured Periods List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Config Form (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-white/80 bg-white/60 p-6 shadow-sm backdrop-blur-2xl space-y-5">
          <h3 className="text-base font-bold text-[#37352F] border-b border-neutral-200/60 pb-2 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-[#787774]" />
            <span>Configurar Parámetros del Mes</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#787774] mb-1">
                  Período (YYYY-MM) *
                </label>
                <input
                  type="month"
                  value={periodYyyyMm}
                  onChange={(e) => setPeriodYyyyMm(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-mono text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#787774] mb-1">
                  Valor UF Cierre ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={ufClosingValue}
                  onChange={(e) => setUfClosingValue(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#787774] mb-1">
                  Valor UTM Mes ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={utmValue}
                  onChange={(e) => setUtmValue(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#787774] mb-1">
                  Sueldo Mínimo ($) *
                </label>
                <input
                  type="number"
                  value={minimumWage}
                  onChange={(e) => setMinimumWage(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#787774] mb-1">
                  Tope Imponible AFP (UF)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={afpCappingUf}
                  onChange={(e) => setAfpCappingUf(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#787774] mb-1">
                  Tope Imponible AFC (UF)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={afcCappingUf}
                  onChange={(e) => setAfcCappingUf(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#787774] mb-1">
                  Tasa SIS (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={sisRate}
                  onChange={(e) => setSisRate(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-200/60">
              <span className="text-[11px] text-[#787774]">
                * Incluye automáticamente las tablas oficiales del SII para Impuesto Único y Asignaciones Familiares.
              </span>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex items-center gap-1.5 rounded-xl bg-[#37352F] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#201F1C] disabled:opacity-50"
              >
                <PlusIcon className="h-4 w-4" />
                <span>{createMutation.isPending ? 'Guardando...' : 'Guardar Parámetros'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: List of Configured Periods */}
        <div className="rounded-3xl border border-white/80 bg-white/60 p-6 shadow-sm backdrop-blur-2xl space-y-4">
          <h3 className="text-base font-bold text-[#37352F] border-b border-neutral-200/60 pb-2">
            Períodos Configuradas
          </h3>

          {isLoading ? (
            <p className="text-xs text-[#787774]">Cargando períodos...</p>
          ) : parameters.length === 0 ? (
            <p className="text-xs text-[#787774]">No hay períodos guardados aún.</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {parameters.map((param) => (
                <div
                  key={param.id}
                  className="flex items-center justify-between p-3 rounded-2xl border border-neutral-200/80 bg-white/80 text-xs shadow-2xs"
                >
                  <div>
                    <span className="font-bold text-sm text-[#37352F] font-mono block">
                      {param.periodYyyyMm}
                    </span>
                    <div className="text-[11px] text-[#787774] space-x-2">
                      <span>UF: ${Number(param.ufClosingValue).toLocaleString('es-CL')}</span>
                      <span>•</span>
                      <span>UTM: ${Number(param.utmValue).toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(param.id, param.periodYyyyMm)}
                    className="p-1.5 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Eliminar período"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyParametersPage;
