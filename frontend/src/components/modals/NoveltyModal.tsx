import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  CalendarDaysIcon,
  ClockIcon,
  BanknotesIcon,
  DocumentCheckIcon,
} from '@heroicons/react/24/outline';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import noveltiesService, { type MonthlyNoveltyData } from '../../services/noveltiesService';
import CustomSelect from '../common/CustomSelect';
import AlertBanner from '../common/AlertBanner';

interface SelectOption {
  value: string;
  label: string;
}

interface WorkerItem {
  id: number;
  name: string;
  paternalLastName?: string | null;
  maternalLastName?: string | null;
  rut: string;
}

interface NoveltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: MonthlyNoveltyData | null;
  workers: WorkerItem[];
  defaultPeriod?: string;
}

export const NoveltyModal: React.FC<NoveltyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  workers,
  defaultPeriod = '2026-07',
}) => {
  const isEdit = !!initialData?.id;

  const [workerId, setWorkerId] = useState<string>('');
  const [periodYyyyMm, setPeriodYyyyMm] = useState<string>(defaultPeriod);
  const [workedDays, setWorkedDays] = useState('30');
  const [sickLeaveDays, setSickLeaveDays] = useState('0');
  const [absenceDays, setAbsenceDays] = useState('0');
  const [overtime50Hrs, setOvertime50Hrs] = useState('0');
  const [overtime100Hrs, setOvertime100Hrs] = useState('0');
  const [familyDependentsCount, setFamilyDependentsCount] = useState('0');
  const [otherTaxableIncome, setOtherTaxableIncome] = useState('0');
  const [otherNonTaxableIncome, setOtherNonTaxableIncome] = useState('0');
  const [otherDeductions, setOtherDeductions] = useState('0');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const workerOptions: SelectOption[] = workers.map((w) => ({
    value: w.id.toString(),
    label: `${w.name} ${w.paternalLastName || ''} (${w.rut})`,
  }));

  useEffect(() => {
    if (initialData) {
      setWorkerId(initialData.workerId ? initialData.workerId.toString() : '');
      setPeriodYyyyMm(initialData.periodYyyyMm || defaultPeriod);
      setWorkedDays(initialData.workedDays?.toString() ?? '30');
      setSickLeaveDays(initialData.sickLeaveDays?.toString() ?? '0');
      setAbsenceDays(initialData.absenceDays?.toString() ?? '0');
      setOvertime50Hrs(initialData.overtime50Hrs?.toString() ?? '0');
      setOvertime100Hrs(initialData.overtime100Hrs?.toString() ?? '0');
      setFamilyDependentsCount(initialData.familyDependentsCount?.toString() ?? '0');
      setOtherTaxableIncome(initialData.otherTaxableIncome?.toString() ?? '0');
      setOtherNonTaxableIncome(initialData.otherNonTaxableIncome?.toString() ?? '0');
      setOtherDeductions(initialData.otherDeductions?.toString() ?? '0');
    } else {
      setWorkerId(workers[0]?.id ? workers[0].id.toString() : '');
      setPeriodYyyyMm(defaultPeriod);
      setWorkedDays('30');
      setSickLeaveDays('0');
      setAbsenceDays('0');
      setOvertime50Hrs('0');
      setOvertime100Hrs('0');
      setFamilyDependentsCount('0');
      setOtherTaxableIncome('0');
      setOtherNonTaxableIncome('0');
      setOtherDeductions('0');
    }
    setApiError(null);
  }, [initialData, isOpen, workers, defaultPeriod]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const parsedWorkerId = parseInt(workerId, 10);
    if (!parsedWorkerId) {
      const errMsg = 'Debe seleccionar un trabajador';
      setApiError(errMsg);
      toast.error(errMsg);
      return;
    }

    const payload: MonthlyNoveltyData = {
      workerId: parsedWorkerId,
      periodYyyyMm,
      workedDays: parseInt(workedDays, 10) || 30,
      sickLeaveDays: parseInt(sickLeaveDays, 10) || 0,
      absenceDays: parseInt(absenceDays, 10) || 0,
      overtime50Hrs: parseFloat(overtime50Hrs) || 0,
      overtime100Hrs: parseFloat(overtime100Hrs) || 0,
      familyDependentsCount: parseInt(familyDependentsCount, 10) || 0,
      otherTaxableIncome: parseFloat(otherTaxableIncome) || 0,
      otherNonTaxableIncome: parseFloat(otherNonTaxableIncome) || 0,
      otherDeductions: parseFloat(otherDeductions) || 0,
    };

    setIsSubmitting(true);
    try {
      if (isEdit && initialData?.id) {
        await noveltiesService.update(initialData.id, payload);
        toast.success('Novedad del mes actualizada exitosamente');
      } else {
        await noveltiesService.create(payload);
        toast.success('Novedad del mes registrada exitosamente');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al procesar las novedades del mes';
      const errorStr = Array.isArray(msg) ? msg.join(', ') : msg;
      setApiError(errorStr);
      toast.error(errorStr);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#37352F] text-white shadow-xs">
              <CalendarDaysIcon className="h-5 w-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-[#37352F]">
              {isEdit ? 'Editar Novedad del Mes' : 'Registrar Novedad del Mes'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#787774] hover:bg-neutral-100 hover:text-[#37352F]"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {apiError && <AlertBanner type="error" message={apiError} />}

          {/* Grid Row 1: Trabajador & Período */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 items-end">
            <div className="sm:col-span-2 flex flex-col">
              <label className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#787774]">
                Persona / Trabajador *
              </label>
              <CustomSelect<SelectOption>
                options={workerOptions}
                value={workerOptions.find((o) => o.value === workerId) || workerOptions[0]}
                onChange={(opt) => setWorkerId(opt?.value || '')}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#787774]">
                Período (YYYY-MM) *
              </label>
              <input
                type="month"
                value={periodYyyyMm}
                disabled={isEdit}
                onChange={(e) => setPeriodYyyyMm(e.target.value)}
                className="h-[38px] w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-mono text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F] disabled:opacity-60"
                required
              />
            </div>
          </div>

          {/* Section 1: Asistencia */}
          <div className="space-y-2 pt-2 border-t border-neutral-200/60">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#37352F]">
              <ClockIcon className="h-4 w-4 text-indigo-600" />
              Asistencia & Licencias
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-[11px] font-medium text-[#787774] mb-1">Días Trabajados (Max 30)</label>
                <input
                  type="number"
                  max={30}
                  min={0}
                  value={workedDays}
                  onChange={(e) => setWorkedDays(e.target.value)}
                  className="h-[38px] w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-medium text-[#787774] mb-1">Días Licencia Médica</label>
                <input
                  type="number"
                  min={0}
                  value={sickLeaveDays}
                  onChange={(e) => setSickLeaveDays(e.target.value)}
                  className="h-[38px] w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-medium text-[#787774] mb-1">Días Inasistencia</label>
                <input
                  type="number"
                  min={0}
                  value={absenceDays}
                  onChange={(e) => setAbsenceDays(e.target.value)}
                  className="h-[38px] w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Horas Extras */}
          <div className="space-y-2 pt-2 border-t border-neutral-200/60">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#37352F]">
              <CalendarDaysIcon className="h-4 w-4 text-emerald-600" />
              Horas Extras
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-[11px] font-medium text-[#787774] mb-1">Horas Extras 50%</label>
                <input
                  type="number"
                  step="0.5"
                  min={0}
                  value={overtime50Hrs}
                  onChange={(e) => setOvertime50Hrs(e.target.value)}
                  className="h-[38px] w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-medium text-[#787774] mb-1">Horas Extras 100%</label>
                <input
                  type="number"
                  step="0.5"
                  min={0}
                  value={overtime100Hrs}
                  onChange={(e) => setOvertime100Hrs(e.target.value)}
                  className="h-[38px] w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Haberes & Cargas */}
          <div className="space-y-2 pt-2 border-t border-neutral-200/60">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#37352F]">
              <BanknotesIcon className="h-4 w-4 text-amber-600" />
              Cargas & Haberes Adicionales
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-[11px] font-medium text-[#787774] mb-1">Cargas Familiares</label>
                <input
                  type="number"
                  min={0}
                  value={familyDependentsCount}
                  onChange={(e) => setFamilyDependentsCount(e.target.value)}
                  className="h-[38px] w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-medium text-[#787774] mb-1">Otros Imponibles ($)</label>
                <input
                  type="number"
                  min={0}
                  value={otherTaxableIncome}
                  onChange={(e) => setOtherTaxableIncome(e.target.value)}
                  className="h-[38px] w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-medium text-[#787774] mb-1">No Imponibles ($)</label>
                <input
                  type="number"
                  min={0}
                  value={otherNonTaxableIncome}
                  onChange={(e) => setOtherNonTaxableIncome(e.target.value)}
                  className="h-[38px] w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Descuentos */}
          <div className="space-y-2 pt-2 border-t border-neutral-200/60">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#37352F]">
              <DocumentCheckIcon className="h-4 w-4 text-rose-600" />
              Descuentos & Anticipos
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-[11px] font-medium text-[#787774] mb-1">Otros Descuentos ($)</label>
                <input
                  type="number"
                  min={0}
                  value={otherDeductions}
                  onChange={(e) => setOtherDeductions(e.target.value)}
                  className="h-[38px] w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-neutral-200/60 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-[#37352F] hover:bg-neutral-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-[#37352F] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#201F1C] disabled:opacity-50"
            >
              <Save className="h-4 w-4 text-emerald-400" />
              <span>{isSubmitting ? 'Guardando...' : isEdit ? 'Guardar Cambios' : 'Registrar Novedad'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoveltyModal;
