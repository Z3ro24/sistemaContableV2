import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeftIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import workersService from '../../services/workersService';
import companiesService from '../../services/companiesService';
import catalogsService from '../../services/catalogsService';
import { formatRut, validateRut } from '../../utils/rutUtils';
import { workerSchema } from '../../validators/workerValidator';
import AlertBanner from '../../components/common/AlertBanner';
import CustomSelect from '../../components/common/CustomSelect';

interface SelectOption {
  value: string;
  label: string;
}

const bankAccountTypeOptions: SelectOption[] = [
  { value: '', label: '-- Seleccionar Tipo de Cuenta --' },
  { value: 'Cuenta Vista / RUT', label: 'Cuenta Vista / RUT' },
  { value: 'Cuenta Corriente', label: 'Cuenta Corriente' },
  { value: 'Cuenta de Ahorro', label: 'Cuenta de Ahorro' },
];

export const EditWorkerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const workerId = id ? parseInt(id, 10) : 0;

  const [name, setName] = useState('');
  const [paternalLastName, setPaternalLastName] = useState('');
  const [maternalLastName, setMaternalLastName] = useState('');
  const [rut, setRut] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [baseSalary, setBaseSalary] = useState('');

  const [companyId, setCompanyId] = useState('');
  const [afpId, setAfpId] = useState('');
  const [healthInstitutionId, setHealthInstitutionId] = useState('');
  const [healthAgreedUf, setHealthAgreedUf] = useState('');
  const [contractTypeId, setContractTypeId] = useState('');
  const [bankId, setBankId] = useState('');
  const [bankAccountType, setBankAccountType] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');

  const [rutError, setRutError] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch worker details
  const { data: worker, isLoading, isError } = useQuery({
    queryKey: ['worker', workerId],
    queryFn: () => workersService.getById(workerId),
    enabled: !!workerId,
  });

  // Fetch companies
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: companiesService.getAll,
  });

  // Fetch Catalogs
  const { data: afps = [] } = useQuery({
    queryKey: ['afps'],
    queryFn: catalogsService.getAfps,
  });

  const { data: healthInstitutions = [] } = useQuery({
    queryKey: ['healthInstitutions'],
    queryFn: catalogsService.getHealthInstitutions,
  });

  const { data: contractTypes = [] } = useQuery({
    queryKey: ['contractTypes'],
    queryFn: catalogsService.getContractTypes,
  });

  const { data: banks = [] } = useQuery({
    queryKey: ['banks'],
    queryFn: catalogsService.getBanks,
  });

  // Select options
  const companyOptions: SelectOption[] = [
    { value: '', label: '-- Sin Empresa Asignada --' },
    ...companies.map((c) => ({ value: c.id.toString(), label: `${c.name} (${c.rutCompany})` })),
  ];

  const afpOptions: SelectOption[] = [
    { value: '', label: '-- Seleccionar AFP --' },
    ...afps.map((a) => ({ value: a.id.toString(), label: `${a.name} (${a.commissionRate}%)` })),
  ];

  const healthOptions: SelectOption[] = [
    { value: '', label: '-- Seleccionar Salud --' },
    ...healthInstitutions.map((h) => ({ value: h.id.toString(), label: `${h.name} ${h.isIsapre ? '(Isapre)' : '(Fonasa)'}` })),
  ];

  const contractOptions: SelectOption[] = [
    { value: '', label: '-- Seleccionar Tipo Contrato --' },
    ...contractTypes.map((ct) => ({ value: ct.id.toString(), label: ct.name })),
  ];

  const bankOptions: SelectOption[] = [
    { value: '', label: '-- Seleccionar Banco --' },
    ...banks.map((b) => ({ value: b.id.toString(), label: b.name })),
  ];

  // Populate form fields
  useEffect(() => {
    if (worker) {
      setName(worker.name || '');
      setPaternalLastName(worker.paternalLastName || '');
      setMaternalLastName(worker.maternalLastName || '');
      setRut(worker.rut || '');
      setEntryDate(worker.entryDate ? new Date(worker.entryDate).toISOString().split('T')[0] : '');
      setBaseSalary(worker.baseSalary ? worker.baseSalary.toString() : '');
      setCompanyId(worker.companyId ? worker.companyId.toString() : '');
      setAfpId(worker.afpId ? worker.afpId.toString() : '');
      setHealthInstitutionId(worker.healthInstitutionId ? worker.healthInstitutionId.toString() : '');
      setHealthAgreedUf(worker.healthAgreedUf ? worker.healthAgreedUf.toString() : '');
      setContractTypeId(worker.contractTypeId ? worker.contractTypeId.toString() : '');
      setBankId(worker.bankId ? worker.bankId.toString() : '');
      setBankAccountType(worker.bankAccountType || '');
      setBankAccountNumber(worker.bankAccountNumber || '');
    }
  }, [worker]);

  const updateMutation = useMutation({
    mutationFn: (payload: any) => workersService.update(workerId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      queryClient.invalidateQueries({ queryKey: ['worker', workerId] });
      toast.success('Ficha del empleado actualizada con éxito');
      navigate('/settings/workers');
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Error al actualizar la persona';
      const errorStr = Array.isArray(message) ? message.join(', ') : message;
      setApiError(errorStr);
      toast.error(errorStr);
    },
  });

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value);
    setRut(formatted);
    if (rutError && validateRut(formatted)) {
      setRutError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setRutError('');

    const validationResult = workerSchema.safeParse({
      name,
      rut,
      companyId,
    });

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format();
      if (formattedErrors.name?._errors?.[0]) {
        setApiError(formattedErrors.name._errors[0]);
        toast.error(formattedErrors.name._errors[0]);
      } else if (formattedErrors.rut?._errors?.[0]) {
        setRutError(formattedErrors.rut._errors[0]);
        toast.error(formattedErrors.rut._errors[0]);
      }
      return;
    }

    updateMutation.mutate({
      name: validationResult.data.name,
      paternalLastName: paternalLastName.trim() || undefined,
      maternalLastName: maternalLastName.trim() || undefined,
      rut: validationResult.data.rut,
      entryDate: entryDate || undefined,
      baseSalary: baseSalary ? parseFloat(baseSalary) : 0,
      companyId: companyId ? parseInt(companyId, 10) : null,
      afpId: afpId ? parseInt(afpId, 10) : null,
      healthInstitutionId: healthInstitutionId ? parseInt(healthInstitutionId, 10) : null,
      healthAgreedUf: healthAgreedUf ? parseFloat(healthAgreedUf) : 0,
      contractTypeId: contractTypeId ? parseInt(contractTypeId, 10) : null,
      bankId: bankId ? parseInt(bankId, 10) : null,
      bankAccountType: bankAccountType || undefined,
      bankAccountNumber: bankAccountNumber || undefined,
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-sm text-[#787774]">Cargando datos de la persona...</div>;
  }

  if (isError || !worker) {
    return (
      <div className="space-y-4 max-w-5xl">
        <AlertBanner type="error" message="No se pudo encontrar la persona seleccionada." />
        <button
          type="button"
          onClick={() => navigate('/settings/workers')}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-[#37352F] shadow-2xs hover:bg-neutral-50"
        >
          Volver a Personas
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl selection:bg-neutral-200">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/settings/workers')}
          className="flex items-center gap-2 rounded-xl border border-neutral-200/80 bg-white/80 px-3 py-1.5 text-xs font-medium text-[#37352F] shadow-2xs backdrop-blur-md hover:bg-neutral-100 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Volver a Personas</span>
        </button>

        <div className="flex items-center gap-2">
          <UserGroupIcon className="h-6 w-6 text-[#37352F]" />
          <h1 className="text-xl font-bold tracking-tight text-[#37352F]">
            Ficha del Empleado: {worker.name}
          </h1>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-3xl border border-white/80 bg-white/70 p-8 shadow-sm backdrop-blur-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {apiError && <AlertBanner type="error" message={apiError} />}

          {/* Section 1: Datos Personales */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#37352F] border-b border-neutral-200/60 pb-1">
              1. Datos Personales e Identificación
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#787774] mb-1">
                  Nombres *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Juan Antonio"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#787774] mb-1">
                  Apellido Paterno
                </label>
                <input
                  type="text"
                  placeholder="Ej: Pérez"
                  value={paternalLastName}
                  onChange={(e) => setPaternalLastName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#787774] mb-1">
                  Apellido Materno
                </label>
                <input
                  type="text"
                  placeholder="Ej: González"
                  value={maternalLastName}
                  onChange={(e) => setMaternalLastName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#787774] mb-1">
                  RUT del Trabajador *
                </label>
                <input
                  type="text"
                  placeholder="Ej: 19.876.543-2"
                  value={rut}
                  onChange={handleRutChange}
                  maxLength={12}
                  className={`w-full rounded-xl border px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:outline-none focus:ring-1 ${
                    rutError
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500'
                      : 'border-neutral-200 focus:border-[#37352F] focus:ring-[#37352F]'
                  }`}
                  required
                />
                {rutError && <p className="mt-1 text-xs text-rose-600 font-medium">{rutError}</p>}
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#787774] mb-1">
                  Empresa Asignada
                </label>
                <CustomSelect<SelectOption>
                  options={companyOptions}
                  value={companyOptions.find((o) => o.value === companyId) || companyOptions[0]}
                  onChange={(opt) => setCompanyId(opt?.value || '')}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Datos Contratantes y Previsionales */}
          <div className="space-y-3 pt-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#37352F] border-b border-neutral-200/60 pb-1">
              2. Contrato, Previsión y Sueldo
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#787774] mb-1">
                  Fecha de Ingreso
                </label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#787774] mb-1">
                  Sueldo Base Pactado ($)
                </label>
                <input
                  type="number"
                  placeholder="Ej: 600000"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#787774] mb-1">
                  Tipo de Contrato
                </label>
                <CustomSelect<SelectOption>
                  options={contractOptions}
                  value={contractOptions.find((o) => o.value === contractTypeId) || contractOptions[0]}
                  onChange={(opt) => setContractTypeId(opt?.value || '')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#787774] mb-1">
                  AFP Afiliada
                </label>
                <CustomSelect<SelectOption>
                  options={afpOptions}
                  value={afpOptions.find((o) => o.value === afpId) || afpOptions[0]}
                  onChange={(opt) => setAfpId(opt?.value || '')}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#787774] mb-1">
                  Institución de Salud
                </label>
                <CustomSelect<SelectOption>
                  options={healthOptions}
                  value={healthOptions.find((o) => o.value === healthInstitutionId) || healthOptions[0]}
                  onChange={(opt) => setHealthInstitutionId(opt?.value || '')}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#787774] mb-1">
                  Monto Pactado Isapre (UF)
                </label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="Ej: 3.5"
                  value={healthAgreedUf}
                  onChange={(e) => setHealthAgreedUf(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Datos de Pago Bancario */}
          <div className="space-y-3 pt-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#37352F] border-b border-neutral-200/60 pb-1">
              3. Datos de Pago Bancario (Opcional)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#787774] mb-1">
                  Banco Destino
                </label>
                <CustomSelect<SelectOption>
                  options={bankOptions}
                  value={bankOptions.find((o) => o.value === bankId) || bankOptions[0]}
                  onChange={(opt) => setBankId(opt?.value || '')}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#787774] mb-1">
                  Tipo de Cuenta
                </label>
                <CustomSelect<SelectOption>
                  options={bankAccountTypeOptions}
                  value={bankAccountTypeOptions.find((o) => o.value === bankAccountType) || bankAccountTypeOptions[0]}
                  onChange={(opt) => setBankAccountType(opt?.value || '')}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#787774] mb-1">
                  Número de Cuenta
                </label>
                <input
                  type="text"
                  placeholder="Ej: 19876543"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200/60 mt-6">
            <button
              type="button"
              onClick={() => navigate('/settings/workers')}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-[#37352F] shadow-2xs hover:bg-neutral-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 rounded-xl bg-[#37352F] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#201F1C] disabled:opacity-50"
            >
              <Save className="h-4 w-4 text-emerald-400" />
              <span>{updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWorkerPage;
