import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const routeNameMap: Record<string, string> = {
  home: 'Inicio',
  profile: 'Mi Perfil',
  settings: 'Configuración',
  transactions: 'Transacciones',
  reports: 'Archivos y Reportes',
  workers: 'Personas / Ficha de Empleados',
  companies: 'Empresas & Sucursales',
  edit: 'Editar',
  payrolls: 'Procesar Liquidaciones',
  parameters: 'Parámetros Mensuales',
  lre: 'Libro de Remuneraciones (LRE)',
  hr: 'RRHH & Sueldos',
  novelties: 'Novedades del Mes',
  history: 'Histórico de Liquidaciones',
  previred: 'PreviRed (.txt)',
  'bank-transfers': 'Pago Masivo a Bancos',
  accounting: 'Contabilidad & Finanzas',
  'chart-of-accounts': 'Plan de Cuentas',
  vouchers: 'Comprobantes Contables',
  journal: 'Libro Diario',
  ledger: 'Libro Mayor',
  'purchases-book': 'Libro de Compras',
  'sales-book': 'Libro de Ventas',
  'balance-8-cols': 'Balance 8 Columnas',
  'classified-balance': 'Balance Clasificado',
  'p-and-l': 'Estado de Resultados (P&L)',
  reconciliation: 'Conciliación Bancaria',
  'sales-purchases': 'Compras y Ventas',
  purchases: 'Registro de Compras (RCV)',
  sales: 'Registro de Ventas',
  bhe: 'Boletas de Honorarios (BHE)',
  'receivables-payables': 'Cuentas por Cobrar / Pagar',
  'sii-certificate': 'Certificado Digital SII',
  users: 'Usuarios & Permisos',
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-[#787774] flex-wrap">
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
