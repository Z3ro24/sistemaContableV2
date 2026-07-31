import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BanknotesIcon,
  CalculatorIcon,
  DocumentTextIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import payrollsService, { type Payroll } from '../../services/payrollsService';
import workersService from '../../services/workersService';
import companiesService from '../../services/companiesService';
import CustomSelect from '../../components/common/CustomSelect';
import AlertBanner from '../../components/common/AlertBanner';

interface SelectOption {
  value: string;
  label: string;
}

export const PayrollsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCalcModalOpen, setIsCalcModalOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);

  // Form state
  const [workerId, setWorkerId] = useState('');
  const [periodYyyyMm, setPeriodYyyyMm] = useState('2026-07');
  const [workedDays, setWorkedDays] = useState('30');
  const [overtime50Hrs, setOvertime50Hrs] = useState('0');
  const [overtime100Hrs, setOvertime100Hrs] = useState('0');
  const [familyDependentsCount, setFamilyDependentsCount] = useState('0');
  const [otherTaxableIncome, setOtherTaxableIncome] = useState('0');
  const [otherNonTaxableIncome, setOtherNonTaxableIncome] = useState('0');
  const [otherDeductions, setOtherDeductions] = useState('0');

  // Separated Error States
  const [pageApiError, setPageApiError] = useState<string | null>(null);
  const [modalApiError, setModalApiError] = useState<string | null>(null);

  // Filter state
  const [filterCompanyId, setFilterCompanyId] = useState('all');

  // Fetch Payrolls
  const { data: payrolls = [], isLoading, isError } = useQuery({
    queryKey: ['payrolls', filterCompanyId],
    queryFn: () => payrollsService.getAll(undefined, filterCompanyId !== 'all' ? parseInt(filterCompanyId, 10) : undefined),
  });

  // Fetch Workers for calculation modal
  const { data: workers = [] } = useQuery({
    queryKey: ['workers'],
    queryFn: workersService.getAll,
  });

  // Fetch Companies for filter
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: companiesService.getAll,
  });

  const workerOptions: SelectOption[] = [
    { value: '', label: '-- Seleccionar Persona / Trabajador --' },
    ...workers.map((w) => ({
      value: w.id.toString(),
      label: `${w.name} ${w.paternalLastName || ''} (${w.rut}) - ${w.company?.name || 'Sin Empresa'}`,
    })),
  ];

  const filterCompanyOptions: SelectOption[] = [
    { value: 'all', label: 'Todas las Empresas' },
    ...companies.map((c) => ({ value: c.id.toString(), label: c.name })),
  ];

  const calculateMutation = useMutation({
    mutationFn: payrollsService.calculateAndSave,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payrolls'] });
      setIsCalcModalOpen(false);
      setModalApiError(null);
      setSelectedPayroll(data);
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Error al calcular la liquidación';
      setModalApiError(Array.isArray(message) ? message.join(', ') : message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: payrollsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payrolls'] });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Error al eliminar la liquidación';
      setPageApiError(Array.isArray(message) ? message.join(', ') : message);
    },
  });

  const handleCalculateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalApiError(null);

    if (!workerId) {
      setModalApiError('Debe seleccionar una persona / trabajador');
      return;
    }

    calculateMutation.mutate({
      workerId: parseInt(workerId, 10),
      periodYyyyMm,
      workedDays: parseInt(workedDays, 10) || 30,
      overtime50Hrs: parseFloat(overtime50Hrs) || 0,
      overtime100Hrs: parseFloat(overtime100Hrs) || 0,
      familyDependentsCount: parseInt(familyDependentsCount, 10) || 0,
      otherTaxableIncome: parseFloat(otherTaxableIncome) || 0,
      otherNonTaxableIncome: parseFloat(otherNonTaxableIncome) || 0,
      otherDeductions: parseFloat(otherDeductions) || 0,
    });
  };

  const handleDelete = (id: number, workerName: string, period: string) => {
    if (window.confirm(`¿Estás seguro de eliminar la liquidación de ${workerName} (${period})?`)) {
      setPageApiError(null);
      deleteMutation.mutate(id);
    }
  };

  const handleOpenModal = () => {
    setModalApiError(null);
    setIsCalcModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-5xl selection:bg-neutral-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/80 bg-white/60 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] ring-1 ring-white/60 backdrop-blur-3xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#37352F] text-white shadow-md shadow-neutral-900/10">
            <BanknotesIcon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#37352F]">
              Liquidaciones de Sueldo
            </h1>
            <p className="text-xs text-[#787774]">
              Cálculo automatizado de haberes, descuentos AFP/Salud/Impuesto y emisión de sueldos.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#37352F] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#201F1C] focus:outline-none focus:ring-2 focus:ring-neutral-400"
        >
          <CalculatorIcon className="h-4 w-4" />
          <span>Calcular Liquidación</span>
        </button>
      </div>

      {pageApiError && <AlertBanner type="error" message={pageApiError} />}

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="w-64">
          <CustomSelect<SelectOption>
            options={filterCompanyOptions}
            value={filterCompanyOptions.find((o) => o.value === filterCompanyId) || filterCompanyOptions[0]}
            onChange={(opt) => setFilterCompanyId(opt?.value || 'all')}
          />
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="p-8 text-center text-sm text-[#787774]">Cargando liquidaciones...</div>
      ) : isError ? (
        <AlertBanner type="error" message="Error al cargar el listado de liquidaciones" />
      ) : payrolls.length === 0 ? (
        <div className="rounded-2xl border border-white/80 bg-white/60 p-8 shadow-sm backdrop-blur-2xl text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-[#787774]">
            <BanknotesIcon className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-[#37352F]">No hay liquidaciones emitidas</h3>
          <p className="text-xs text-[#787774] max-w-sm mx-auto">
            Haz clic en "Calcular Liquidación" para procesar el sueldo de un trabajador según los parámetros del mes.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/60 shadow-sm backdrop-blur-2xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200/60 bg-white/40 text-[#787774] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">Trabajador / RUT</th>
                <th className="px-6 py-3.5">Empresa</th>
                <th className="px-6 py-3.5">Período</th>
                <th className="px-6 py-3.5 text-right">Total Imponible</th>
                <th className="px-6 py-3.5 text-right">Desc. Legales</th>
                <th className="px-6 py-3.5 text-right">Líquido a Pagar</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60 text-[#37352F]">
              {payrolls.map((payroll) => (
                <tr key={payroll.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-4 font-semibold text-sm">
                    {payroll.worker.name} {payroll.worker.paternalLastName || ''}
                    <span className="block text-[11px] font-mono text-[#787774]">{payroll.worker.rut}</span>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {payroll.worker.company?.name || 'Sin Empresa'}
                  </td>
                  <td className="px-6 py-4 font-mono font-medium">
                    {payroll.periodYyyyMm}
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    ${Number(payroll.totalTaxable).toLocaleString('es-CL')}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-rose-700">
                    -${Number(payroll.totalLegalDeductions).toLocaleString('es-CL')}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-sm text-[#37352F]">
                    ${Number(payroll.netPayable).toLocaleString('es-CL')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPayroll(payroll)}
                        title="Ver Desglose de Liquidación"
                        className="rounded-lg p-1.5 border border-neutral-200 bg-white text-[#37352F] hover:bg-neutral-100 transition-colors shadow-2xs"
                      >
                        <DocumentTextIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(payroll.id, payroll.worker.name, payroll.periodYyyyMm)}
                        title="Eliminar Liquidación"
                        className="rounded-lg p-1.5 border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors shadow-2xs"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Calculate Payroll */}
      {isCalcModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200/60">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#37352F] text-white shadow-xs">
                  <CalculatorIcon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-[#37352F]">Calcular Liquidación de Sueldo</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCalcModalOpen(false)}
                className="p-1.5 rounded-lg text-[#787774] hover:bg-neutral-100 hover:text-[#37352F]"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCalculateSubmit} className="mt-5 space-y-4">
              {/* Modal Error Banner ONLY */}
              {modalApiError && <AlertBanner type="error" message={modalApiError} />}

              {/* Grid Row 1: Trabajador (Span 2) & Período (Span 1) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 items-end">
                <div className="sm:col-span-2 flex flex-col">
                  <label className="h-5 flex items-center mb-1 text-xs font-semibold uppercase tracking-wider text-[#787774]">
                    Persona / Trabajador *
                  </label>
                  <CustomSelect<SelectOption>
                    options={workerOptions}
                    value={workerOptions.find((o) => o.value === workerId) || workerOptions[0]}
                    onChange={(opt) => setWorkerId(opt?.value || '')}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="h-5 flex items-center mb-1 text-xs font-semibold uppercase tracking-wider text-[#787774]">
                    Período (YYYY-MM) *
                  </label>
                  <input
                    type="month"
                    value={periodYyyyMm}
                    onChange={(e) => setPeriodYyyyMm(e.target.value)}
                    className="h-[38px] w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-mono text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                    required
                  />
                </div>
              </div>

              {/* Grid Row 2: Días Trabajados, Horas 50%, Horas 100% */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 items-end">
                <div className="flex flex-col">
                  <label className="h-5 flex items-center mb-1 text-xs font-semibold uppercase tracking-wider text-[#787774]">
                    Días Trabajados (Max 30)
                  </label>
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
                  <label className="h-5 flex items-center mb-1 text-xs font-semibold uppercase tracking-wider text-[#787774]">
                    Horas Extras 50%
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={overtime50Hrs}
                    onChange={(e) => setOvertime50Hrs(e.target.value)}
                    className="h-[38px] w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="h-5 flex items-center mb-1 text-xs font-semibold uppercase tracking-wider text-[#787774]">
                    Horas Extras 100%
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={overtime100Hrs}
                    onChange={(e) => setOvertime100Hrs(e.target.value)}
                    className="h-[38px] w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                  />
                </div>
              </div>

              {/* Grid Row 3: Cargas Familares, Otros Imponibles, Haberes No Imponibles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 items-end">
                <div className="flex flex-col">
                  <label className="h-5 flex items-center mb-1 text-xs font-semibold uppercase tracking-wider text-[#787774]">
                    Cargas Familiares
                  </label>
                  <input
                    type="number"
                    value={familyDependentsCount}
                    onChange={(e) => setFamilyDependentsCount(e.target.value)}
                    className="h-[38px] w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="h-5 flex items-center mb-1 text-[11px] font-semibold uppercase tracking-wider text-[#787774]">
                    Otros Imponibles ($)
                  </label>
                  <input
                    type="number"
                    value={otherTaxableIncome}
                    onChange={(e) => setOtherTaxableIncome(e.target.value)}
                    className="h-[38px] w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="h-5 flex items-center mb-1 text-[11px] font-semibold uppercase tracking-wider text-[#787774]">
                    No Imponibles ($)
                  </label>
                  <input
                    type="number"
                    value={otherNonTaxableIncome}
                    onChange={(e) => setOtherNonTaxableIncome(e.target.value)}
                    className="h-[38px] w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                  />
                </div>
              </div>

              {/* Grid Row 4: Otros Descuentos */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 items-end">
                <div className="flex flex-col">
                  <label className="h-5 flex items-center mb-1 text-[11px] font-semibold uppercase tracking-wider text-[#787774]">
                    Otros Descuentos ($)
                  </label>
                  <input
                    type="number"
                    value={otherDeductions}
                    onChange={(e) => setOtherDeductions(e.target.value)}
                    className="h-[38px] w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200/60 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCalcModalOpen(false)}
                  className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-[#37352F] shadow-2xs hover:bg-neutral-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={calculateMutation.isPending}
                  className="rounded-xl bg-[#37352F] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#201F1C] disabled:opacity-50"
                >
                  {calculateMutation.isPending ? 'Calculando...' : 'Calcular y Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Pay Slip Breakdown */}
      {selectedPayroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/80 bg-white/95 p-8 shadow-2xl backdrop-blur-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200/60">
              <div>
                <h3 className="text-xl font-bold text-[#37352F]">
                  Liquidación de Sueldo ({selectedPayroll.periodYyyyMm})
                </h3>
                <p className="text-xs text-[#787774]">
                  {selectedPayroll.worker.name} {selectedPayroll.worker.paternalLastName || ''} • RUT: {selectedPayroll.worker.rut}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPayroll(null)}
                className="p-1.5 rounded-lg text-[#787774] hover:bg-neutral-100 hover:text-[#37352F]"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Pay Slip Card Breakdown */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white/90 p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-neutral-200/60">
                <div>
                  <span className="text-[11px] font-semibold uppercase text-[#787774]">Empresa:</span>
                  <p className="font-bold text-[#37352F]">{selectedPayroll.worker.company?.name || 'Sin Empresa'}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase text-[#787774]">Previsión:</span>
                  <p className="font-medium text-[#37352F]">{selectedPayroll.afpHistoricalName} ({selectedPayroll.afpHistoricalRate}%) • {selectedPayroll.healthHistoricalName}</p>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-[#37352F] uppercase tracking-wider">Desglose de Conceptos</h4>
                <div className="divide-y divide-neutral-200/60">
                  {selectedPayroll.details.map((detail) => (
                    <div key={detail.id} className="flex items-center justify-between py-2">
                      <span className="font-medium text-[#37352F]">{detail.conceptLabel}</span>
                      <span
                        className={`font-mono font-semibold ${
                          detail.conceptType === 'LEGAL_DEDUCTION' || detail.conceptType === 'OTHER_DEDUCTION'
                            ? 'text-rose-700'
                            : 'text-emerald-800'
                        }`}
                      >
                        {detail.conceptType === 'LEGAL_DEDUCTION' || detail.conceptType === 'OTHER_DEDUCTION' ? '-' : '+'}
                        ${Number(detail.amount).toLocaleString('es-CL')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Summary Footer */}
              <div className="pt-4 border-t border-neutral-200/80 space-y-1">
                <div className="flex justify-between text-xs font-semibold text-[#787774]">
                  <span>Total Imponible:</span>
                  <span>${Number(selectedPayroll.totalTaxable).toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-rose-700">
                  <span>Total Descuentos Legales:</span>
                  <span>-${Number(selectedPayroll.totalLegalDeductions).toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-emerald-800">
                  <span>Total No Imponible:</span>
                  <span>+${Number(selectedPayroll.totalNonTaxable).toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#37352F] pt-2 border-t border-neutral-300">
                  <span>LÍQUIDO A PAGAR:</span>
                  <span className="font-mono text-lg">${Number(selectedPayroll.netPayable).toLocaleString('es-CL')}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPayroll(null)}
                className="rounded-xl bg-[#37352F] px-5 py-2 text-xs font-semibold text-white shadow-sm"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollsPage;
