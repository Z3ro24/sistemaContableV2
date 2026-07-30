import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { XMarkIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import workersService from '../../services/workersService';
import companiesService from '../../services/companiesService';
import { formatRut, validateRut } from '../../utils/rutUtils';
import { workerSchema } from '../../validators/workerValidator';
import AlertBanner from '../common/AlertBanner';
import CustomSelect from '../common/CustomSelect';

interface WorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CompanyOption {
  value: string;
  label: string;
}

export const WorkerModal: React.FC<WorkerModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [rut, setRut] = useState('');
  const [companyId, setCompanyId] = useState<string>('');
  const [rutError, setRutError] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Fetch companies for dropdown select
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: companiesService.getAll,
    enabled: isOpen,
  });

  const companyOptions: CompanyOption[] = [
    { value: '', label: '-- Sin Empresa Asignada --' },
    ...companies.map((comp) => ({
      value: comp.id.toString(),
      label: `${comp.name} (${comp.rutCompany})`,
    })),
  ];

  const createMutation = useMutation({
    mutationFn: workersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      handleClose();
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Error al crear la persona';
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

  const handleClose = () => {
    setName('');
    setRut('');
    setCompanyId('');
    setRutError('');
    setApiError(null);
    onClose();
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

    createMutation.mutate({
      name: validationResult.data.name,
      rut: validationResult.data.rut,
      companyId: companyId ? parseInt(companyId, 10) : null,
    });
  };

  const selectedOption = companyOptions.find((opt) => opt.value === companyId) || companyOptions[0];

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity" aria-hidden="true" />

      {/* Modal Container */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md overflow-hidden rounded-3xl border border-white/80 bg-white/90 p-6 shadow-2xl backdrop-blur-2xl transition-all">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200/60">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#37352F] text-white shadow-xs">
                <UserGroupIcon className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg font-bold text-[#37352F]">
                Agregar Nueva Persona
              </DialogTitle>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg p-1.5 text-[#787774] hover:bg-neutral-100 hover:text-[#37352F]"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {apiError && <AlertBanner type="error" message={apiError} />}

            {/* Field: Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#787774] mb-1.5">
                Nombre Completo
              </label>
              <input
                type="text"
                placeholder="Ej: Juan Antonio Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-[#37352F] placeholder-[#787774]/60 shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
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
                placeholder="Ej: 19.876.543-2"
                value={rut}
                onChange={handleRutChange}
                maxLength={12}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#37352F] placeholder-[#787774]/60 shadow-2xs focus:outline-none focus:ring-1 ${
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
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200/60 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-[#37352F] shadow-2xs hover:bg-neutral-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="rounded-xl bg-[#37352F] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#201F1C] disabled:opacity-50"
              >
                {createMutation.isPending ? 'Guardando...' : 'Guardar Persona'}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default WorkerModal;
