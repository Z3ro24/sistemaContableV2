import React from 'react';
import { UserGroupIcon, PlusIcon } from '@heroicons/react/24/outline';

export const WorkersPage: React.FC = () => {
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
              Personas y Trabajadores
            </h1>
            <p className="text-xs text-[#787774]">
              Gestión de personas, trabajadores, identificación RUT y asignaciones.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#37352F] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#201F1C] focus:outline-none focus:ring-2 focus:ring-neutral-400"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Agregar Persona</span>
        </button>
      </div>

      {/* Content Placeholder Card */}
      <div className="rounded-2xl border border-white/80 bg-white/60 p-8 shadow-sm backdrop-blur-2xl text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-[#787774]">
          <UserGroupIcon className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-[#37352F]">No hay personas registradas aún</h3>
        <p className="text-xs text-[#787774] max-w-sm mx-auto">
          Los registros de personas vinculan usuarios con identificación RUT y empresas asignadas. Haz clic en "Agregar Persona" para crear el primero.
        </p>
      </div>
    </div>
  );
};

export default WorkersPage;
