import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const routeNameMap: Record<string, string> = {
  home: 'Inicio',
  profile: 'Mi Perfil',
  settings: 'Configuración',
  transactions: 'Transacciones',
  reports: 'Reportes',
  workers: 'Personas',
  companies: 'Empresas',
  edit: 'Editar',
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-[#787774]">
      {/* Home Root Link */}
      <Link
        to="/home"
        className="flex items-center gap-1 font-medium transition-colors hover:text-[#37352F]"
      >
        <HomeIcon className="h-3.5 w-3.5" />
        <span>Inicio</span>
      </Link>

      {pathnames.map((value, index) => {
        // Skip 'home' segment if we already render Inicio root
        if (value.toLowerCase() === 'home') return null;

        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNameMap[value.toLowerCase()] || value;

        return (
          <React.Fragment key={to}>
            <ChevronRightIcon className="h-3 w-3 text-neutral-400" />
            {isLast ? (
              <span className="font-semibold text-[#37352F]">{displayName}</span>
            ) : (
              <Link to={to} className="font-medium transition-colors hover:text-[#37352F]">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
