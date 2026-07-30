import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BuildingOfficeIcon, PlusIcon, PencilSquareIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import companiesService from '../../services/companiesService';
import CompanyModal from '../../components/modals/CompanyModal';
import AlertBanner from '../../components/common/AlertBanner';

export const CompaniesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: companies = [], isLoading, isError } = useQuery({
    queryKey: ['companies'],
    queryFn: companiesService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: companiesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Error al eliminar la empresa';
      setApiError(Array.isArray(message) ? message.join(', ') : message);
    },
  });

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la empresa "${name}"?`)) {
      setApiError(null);
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl selection:bg-neutral-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/80 bg-white/60 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] ring-1 ring-white/60 backdrop-blur-3xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#37352F] text-white shadow-md shadow-neutral-900/10">
            <BuildingOfficeIcon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#37352F]">
              Empresas y Entidades
            </h1>
            <p className="text-xs text-[#787774]">
              Gestión de entidades comerciales, RUT de empresas y trabajadores asociados.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#37352F] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#201F1C] focus:outline-none focus:ring-2 focus:ring-neutral-400"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Agregar Empresa</span>
        </button>
      </div>

      {apiError && <AlertBanner type="error" message={apiError} />}

      {/* Content Area */}
      {isLoading ? (
        <div className="p-8 text-center text-sm text-[#787774]">Cargando empresas...</div>
      ) : isError ? (
        <AlertBanner type="error" message="Error al cargar el listado de empresas" />
      ) : companies.length === 0 ? (
        <div className="rounded-2xl border border-white/80 bg-white/60 p-8 shadow-sm backdrop-blur-2xl text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-[#787774]">
            <BuildingOfficeIcon className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-[#37352F]">No hay empresas registradas aún</h3>
          <p className="text-xs text-[#787774] max-w-sm mx-auto">
            Los registros de empresas almacenan detalles del RUT corporativo asociados a los trabajadores asignados. Haz clic en "Agregar Empresa" para comenzar.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/60 shadow-sm backdrop-blur-2xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200/60 bg-white/40 text-[#787774] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">Nombre Empresa</th>
                <th className="px-6 py-3.5">RUT Empresa</th>
                <th className="px-6 py-3.5">Personas Asignadas</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60 text-[#37352F]">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-4 font-semibold text-sm">
                    {company.name}
                  </td>
                  <td className="px-6 py-4 font-mono font-medium">
                    {company.rutCompany}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 border border-neutral-200/80 px-2.5 py-1 text-xs font-medium text-[#37352F]">
                      <UserGroupIcon className="h-3.5 w-3.5 text-[#787774]" />
                      {company._count?.workers ?? 0} {company._count?.workers === 1 ? 'persona' : 'personas'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/settings/companies/edit/${company.id}`)}
                        title="Editar Empresa"
                        className="rounded-lg p-1.5 border border-neutral-200 bg-white text-[#37352F] hover:bg-neutral-100 transition-colors shadow-2xs"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(company.id, company.name)}
                        title="Eliminar Empresa"
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

      {/* Creation Modal */}
      <CompanyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default CompaniesPage;
