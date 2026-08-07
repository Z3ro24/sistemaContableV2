import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CalendarDaysIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import workersService from '../../services/workersService';
import noveltiesService, { type MonthlyNoveltyData } from '../../services/noveltiesService';
import AlertBanner from '../../components/common/AlertBanner';
import NoveltyModal from '../../components/modals/NoveltyModal';
import { useAppSelector } from '../../store/store';

export const NoveltiesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const filterCompanyId = useAppSelector((state) => state.company.selectedCompanyId);

  // Filters & Search
  const [filterPeriod, setFilterPeriod] = useState<string>('2026-07');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Pagination (10 per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Reset to page 1 on filter or company change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterCompanyId, filterPeriod, searchQuery]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNovelty, setEditingNovelty] = useState<MonthlyNoveltyData | null>(null);

  // Delete Confirm State
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pageApiError, setPageApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch Workers
  const { data: workers = [] } = useQuery({
    queryKey: ['workers'],
    queryFn: workersService.getAll,
  });

  const parsedCompanyId = filterCompanyId !== 'all' ? parseInt(filterCompanyId, 10) : undefined;

  // Fetch Novelties List
  const { data: noveltiesList = [], isLoading, isError } = useQuery({
    queryKey: ['noveltiesList', filterPeriod, filterCompanyId],
    queryFn: () => noveltiesService.getAll(filterPeriod, parsedCompanyId),
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: noveltiesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['noveltiesList'] });
      setDeletingId(null);
      setSuccessMessage('Novedad eliminada exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Error al eliminar el registro de novedad';
      setPageApiError(Array.isArray(msg) ? msg.join(', ') : msg);
    },
  });

  // Client-side search filtering
  const filteredNovelties = noveltiesList.filter((n) => {
    if (!searchQuery.trim()) return true;
    const workerName = [n.worker?.name, n.worker?.paternalLastName, n.worker?.maternalLastName]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const rut = (n.worker?.rut || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return workerName.includes(query) || rut.includes(query);
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredNovelties.length / itemsPerPage) || 1;
  const paginatedNovelties = filteredNovelties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenCreateModal = () => {
    setEditingNovelty(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (novelty: MonthlyNoveltyData) => {
    setEditingNovelty(novelty);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6 max-w-6xl selection:bg-neutral-200">
      {/* Notion Glass Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/80 bg-white/60 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] ring-1 ring-white/60 backdrop-blur-3xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#37352F] text-white shadow-md shadow-neutral-900/10">
            <CalendarDaysIcon className="h-7 w-7 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#37352F]">
              Novedades del Mes
            </h1>
            <p className="text-xs text-[#787774]">
              Gestión centralizada de licencias, horas extras, cargas y bonos adicionales del personal.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#37352F] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#201F1C] focus:outline-none focus:ring-2 focus:ring-neutral-400"
        >
          <PlusIcon className="h-4 w-4 text-emerald-400" />
          <span>Registrar Novedad del Mes</span>
        </button>
      </div>

      {successMessage && <AlertBanner type="success" message={successMessage} />}
      {pageApiError && <AlertBanner type="error" message={pageApiError} />}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-40">
            <input
              type="month"
              value={filterPeriod}
              onChange={(e) => {
                setFilterPeriod(e.target.value);
                setCurrentPage(1);
              }}
              className="h-[38px] w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-mono text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
            />
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-[#787774]" />
          <input
            type="text"
            placeholder="Buscar por Nombre o RUT..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="h-[38px] w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-3 py-2 text-xs text-[#37352F] shadow-2xs focus:border-[#37352F] focus:outline-none focus:ring-1 focus:ring-[#37352F]"
          />
        </div>
      </div>

      {/* Main Table */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-[#787774]">Cargando listado de novedades del mes...</div>
      ) : isError ? (
        <AlertBanner type="error" message="Error al cargar las novedades del mes" />
      ) : filteredNovelties.length === 0 ? (
        <div className="rounded-2xl border border-white/80 bg-white/60 p-8 shadow-sm backdrop-blur-2xl text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-[#787774]">
            <CalendarDaysIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-base font-semibold text-[#37352F]">Sin novedades registradas</h3>
          <p className="text-xs text-[#787774] max-w-sm mx-auto">
            No se encontraron registros de novedades para el período <strong>{filterPeriod}</strong>. Haz clic en "Registrar Novedad del Mes" para añadir uno.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/60 shadow-sm backdrop-blur-2xl space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200/60 bg-white/40 text-[#787774] uppercase tracking-wider text-[10px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Trabajador</th>
                  <th className="py-3 px-3">Período</th>
                  <th className="py-3 px-3 text-center">Días Trab. / Lic.</th>
                  <th className="py-3 px-3 text-center">Horas Extras</th>
                  <th className="py-3 px-3 text-right">Bonos Imponibles</th>
                  <th className="py-3 px-3 text-right">No Imponibles</th>
                  <th className="py-3 px-3 text-right">Descuentos</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60 text-[#37352F]">
                {paginatedNovelties.map((item) => {
                  const workerName = [
                    item.worker?.name,
                    item.worker?.paternalLastName,
                    item.worker?.maternalLastName,
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <tr key={item.id} className="hover:bg-white/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="block font-bold">{workerName}</span>
                        <span className="text-[10px] text-[#787774] font-mono">
                          {item.worker?.rut} • {item.worker?.company?.name || 'Empresa'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-medium">
                        {item.periodYyyyMm}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="font-semibold">{item.workedDays}d</span>
                        {item.sickLeaveDays > 0 && (
                          <span className="ml-1 text-[10px] rounded bg-amber-100 px-1 py-0.5 text-amber-800 font-bold">
                            {item.sickLeaveDays}d lic.
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono">
                        {item.overtime50Hrs > 0 && (
                          <span className="block text-[11px] font-semibold text-emerald-800">
                            +{item.overtime50Hrs}h (50%)
                          </span>
                        )}
                        {item.overtime100Hrs > 0 && (
                          <span className="block text-[11px] font-semibold text-indigo-800">
                            +{item.overtime100Hrs}h (100%)
                          </span>
                        )}
                        {item.overtime50Hrs === 0 && item.overtime100Hrs === 0 && (
                          <span className="text-[#787774]">0h</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-medium">
                        ${Number(item.otherTaxableIncome).toLocaleString('es-CL')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-emerald-800 font-medium">
                        ${Number(item.otherNonTaxableIncome).toLocaleString('es-CL')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-rose-700 font-medium">
                        -${Number(item.otherDeductions).toLocaleString('es-CL')}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            title="Editar Novedad"
                            className="p-1.5 rounded-lg border border-neutral-300 bg-white text-[#37352F] hover:bg-neutral-100 transition-colors shadow-2xs"
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingId(item.id || null)}
                            title="Eliminar Novedad"
                            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors shadow-2xs"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-3 border-t border-neutral-200/60 flex items-center justify-between bg-white/40">
            <span className="text-xs text-[#787774]">
              Mostrando <strong>{paginatedNovelties.length}</strong> de <strong>{filteredNovelties.length}</strong> novedades
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-2.5 py-1 text-xs font-semibold text-[#37352F] shadow-2xs hover:bg-neutral-100 transition-colors disabled:opacity-40"
              >
                <ChevronLeftIcon className="h-3.5 w-3.5" />
                <span>Anterior</span>
              </button>

              <span className="text-xs font-semibold text-[#37352F] px-2">
                Página {currentPage} de {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-2.5 py-1 text-xs font-semibold text-[#37352F] shadow-2xs hover:bg-neutral-100 transition-colors disabled:opacity-40"
              >
                <span>Siguiente</span>
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Creation / Edition Modal */}
      <NoveltyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['noveltiesList'] });
          setSuccessMessage(editingNovelty ? 'Novedad actualizada exitosamente' : 'Novedad registrada exitosamente');
          setTimeout(() => setSuccessMessage(null), 3000);
        }}
        initialData={editingNovelty}
        workers={workers}
        defaultPeriod={filterPeriod}
      />

      {/* Delete Confirmation Dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#37352F]">¿Eliminar registro de novedad?</h3>
            <p className="text-xs text-[#787774]">
              Esta acción eliminará de forma permanente la novedad del trabajador para este período.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-[#37352F] hover:bg-neutral-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => handleDeleteConfirm(deletingId)}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Eliminando...' : 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoveltiesPage;
