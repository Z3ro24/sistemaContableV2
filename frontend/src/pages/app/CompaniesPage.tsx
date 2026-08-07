import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BuildingOfficeIcon,
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import companiesService from '../../services/companiesService';
import CompanyModal from '../../components/modals/CompanyModal';
import AlertBanner from '../../components/common/AlertBanner';
import { cleanRut } from '../../utils/rutUtils';
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

const ITEMS_PER_PAGE = 10;

export const CompaniesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [apiError, setApiError] = useState<string | null>(null);
  const [deletingCompany, setDeletingCompany] = useState<{ id: number; name: string } | null>(null);

  const queryClient = useQueryClient();

  const { data: companies = [], isLoading, isError } = useQuery({
    queryKey: ['companies'],
    queryFn: companiesService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: companiesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Empresa eliminada correctamente');
      setDeletingCompany(null);
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Error al eliminar la empresa';
      const formatted = Array.isArray(message) ? message.join(', ') : message;
      setApiError(formatted);
      toast.error(formatted);
      setDeletingCompany(null);
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

  const confirmDelete = () => {
    if (deletingCompany) {
      setApiError(null);
      deleteMutation.mutate(deletingCompany.id);
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
              Empresas & Sucursales
            </h1>
            <p className="text-xs text-[#787774] mt-0.5">
              Administración centralizada de razones sociales e instituciones
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="h-11 px-5 rounded-2xl bg-[#37352F] hover:bg-[#201F1C] text-white font-semibold text-xs shadow-md"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Nueva Empresa
        </Button>
      </div>

      {apiError && <AlertBanner type="error" message={apiError} />}

      {/* Main Table Card */}
      <div className="rounded-3xl border border-white/80 bg-white/60 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] ring-1 ring-white/60 backdrop-blur-3xl space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#787774]" />
          <input
            type="text"
            placeholder="Buscar por Nombre o RUT de Empresa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/95 border border-neutral-200 rounded-xl text-xs text-[#37352F] placeholder-[#787774]/70 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="p-8 text-center text-xs text-[#787774]">
            Cargando empresas...
          </div>
        )}

        {isError && (
          <div className="p-8 text-center text-xs text-rose-600">
            Error al cargar la lista de empresas.
          </div>
        )}

        {!isLoading && !isError && filteredCompanies.length === 0 && (
          <div className="p-12 text-center text-xs text-[#787774]">
            {searchQuery
              ? 'No se encontraron empresas que coincidan con la búsqueda.'
              : 'No hay empresas registradas en el sistema.'}
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && filteredCompanies.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-neutral-200/80 bg-white/80">
            <table className="w-full text-left text-xs text-[#37352F]">
              <thead className="bg-[#F7F7F5] border-b border-neutral-200/80 font-bold uppercase tracking-wider text-[10px] text-[#787774]">
                <tr>
                  <th className="px-4 py-3">RUT Empresa</th>
                  <th className="px-4 py-3">Razón Social</th>
                  <th className="px-4 py-3">Giro / Actividad</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60">
                {paginatedCompanies.map((company) => (
                  <tr
                    key={company.id}
                    className="hover:bg-neutral-50/80 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-medium text-xs">
                      {company.rutCompany}
                    </td>
                    <td className="px-4 py-3 font-bold text-[#37352F]">
                      {company.name}
                    </td>
                    <td className="px-4 py-3 text-[#787774]">
                      {company.address || (
                        <span className="italic text-neutral-400">Sin Dirección</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingCompany({ id: company.id, name: company.name })}
                          title="Eliminar Empresa"
                          className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#787774]">
              Página {currentPage} de {totalPages} ({filteredCompanies.length} empresas)
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 text-xs font-semibold"
              >
                <ChevronLeftIcon className="h-3.5 w-3.5 mr-1" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 text-xs font-semibold"
              >
                Siguiente
                <ChevronRightIcon className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Creating Company */}
      <CompanyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Shadcn AlertDialog for Deleting Company */}
      <AlertDialog
        open={!!deletingCompany}
        onOpenChange={(open) => !open && setDeletingCompany(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación de empresa?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar permanentemente la empresa{' '}
              <strong className="text-[#37352F]">{deletingCompany?.name}</strong>? Esta acción eliminará los datos asociados y no se puede deshacer.
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

export default CompaniesPage;
