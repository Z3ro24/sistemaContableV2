import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeftIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import workersService from '../../services/workersService';
import companiesService from '../../services/companiesService';
import { formatRut, validateRut } from '../../utils/rutUtils';
import { workerSchema } from '../../validators/workerValidator';
import AlertBanner from '../../components/common/AlertBanner';
import CustomSelect from '../../components/common/CustomSelect';

interface CompanyOption {
  value: string;
  label: string;
}

export const EditWorkerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const workerId = id ? parseInt(id, 10) : 0;

  const [name, setName] = useState('');
  const [rut, setRut] = useState('');
  const [companyId, setCompanyId] = useState<string>('');
  const [rutError, setRutError] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch worker details
  const { data: worker, isLoading, isError } = useQuery({
    queryKey: ['worker', workerId],
    queryFn: () => workersService.getById(workerId),
    enabled: !!workerId,
  });

  // Fetch user companies
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: companiesService.getAll,
  });

  const companyOptions: CompanyOption[] = [
    { value: '', label: '-- Sin Empresa Asignada --' },
    ...companies.map((comp) => ({
      value: comp.id.toString(),
      label: `${comp.name} (${comp.rutCompany})`,
    })),
  ];

  useEffect(() => {
    if (worker) {
      setName(worker.name);
      setRut(formatRut(worker.rut));
      setCompanyId(worker.companyId ? worker.companyId.toString() : '');
    }
  }, [worker]);

  const updateMutation = useMutation({
    mutationFn: (payload: { name: string; rut: string; companyId?: number | null }) =>
      workersService.update(workerId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      queryClient.invalidateQueries({ queryKey: ['worker', workerId] });
      navigate('/settings/workers');
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Error al actualizar la persona';
      setApiError(Array.isArray(message) ? message.join(', ') : message);
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
      } else if (formattedErrors.rut?._errors?.[0]) {
        setRutError(formattedErrors.rut._errors[0]);
      }
      return;
    }

    updateMutation.mutate({
      name: validationResult.data.name,
      rut: validationResult.data.rut,
      companyId: companyId ? parseInt(companyId, 10) : null,
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-[#787774]">
        Cargando datos de la persona...
      </div>
    );
  }

  if (isError || !worker) {
    return (
      <div className="space-y-4 max-w-2xl">
        <AlertBanner type="error" message="No se pudo encontrar la persona o no tienes permisos." />
        <button
          type="button"
          onClick={() => navigate('/settings/workers')}
          className="flex items-center gap-2 text-xs font-semibold text-[#37352F]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Volver al Listado</span>
        </button>
      </div>
    );
  }

  const selectedOption = companyOptions.find((opt) => opt.value === companyId) || companyOptions[0];

  return (
    <div className="space-y-6 max-w-3xl selection:bg-neutral-200">
      {/* Top Action Bar */}
      <button
        type="button"
        onClick={() => navigate('/settings/workers')}
        className="flex items-center gap-2 text-xs font-semibold text-[#787774] hover:text-[#37352F] transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        <span>Volver a Personas</span>
      </button>

      {/* Main Edit Form Card */}
      <div className="rounded-3xl border border-white/80 bg-white/60 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] ring-1 ring-white/60 backdrop-blur-3xl space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-neutral-200/60">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#37352F] text-white shadow-md shadow-neutral-900/10">
            <UserGroupIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#37352F]">
              Editar Persona: {worker.name}
            </h1>
            <p className="text-xs text-[#787774]">
              Modifica los detalles, RUT o empresa asignada.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {apiError && <AlertBanner type="error" message={apiError} />}

          {/* Field: Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#787774] mb-1.5">
              Nombre Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
              required
            />
          </div>

          {/* Field: RUT */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#787774] mb-1.5">
              RUT de la Persona
            </label>
            <input
              type="text"
              value={rut}
              onChange={handleRutChange}
              maxLength={12}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#37352F] shadow-2xs focus:outline-none focus:ring-1 ${
                rutError
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500'
                  : 'border-neutral-200 focus:border-[#37352F] focus:ring-[#37352F]'
              }`}
              required
            />
            {rutError && <p className="mt-1 text-xs text-rose-600 font-medium">{rutError}</p>}
          </div>

          {/* Field: Company Select (React Select) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#787774] mb-1.5">
              Empresa Asignada
            </label>
            <CustomSelect<CompanyOption>
              options={companyOptions}
              value={selectedOption}
              onChange={(option) => setCompanyId(option?.value || '')}
              placeholder="Seleccionar empresa..."
            />
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
              className="rounded-xl bg-[#37352F] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#201F1C] disabled:opacity-50"
            >
              {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWorkerPage;
