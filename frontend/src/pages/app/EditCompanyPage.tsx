import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeftIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import companiesService from '../../services/companiesService';
import { formatRut, validateRut } from '../../utils/rutUtils';
import { companySchema } from '../../validators/companyValidator';
import AlertBanner from '../../components/common/AlertBanner';

export const EditCompanyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const companyId = id ? parseInt(id, 10) : 0;

  const [name, setName] = useState('');
  const [rutCompany, setRutCompany] = useState('');
  const [address, setAddress] = useState('');
  const [rutError, setRutError] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch company details
  const { data: company, isLoading, isError } = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => companiesService.getById(companyId),
    enabled: !!companyId,
  });

  useEffect(() => {
    if (company) {
      setName(company.name);
      setRutCompany(formatRut(company.rutCompany));
      setAddress(company.address || '');
    }
  }, [company]);

  const updateMutation = useMutation({
    mutationFn: (payload: { name: string; rutCompany: string; address?: string }) =>
      companiesService.update(companyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['company', companyId] });
      navigate('/settings/companies');
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Error al actualizar la empresa';
      setApiError(Array.isArray(message) ? message.join(', ') : message);
    },
  });

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value);
    setRutCompany(formatted);
    if (rutError && validateRut(formatted)) {
      setRutError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setRutError('');

    const validationResult = companySchema.safeParse({
      name,
      rutCompany,
    });

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format();
      if (formattedErrors.name?._errors?.[0]) {
        setApiError(formattedErrors.name._errors[0]);
      } else if (formattedErrors.rutCompany?._errors?.[0]) {
        setRutError(formattedErrors.rutCompany._errors[0]);
      }
      return;
    }

    updateMutation.mutate({
      name: validationResult.data.name,
      rutCompany: validationResult.data.rutCompany,
      address: address.trim() || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-[#787774]">
        Cargando datos de la empresa...
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div className="space-y-4 max-w-2xl">
        <AlertBanner type="error" message="No se pudo encontrar la empresa o no tienes permisos." />
        <button
          type="button"
          onClick={() => navigate('/settings/companies')}
          className="flex items-center gap-2 text-xs font-semibold text-[#37352F]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Volver al Listado</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl selection:bg-neutral-200">
      {/* Top Action Bar */}
      <button
        type="button"
        onClick={() => navigate('/settings/companies')}
        className="flex items-center gap-2 text-xs font-semibold text-[#787774] hover:text-[#37352F] transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        <span>Volver a Empresas</span>
      </button>

      {/* Main Edit Form Card */}
      <div className="rounded-3xl border border-white/80 bg-white/60 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] ring-1 ring-white/60 backdrop-blur-3xl space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-neutral-200/60">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#37352F] text-white shadow-md shadow-neutral-900/10">
            <BuildingOfficeIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#37352F]">
              Editar Empresa: {company.name}
            </h1>
            <p className="text-xs text-[#787774]">
              Modifica la razón social, RUT corporativo o dirección comercial.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {apiError && <AlertBanner type="error" message={apiError} />}

          {/* Field: Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#787774] mb-1.5">
              Razón Social / Nombre
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
              RUT Empresa
            </label>
            <input
              type="text"
              value={rutCompany}
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

          {/* Field: Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#787774] mb-1.5">
              Dirección Comercial (Opcional)
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200/60 mt-6">
            <button
              type="button"
              onClick={() => navigate('/settings/companies')}
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

export default EditCompanyPage;
