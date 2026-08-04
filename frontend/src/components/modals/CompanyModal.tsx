import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { XMarkIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import companiesService from '../../services/companiesService';
import { formatRut, validateRut } from '../../utils/rutUtils';
import { companySchema } from '../../validators/companyValidator';
import AlertBanner from '../common/AlertBanner';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [rutCompany, setRutCompany] = useState('');
  const [address, setAddress] = useState('');
  const [rutError, setRutError] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: companiesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Empresa guardada exitosamente');
      handleClose();
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Error al crear la empresa';
      const errorStr = Array.isArray(message) ? message.join(', ') : message;
      setApiError(errorStr);
      toast.error(errorStr);
    },
  });

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value);
    setRutCompany(formatted);
    if (rutError && validateRut(formatted)) {
      setRutError('');
    }
  };

  const handleClose = () => {
    setName('');
    setRutCompany('');
    setAddress('');
    setRutError('');
    setApiError(null);
    onClose();
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
        toast.error(formattedErrors.name._errors[0]);
      } else if (formattedErrors.rutCompany?._errors?.[0]) {
        setRutError(formattedErrors.rutCompany._errors[0]);
        toast.error(formattedErrors.rutCompany._errors[0]);
      }
      return;
    }

    createMutation.mutate({
      name: validationResult.data.name,
      rutCompany: validationResult.data.rutCompany,
      address: address.trim() || undefined,
    });
  };

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
                <BuildingOfficeIcon className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg font-bold text-[#37352F]">
                Agregar Nueva Empresa
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
                Razón Social / Nombre
              </label>
              <input
                type="text"
                placeholder="Ej: Contabilidad & Finanzas SpA"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-[#37352F] placeholder-[#787774]/60 shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
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
                placeholder="Ej: 76.123.456-7"
                value={rutCompany}
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

            {/* Field: Address */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#787774] mb-1.5">
                Dirección Comercial (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej: Av. Providencia 1234, Oficina 501"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-[#37352F] placeholder-[#787774]/60 shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
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
                className="flex items-center gap-2 rounded-xl bg-[#37352F] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#201F1C] disabled:opacity-50"
              >
                <Save className="h-4 w-4 text-emerald-400" />
                <span>{createMutation.isPending ? 'Guardando...' : 'Guardar Empresa'}</span>
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default CompanyModal;
