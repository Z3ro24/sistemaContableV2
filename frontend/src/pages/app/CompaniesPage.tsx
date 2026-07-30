import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BuildingOfficeIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import companiesService from '../../services/companiesService';
import CompanyModal from '../../components/modals/CompanyModal';
import AlertBanner from '../../components/common/AlertBanner';
import { cleanRut } from '../../utils/rutUtils';

const ITEMS_PER_PAGE = 10;

export const CompaniesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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

  // Reset to page 1 on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filtered companies logic
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const query = searchQuery.trim().toLowerCase();
      const cleanedQuery = cleanRut(query);

      return (
        !query ||
        company.name.toLowerCase().includes(query) ||
        company.rutCompany.toLowerCase().includes(query) ||
        (cleanedQuery && cleanRut(company.rutCompany).includes(cleanedQuery))
      );
    });
  }, [companies, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE) || 1;
  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCompanies.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCompanies, currentPage]);

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

      {/* Controls Bar: Search Input */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 w-full">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#787774]" />
          <input
            type="text"
            placeholder="Buscar por nombre de empresa o RUT (ej: 76.123.456-7)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-white/80 bg-white/70 pl-10 pr-4 py-2.5 text-xs text-[#37352F] placeholder-[#787774]/70 shadow-2xs backdrop-blur-md focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
          />
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="p-8 text-center text-sm text-[#787774]">Cargando empresas...</div>
      ) : isError ? (
        <AlertBanner type="error" message="Error al cargar el listado de empresas" />
      ) : filteredCompanies.length === 0 ? (
        <div className="rounded-2xl border border-white/80 bg-white/60 p-8 shadow-sm backdrop-blur-2xl text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-[#787774]">
            <BuildingOfficeIcon className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-[#37352F]">No se encontraron empresas</h3>
          <p className="text-xs text-[#787774] max-w-sm mx-auto">
            {companies.length === 0
              ? 'Los registros de empresas almacenan detalles del RUT corporativo asociados a los trabajadores asignados. Haz clic en "Agregar Empresa" para comenzar.'
              : 'No hay empresas que coincidan con el término de búsqueda ingresado.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Table */}
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
                {paginatedCompanies.map((company) => (
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

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-1 text-xs text-[#787774]">
            <div>
              Mostrando{' '}
              <span className="font-semibold text-[#37352F]">
                {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredCompanies.length)}
              </span>{' '}
              a{' '}
              <span className="font-semibold text-[#37352F]">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredCompanies.length)}
              </span>{' '}
              de <span className="font-semibold text-[#37352F]">{filteredCompanies.length}</span> empresas
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 font-medium text-[#37352F] shadow-2xs backdrop-blur-md hover:bg-[#37352F] hover:text-white disabled:opacity-40 transition-colors"
              >
                <ChevronLeftIcon className="h-3.5 w-3.5" />
                <span>Anterior</span>
              </button>

              <span className="px-2 font-medium text-[#37352F]">
                Página {currentPage} de {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 font-medium text-[#37352F] shadow-2xs backdrop-blur-md hover:bg-[#37352F] hover:text-white disabled:opacity-40 transition-colors"
              >
                <span>Siguiente</span>
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Creation Modal */}
      <CompanyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default CompaniesPage;
