import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AdjustmentsHorizontalIcon,
  TrashIcon,
  CalendarIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  SparklesIcon,
  BuildingLibraryIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import monthlyParametersService from '../../services/monthlyParametersService';
import catalogsService from '../../services/catalogsService';
import AlertBanner from '../../components/common/AlertBanner';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '../../components/ui/alert-dialog';

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

// Custom Label with Hover Tooltip
const LabelWithTooltip: React.FC<{ label: string; tooltip: string; required?: boolean }> = ({
  label,
  tooltip,
  required,
}) => (
  <div className="flex items-center gap-1 mb-1">
    <label className="block text-[11px] font-semibold uppercase text-[#787774]">
      {label} {required && '*'}
    </label>
    <div className="group relative flex items-center">
      <InformationCircleIcon className="h-3.5 w-3.5 text-[#787774]/70 hover:text-[#37352F] cursor-help transition-colors" />
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden w-48 rounded-xl border border-neutral-200/80 bg-[#37352F] p-2.5 text-[10px] leading-snug font-normal text-white shadow-xl group-hover:block z-30">
        {tooltip}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#37352F]" />
      </div>
    </div>
  </div>
);

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
  const [deletingParam, setDeletingParam] = useState<{ id: number; period: string } | null>(null);

  // Fetch live economic indicators (UF, UTM, Dólar, IPC) from backend proxy with fallback
  const {
    data: liveIndicators,
    isLoading: isIndicatorsLoading,
    refetch: refetchIndicators,
  } = useQuery({
    queryKey: ['mindicadorLiveIndicatorsProxy'],
    queryFn: async () => {
      try {
        const proxyData = await catalogsService.getLiveIndicators();
        if (proxyData?.uf && proxyData?.utm) {
          return proxyData;
        }
      } catch (e) {}

      // Client direct fallback
      const res = await fetch('https://mindicador.cl/api');
      if (!res.ok) throw new Error('Error al conectar con mindicador.cl');
      const data = await res.json();
      return {
        uf: { valor: data.uf.valor, fecha: data.uf.fecha },
        utm: { valor: data.utm.valor, fecha: data.utm.fecha },
        dolar: data.dolar ? { valor: data.dolar.valor, fecha: data.dolar.fecha } : undefined,
        ipc: data.ipc ? { valor: data.ipc.valor, fecha: data.ipc.fecha } : undefined,
      };
    },
    staleTime: 1000 * 60 * 30, // 30 mins cache
  });

  // Auto-fill UF and UTM values when API responds
  useEffect(() => {
    if (liveIndicators?.uf?.valor) {
      setUfClosingValue(liveIndicators.uf.valor.toString());
    }
    if (liveIndicators?.utm?.valor) {
      setUtmValue(liveIndicators.utm.valor.toString());
    }
  }, [liveIndicators]);

  const handleUseOfficialUf = () => {
    if (liveIndicators?.uf?.valor) {
      setUfClosingValue(liveIndicators.uf.valor.toString());
    }
  };

  const handleUseOfficialUtm = () => {
    if (liveIndicators?.utm?.valor) {
      setUtmValue(liveIndicators.utm.valor.toString());
    }
  };

  const { data: parameters = [], isLoading } = useQuery({
    queryKey: ['monthlyParameters'],
    queryFn: monthlyParametersService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: monthlyParametersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthlyParameters'] });
      setSuccessMsg(`Parámetros configurados correctamente para el período ${periodYyyyMm}`);
      toast.success(`Parámetros configurados correctamente para el período ${periodYyyyMm}`);
      setApiError(null);
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Error al guardar los parámetros mensuales';
      const errorStr = Array.isArray(message) ? message.join(', ') : message;
      setApiError(errorStr);
      toast.error(errorStr);
      setSuccessMsg(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: monthlyParametersService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthlyParameters'] });
      toast.success('Parámetros del período eliminados correctamente');
      setDeletingParam(null);
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Error al eliminar parámetros';
      const formatted = Array.isArray(message) ? message.join(', ') : message;
      setApiError(formatted);
      toast.error(formatted);
      setDeletingParam(null);
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

  const confirmDelete = () => {
    if (deletingParam) {
      setApiError(null);
      deleteMutation.mutate(deletingParam.id);
    }
  };

  const formattedUfDate = liveIndicators?.uf?.fecha
    ? new Date(liveIndicators.uf.fecha).toLocaleDateString('es-CL', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const formattedUtmDate = liveIndicators?.utm?.fecha
    ? new Date(liveIndicators.utm.fecha).toLocaleDateString('es-CL', {
        month: 'long',
        year: 'numeric',
      })
    : '';

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

        <button
          type="button"
          onClick={() => refetchIndicators()}
          className="flex items-center gap-2 rounded-xl border border-neutral-200/80 bg-white/80 px-3.5 py-2 text-xs font-semibold text-[#37352F] shadow-2xs hover:bg-neutral-50 transition-all self-start sm:self-auto"
        >
          <ArrowPathIcon className={`h-4 w-4 ${isIndicatorsLoading ? 'animate-spin' : ''}`} />
          <span>Actualizar Indicadores</span>
        </button>
      </div>

      {/* Dual Cards Grid: UF Live Card & UTM Live Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* UF Live Card */}
        <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur-2xl flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs">
                <SparklesIcon className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#787774]">
                  Indicador UF Oficial
                </span>
                {isIndicatorsLoading ? (
                  <p className="text-xs font-medium text-[#787774]">Cargando...</p>
                ) : liveIndicators?.uf?.valor ? (
                  <p className="text-2xl font-extrabold text-[#37352F] font-mono mt-0.5">
                    ${liveIndicators.uf.valor.toLocaleString('es-CL')}
                  </p>
                ) : (
                  <p className="text-xs text-rose-600 font-medium">No disponible</p>
                )}
              </div>
            </div>

            {liveIndicators?.uf?.valor && (
              <button
                type="button"
                onClick={handleUseOfficialUf}
                className="flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50/80 px-2.5 py-1.5 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 transition-all"
              >
                <SparklesIcon className="h-3.5 w-3.5" />
                <span>Usar UF</span>
              </button>
            )}
          </div>
          <div className="text-[11px] text-[#787774]">
            Fecha: <strong className="text-[#37352F]">{formattedUfDate || 'Hoy'}</strong>
          </div>
        </div>

        {/* UTM Live Card */}
        <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur-2xl flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-800 border border-blue-200/80 shadow-2xs">
                <BuildingLibraryIcon className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#787774]">
                  Indicador UTM Oficial
                </span>
                {isIndicatorsLoading ? (
                  <p className="text-xs font-medium text-[#787774]">Cargando...</p>
                ) : liveIndicators?.utm?.valor ? (
                  <p className="text-2xl font-extrabold text-[#37352F] font-mono mt-0.5">
                    ${liveIndicators.utm.valor.toLocaleString('es-CL')}
                  </p>
                ) : (
                  <p className="text-xs text-rose-600 font-medium">No disponible</p>
                )}
              </div>
            </div>

            {liveIndicators?.utm?.valor && (
              <button
                type="button"
                onClick={handleUseOfficialUtm}
                className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50/80 px-2.5 py-1.5 text-[11px] font-bold text-blue-800 hover:bg-blue-100 transition-all"
              >
                <BuildingLibraryIcon className="h-3.5 w-3.5" />
                <span>Usar UTM</span>
              </button>
            )}
          </div>
          <div className="text-[11px] text-[#787774]">
            Vigencia: <strong className="text-[#37352F] capitalize">{formattedUtmDate || 'Mes Actual'}</strong>
          </div>
        </div>
      </div>

      {/* Secondary Economic Ticker Widget Bar: Dólar Observado & IPC */}
      <div className="rounded-2xl border border-white/80 bg-white/50 p-4 shadow-2xs backdrop-blur-xl flex flex-wrap items-center justify-around gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-[#37352F]">
            <CurrencyDollarIcon className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-[#787774] block">Dólar Observado</span>
            <span className="font-bold text-[#37352F] font-mono">
              ${liveIndicators?.dolar?.valor ? liveIndicators.dolar.valor.toLocaleString('es-CL') : '950.50'} CLP
            </span>
          </div>
        </div>

        <div className="h-6 w-[1px] bg-neutral-200 hidden sm:block" />

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-[#37352F]">
            <ChartBarIcon className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-[#787774] block">IPC Mensual (Inflación)</span>
            <span className="font-bold text-[#37352F] font-mono">
              {liveIndicators?.ipc?.valor !== undefined ? `${liveIndicators.ipc.valor}%` : '0.3%'}
            </span>
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
                <LabelWithTooltip
                  label="Período (YYYY-MM)"
                  tooltip="Período mensual al que corresponden las variables (ej: 2026-07) para calcular las liquidaciones de ese mes."
                  required
                />
                <input
                  type="month"
                  value={periodYyyyMm}
                  onChange={(e) => setPeriodYyyyMm(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-mono text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                  required
                />
              </div>

              <div>
                <LabelWithTooltip
                  label="Valor UF Cierre ($)"
                  tooltip="Valor de la UF al cierre de mes, usado para topes imponibles de previsión e Isapres pactadas en UF."
                  required
                />
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
                <LabelWithTooltip
                  label="Valor UTM Mes ($)"
                  tooltip="Unidad Tributaria Mensual usada para calcular los tramos del Impuesto Único de 2ª Categoría (SII)."
                  required
                />
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

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <LabelWithTooltip
                  label="Sueldo Mínimo ($)"
                  tooltip="Ingreso Mínimo Mensual (IMM) vigente en Chile para trabajadores dependientes."
                  required
                />
                <input
                  type="number"
                  value={minimumWage}
                  onChange={(e) => setMinimumWage(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                  required
                />
              </div>

              <div>
                <LabelWithTooltip
                  label="Tope AFP (UF)"
                  tooltip="Límite máximo en UF (ej: 84.3 UF) sobre el cual se aplica el 10% + comisión de AFP."
                  required
                />
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
                <LabelWithTooltip
                  label="Tope AFC (UF)"
                  tooltip="Límite máximo en UF (ej: 126.6 UF) sobre el cual se aplica el Seguro de Cesantía (0.6%)."
                  required
                />
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
                <LabelWithTooltip
                  label="Tasa SIS (%)"
                  tooltip="Porcentaje del Seguro de Invalidez y Sobrevivencia abonado por el empleador."
                  required
                />
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
                <Save className="h-4 w-4 text-emerald-400" />
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingParam({ id: param.id, period: param.periodYyyyMm })}
                    className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    title="Eliminar período"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Shadcn AlertDialog for Deleting Monthly Parameters */}
      <AlertDialog
        open={!!deletingParam}
        onOpenChange={(open) => !open && setDeletingParam(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación de período?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar permanentemente los parámetros del período{' '}
              <strong className="text-[#37352F]">{deletingParam?.period}</strong>? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Eliminando...' : 'Sí, Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MonthlyParametersPage;
