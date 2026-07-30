import React from 'react';
import { useAppSelector } from '../../store/store';
import { UserIcon, EnvelopeIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export const ProfilePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const getInitials = (name?: string) => {
    if (!name) return 'SC';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-4xl selection:bg-neutral-200">
      {/* Profile Banner Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/60 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] ring-1 ring-white/60 backdrop-blur-3xl before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-transparent before:pointer-events-none">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Circle */}
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-[#37352F] text-2xl font-bold text-white shadow-lg shadow-neutral-900/10">
            {getInitials(user?.name)}
          </div>

          {/* User Details */}
          <div className="space-y-1 text-center sm:text-left min-w-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-[#37352F]">
                {user?.name || 'Usuario'}
              </h1>
              <span className="inline-flex items-center justify-center rounded-full border border-white bg-emerald-100/70 px-3 py-0.5 text-xs font-semibold text-emerald-800 backdrop-blur-md shadow-2xs w-fit mx-auto sm:mx-0">
                {user?.role || 'USER'}
              </span>
            </div>
            <p className="text-sm text-[#787774] flex items-center justify-center sm:justify-start gap-1.5">
              <EnvelopeIcon className="h-4 w-4" />
              <span>{user?.email || 'email@ejemplo.com'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Information Card */}
        <div className="rounded-2xl border border-white/80 bg-white/60 p-6 shadow-sm backdrop-blur-2xl space-y-4">
          <div className="flex items-center gap-2.5 text-[#37352F] font-semibold text-base border-b border-neutral-200/60 pb-3">
            <UserIcon className="h-5 w-5 text-[#787774]" />
            <span>Información Personal</span>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774]">
                Nombre Completo
              </span>
              <span className="font-medium text-[#37352F]">{user?.name || 'No especificado'}</span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774]">
                Correo Electrónico
              </span>
              <span className="font-medium text-[#37352F]">{user?.email || 'No especificado'}</span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774]">
                Identificador de Usuario (ID)
              </span>
              <span className="font-mono text-xs text-[#787774] bg-white/80 p-1.5 rounded-lg border border-neutral-200/80 inline-block mt-1">
                {user?.id || 'Generado automáticamente'}
              </span>
            </div>
          </div>
        </div>

        {/* Security & Access Card */}
        <div className="rounded-2xl border border-white/80 bg-white/60 p-6 shadow-sm backdrop-blur-2xl space-y-4">
          <div className="flex items-center gap-2.5 text-[#37352F] font-semibold text-base border-b border-neutral-200/60 pb-3">
            <ShieldCheckIcon className="h-5 w-5 text-[#787774]" />
            <span>Seguridad & Permisos</span>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774]">
                Rol del Sistema
              </span>
              <span className="font-medium text-[#37352F]">{user?.role === 'ADMIN' ? 'Administrador del Sistema' : 'Usuario Estándar'}</span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774]">
                Estado de la Sesión
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 mt-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Autenticado & Protección CSRF Activa
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774]">
                Método de Autenticación
              </span>
              <span className="font-medium text-[#37352F]">Credenciales JWT & Cookie Segura</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
