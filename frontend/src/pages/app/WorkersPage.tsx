import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UserGroupIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import workersService from "../../services/workersService";
import WorkerModal from "../../components/modals/WorkerModal";
import AlertBanner from "../../components/common/AlertBanner";
import { cleanRut } from "../../utils/rutUtils";
import { useAppSelector } from "../../store/store";
import { Button } from "../../components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../components/ui/alert-dialog";

const ITEMS_PER_PAGE = 10;

export const WorkersPage: React.FC = () => {
  const selectedCompanyId = useAppSelector(
    (state) => state.company.selectedCompanyId,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [apiError, setApiError] = useState<string | null>(null);
  const [deletingWorker, setDeletingWorker] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch workers
  const {
    data: workers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["workers"],
    queryFn: workersService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: workersService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
      toast.success("Empleado eliminado correctamente");
      setDeletingWorker(null);
    },
    onError: (err: any) => {
      const message =
        err.response?.data?.message || "Error al eliminar la persona";
      const formatted = Array.isArray(message) ? message.join(", ") : message;
      setApiError(formatted);
      toast.error(formatted);
      setDeletingWorker(null);
    },
  });

  //Reset to page 1 on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCompanyId]);

  // Filtered workers logic
  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      const query = searchQuery.trim().toLowerCase();
      const cleanedQuery = cleanRut(query);

      const matchesSearch =
        !query ||
        worker.name.toLowerCase().includes(query) ||
        worker.rut.toLowerCase().includes(query) ||
        (cleanedQuery && cleanRut(worker.rut).includes(cleanedQuery));

      let matchesCompany = true;
      if (selectedCompanyId === "unassigned") {
        matchesCompany = !worker.companyId;
      } else if (selectedCompanyId && selectedCompanyId !== "all") {
        matchesCompany = worker.companyId === parseInt(selectedCompanyId, 10);
      }

      return matchesSearch && matchesCompany;
    });
  }, [workers, searchQuery, selectedCompanyId]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredWorkers.length / ITEMS_PER_PAGE) || 1;
  const paginatedWorkers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredWorkers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredWorkers, currentPage]);

  const confirmDelete = () => {
    if (deletingWorker) {
      setApiError(null);
      deleteMutation.mutate(deletingWorker.id);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl selection:bg-neutral-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/80 bg-white/60 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] ring-1 ring-white/60 backdrop-blur-3xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#37352F] text-white shadow-md shadow-neutral-900/10">
            <UserGroupIcon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#37352F]">
              Ficha de Empleados
            </h1>
            <p className="text-xs text-[#787774] mt-0.5">
              Administra el personal, contratos y datos previsionales
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="h-11 px-5 rounded-2xl bg-[#37352F] hover:bg-[#201F1C] text-white font-semibold text-xs shadow-md"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Nuevo Empleado
        </Button>
      </div>

      {apiError && <AlertBanner type="error" message={apiError} />}

      {/* Main Table Card */}
      <div className="rounded-3xl border border-white/80 bg-white/60 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] ring-1 ring-white/60 backdrop-blur-3xl space-y-4">
        {/* Search Input Bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#787774]" />
          <input
            type="text"
            placeholder="Buscar por Nombre o RUT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/95 border border-neutral-200 rounded-xl text-xs text-[#37352F] placeholder-[#787774]/70 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="p-8 text-center text-xs text-[#787774]">
            Cargando trabajadores...
          </div>
        )}

        {isError && (
          <div className="p-8 text-center text-xs text-rose-600">
            Error al cargar la lista de empleados.
          </div>
        )}

        {!isLoading && !isError && filteredWorkers.length === 0 && (
          <div className="p-12 text-center text-xs text-[#787774]">
            {searchQuery
              ? "No se encontraron empleados que coincidan con la búsqueda."
              : "No hay empleados registrados en esta empresa."}
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && filteredWorkers.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-neutral-200/80 bg-white/80">
            <table className="w-full text-left text-xs text-[#37352F]">
              <thead className="bg-[#F7F7F5] border-b border-neutral-200/80 font-bold uppercase tracking-wider text-[10px] text-[#787774]">
                <tr>
                  <th className="px-4 py-3">RUT</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Empresa</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60">
                {paginatedWorkers.map((worker) => (
                  <tr
                    key={worker.id}
                    className="hover:bg-neutral-50/80 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-medium text-xs">
                      {worker.rut}
                    </td>
                    <td className="px-4 py-3 font-bold text-[#37352F]">
                      {worker.name}
                    </td>
                    <td className="px-4 py-3 text-[#787774]">
                      {worker.company ? (
                        <div className="flex items-center gap-1.5">
                          <BuildingOfficeIcon className="h-3.5 w-3.5 text-[#787774]" />
                          <span>{worker.company.name}</span>
                        </div>
                      ) : (
                        <span className="italic text-neutral-400">
                          Sin Asignar
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/workers/${worker.id}/edit`)}
                          title="Editar Empleado"
                          className="h-8 w-8 text-[#787774] hover:text-[#37352F]"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setDeletingWorker({
                              id: worker.id,
                              name: worker.name,
                            })
                          }
                          title="Eliminar Empleado"
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
              Página {currentPage} de {totalPages} ({filteredWorkers.length}{" "}
              empleados)
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
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

      {/* Modal for Creating Worker */}
      <WorkerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Shadcn AlertDialog for Deleting Worker */}
      <AlertDialog
        open={!!deletingWorker}
        onOpenChange={(open) => !open && setDeletingWorker(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar permanentemente a{" "}
              <strong className="text-[#37352F]">{deletingWorker?.name}</strong>
              ? Esta acción no se puede deshacer.
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
              {deleteMutation.isPending ? "Eliminando..." : "Sí, Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkersPage;
