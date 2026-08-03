import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, MenuButton, MenuItems, MenuItem, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { logout } from '../../store/slices/auth.slice';
import authService from '../../services/authService';
import SidebarItem from './SidebarItem';
import {
  HomeIcon,
  ChartBarIcon,
  UserGroupIcon,
  BookOpenIcon,
  BriefcaseIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  ChevronUpDownIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  TableCellsIcon,
  BuildingOfficeIcon,
  AdjustmentsHorizontalIcon,
  FolderIcon,
  CalculatorIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  ScaleIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const pathname = location.pathname;

  // Active module checks
  const isHrActive = pathname.startsWith('/payrolls') || pathname.startsWith('/lre') || pathname.startsWith('/hr') || pathname.startsWith('/reports');
  const isAccountingActive = pathname.startsWith('/accounting');
  const isSalesPurchasesActive = pathname.startsWith('/sales-purchases');
  const isSettingsActive = pathname.startsWith('/settings');

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      dispatch(logout());
      navigate('/');
    },
    onError: () => {
      dispatch(logout());
      navigate('/');
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'SC';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <aside
      className={`relative z-40 flex h-screen flex-col justify-between border-r border-white/80 bg-white/60 backdrop-blur-3xl transition-all duration-300 ease-in-out selection:bg-neutral-200 ${
        isCollapsed ? 'w-20 p-3' : 'w-64 p-5'
      }`}
    >
      {/* Top Section: Brand Header & Navigation Items */}
      <div className="space-y-5 overflow-y-auto pr-1">
        {/* Brand Header & Toggle Button */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-3' : 'justify-between'} px-1 py-1`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#37352F] text-white shadow-md shadow-neutral-900/10">
              <ChartBarIcon className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="truncate text-sm font-bold tracking-tight text-[#37352F]">
                  Sistema Contable
                </span>
                <span className="truncate text-[10px] font-medium text-[#787774]">
                  Workspace Pro
                </span>
              </div>
            )}
          </div>

          {/* Collapse Toggle Button */}
          <button
            type="button"
            onClick={toggleCollapse}
            title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-300 bg-white text-[#37352F] shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-[#37352F] hover:text-white hover:border-[#37352F] focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5 stroke-[2.5]" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5 stroke-[2.5]" />
            )}
          </button>
        </div>

        {/* Navigation Tree */}
        <nav className="space-y-1">
          {!isCollapsed && (
            <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
              Menú Principal
            </div>
          )}

          {/* 1. Dashboard / Vista General */}
          <SidebarItem to="/home" icon={HomeIcon} label="Dashboard" isCollapsed={isCollapsed} />

          {/* 2. Recursos Humanos & Sueldos */}
          {isCollapsed ? (
            <Menu as="div" className="relative flex justify-center w-full">
              <MenuButton
                title="Recursos Humanos & Sueldos"
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl border border-transparent transition-all duration-200 ${
                  isHrActive
                    ? 'border-white/80 bg-white/80 text-[#37352F] shadow-2xs backdrop-blur-md'
                    : 'text-[#787774] hover:bg-white/50 hover:text-[#37352F]'
                }`}
              >
                <UserGroupIcon className="h-5 w-5 flex-shrink-0" />
              </MenuButton>

              <MenuItems
                transition
                className="absolute left-full top-0 ml-3 w-64 origin-top-left rounded-2xl border border-white/90 bg-white/95 p-2 shadow-2xl backdrop-blur-2xl transition duration-150 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 focus:outline-none z-50 space-y-0.5"
              >
                <div className="px-3 py-1.5 border-b border-neutral-200/60 mb-1 text-[10px] font-bold uppercase tracking-wider text-[#787774]">
                  RRHH & Sueldos
                </div>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => navigate('/settings/workers')}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        focus ? 'bg-[#37352F] text-white' : 'text-[#37352F] hover:bg-neutral-100'
                      }`}
                    >
                      <UserGroupIcon className="h-4 w-4 flex-shrink-0" />
                      <span>Ficha de Empleados</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => navigate('/hr/novelties')}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        focus ? 'bg-[#37352F] text-white' : 'text-[#37352F] hover:bg-neutral-100'
                      }`}
                    >
                      <AdjustmentsHorizontalIcon className="h-4 w-4 flex-shrink-0" />
                      <span>Novedades del Mes</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => navigate('/payrolls')}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        focus ? 'bg-[#37352F] text-white' : 'text-[#37352F] hover:bg-neutral-100'
                      }`}
                    >
                      <CalculatorIcon className="h-4 w-4 flex-shrink-0" />
                      <span>Procesar Liquidaciones</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => navigate('/payrolls/history')}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        focus ? 'bg-[#37352F] text-white' : 'text-[#37352F] hover:bg-neutral-100'
                      }`}
                    >
                      <DocumentTextIcon className="h-4 w-4 flex-shrink-0" />
                      <span>Histórico de Liquidaciones</span>
                    </button>
                  )}
                </MenuItem>
                <div className="my-1 border-t border-neutral-200/60" />
                <div className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-[#787774]">
                  Archivos y Reportes
                </div>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => navigate('/reports/previred')}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                        focus ? 'bg-[#37352F] text-white' : 'text-[#37352F] hover:bg-neutral-100'
                      }`}
                    >
                      <DocumentTextIcon className="h-4 w-4 flex-shrink-0 text-amber-700" />
                      <span>PreviRed (.txt)</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => navigate('/lre')}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                        focus ? 'bg-[#37352F] text-white' : 'text-[#37352F] hover:bg-neutral-100'
                      }`}
                    >
                      <TableCellsIcon className="h-4 w-4 flex-shrink-0 text-emerald-700" />
                      <span>Libro Remuneraciones LRE (.csv)</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => navigate('/reports/bank-transfers')}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                        focus ? 'bg-[#37352F] text-white' : 'text-[#37352F] hover:bg-neutral-100'
                      }`}
                    >
                      <BanknotesIcon className="h-4 w-4 flex-shrink-0 text-blue-700" />
                      <span>Pago Masivo a Bancos (.txt)</span>
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          ) : (
            <Disclosure defaultOpen={isHrActive}>
              {({ open }) => (
                <div className="space-y-1">
                  <DisclosureButton className="group relative flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-xs font-medium text-[#787774] border border-transparent transition-all duration-200 hover:bg-white/50 hover:text-[#37352F] focus:outline-none">
                    <div className="flex items-center gap-2.5">
                      <UserGroupIcon className="h-4.5 w-4.5 flex-shrink-0 text-[#787774] transition-colors group-hover:text-[#37352F]" />
                      <span>RRHH & Sueldos</span>
                    </div>
                    <ChevronDownIcon
                      className={`h-3.5 w-3.5 text-[#787774] transition-transform duration-200 ${
                        open ? 'rotate-180 transform' : ''
                      }`}
                    />
                  </DisclosureButton>

                  <DisclosurePanel transition className="space-y-0.5 pl-3 transition duration-150 ease-out data-[closed]:opacity-0">
                    <SidebarItem to="/settings/workers" icon={UserGroupIcon} label="Ficha de Empleados" isCollapsed={false} />
                    <SidebarItem to="/hr/novelties" icon={AdjustmentsHorizontalIcon} label="Novedades del Mes" isCollapsed={false} />
                    <SidebarItem to="/payrolls" icon={CalculatorIcon} label="Procesar Liquidaciones" isCollapsed={false} />
                    <SidebarItem to="/payrolls/history" icon={DocumentTextIcon} label="Histórico de Liquidaciones" isCollapsed={false} />

                    {/* Sub-acordeón: Archivos y Reportes */}
                    <Disclosure defaultOpen={pathname.startsWith('/reports') || pathname === '/lre'}>
                      {({ open: reportOpen }) => (
                        <div className="space-y-0.5 pt-0.5">
                          <DisclosureButton className="group flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs font-medium text-[#787774] hover:bg-white/40 hover:text-[#37352F] focus:outline-none">
                            <div className="flex items-center gap-2">
                              <FolderIcon className="h-4 w-4 text-[#787774]" />
                              <span>Archivos y Reportes</span>
                            </div>
                            <ChevronDownIcon
                              className={`h-3 w-3 text-[#787774] transition-transform duration-200 ${
                                reportOpen ? 'rotate-180 transform' : ''
                              }`}
                            />
                          </DisclosureButton>

                          <DisclosurePanel className="space-y-0.5 pl-3">
                            <SidebarItem to="/reports/previred" icon={DocumentTextIcon} label="PreviRed (.txt)" isCollapsed={false} />
                            <SidebarItem to="/lre" icon={TableCellsIcon} label="Libro Remuneraciones LRE (.csv)" isCollapsed={false} />
                            <SidebarItem to="/reports/bank-transfers" icon={BanknotesIcon} label="Pago Masivo a Bancos (.txt)" isCollapsed={false} />
                          </DisclosurePanel>
                        </div>
                      )}
                    </Disclosure>
                  </DisclosurePanel>
                </div>
              )}
            </Disclosure>
          )}

          {/* 3. Contabilidad & Finanzas */}
          {isCollapsed ? (
            <Menu as="div" className="relative flex justify-center w-full">
              <MenuButton
                title="Contabilidad & Finanzas"
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl border border-transparent transition-all duration-200 ${
                  isAccountingActive
                    ? 'border-white/80 bg-white/80 text-[#37352F] shadow-2xs backdrop-blur-md'
                    : 'text-[#787774] hover:bg-white/50 hover:text-[#37352F]'
                }`}
              >
                <BookOpenIcon className="h-5 w-5 flex-shrink-0" />
              </MenuButton>

              <MenuItems
                transition
                className="absolute left-full top-0 ml-3 w-64 origin-top-left rounded-2xl border border-white/90 bg-white/95 p-2 shadow-2xl backdrop-blur-2xl transition duration-150 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 focus:outline-none z-50 space-y-0.5"
              >
                <div className="px-3 py-1.5 border-b border-neutral-200/60 mb-1 text-[10px] font-bold uppercase tracking-wider text-[#787774]">
                  Contabilidad & Finanzas
                </div>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => navigate('/accounting/chart-of-accounts')}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        focus ? 'bg-[#37352F] text-white' : 'text-[#37352F] hover:bg-neutral-100'
                      }`}
                    >
                      <BookOpenIcon className="h-4 w-4 flex-shrink-0" />
                      <span>Plan de Cuentas</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => navigate('/accounting/vouchers')}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        focus ? 'bg-[#37352F] text-white' : 'text-[#37352F] hover:bg-neutral-100'
                      }`}
                    >
                      <DocumentTextIcon className="h-4 w-4 flex-shrink-0" />
                      <span>Comprobantes Contables</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => navigate('/accounting/journal')}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        focus ? 'bg-[#37352F] text-white' : 'text-[#37352F] hover:bg-neutral-100'
                      }`}
                    >
                      <FolderIcon className="h-4 w-4 flex-shrink-0" />
                      <span>Libros Contables</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => navigate('/accounting/balance-8-cols')}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        focus ? 'bg-[#37352F] text-white' : 'text-[#37352F] hover:bg-neutral-100'
                      }`}
                    >
                      <ScaleIcon className="h-4 w-4 flex-shrink-0" />
                      <span>Estados Financieros</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => navigate('/accounting/reconciliation')}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        focus ? 'bg-[#37352F] text-white' : 'text-[#37352F] hover:bg-neutral-100'
                      }`}
                    >
                      <BanknotesIcon className="h-4 w-4 flex-shrink-0" />
                      <span>Conciliación Bancaria</span>
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          ) : (
            <Disclosure defaultOpen={isAccountingActive}>
              {({ open }) => (
                <div className="space-y-1">
                  <DisclosureButton className="group relative flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-xs font-medium text-[#787774] border border-transparent transition-all duration-200 hover:bg-white/50 hover:text-[#37352F] focus:outline-none">
                    <div className="flex items-center gap-2.5">
                      <BookOpenIcon className="h-4.5 w-4.5 flex-shrink-0 text-[#787774] transition-colors group-hover:text-[#37352F]" />
                      <span>Contabilidad & Finanzas</span>
                    </div>
                    <ChevronDownIcon
                      className={`h-3.5 w-3.5 text-[#787774] transition-transform duration-200 ${
                        open ? 'rotate-180 transform' : ''
                      }`}
                    />
                  </DisclosureButton>

                  <DisclosurePanel transition className="space-y-0.5 pl-3 transition duration-150 ease-out data-[closed]:opacity-0">
                    <SidebarItem to="/accounting/chart-of-accounts" icon={BookOpenIcon} label="Plan de Cuentas" isCollapsed={false} />
                    <SidebarItem to="/accounting/vouchers" icon={DocumentTextIcon} label="Comprobantes Contables" isCollapsed={false} />

                    {/* Sub-acordeón: Libros Contables */}
                    <Disclosure defaultOpen={pathname.includes('/journal') || pathname.includes('/ledger') || pathname.includes('/purchases-book') || pathname.includes('/sales-book')}>
                      {({ open: booksOpen }) => (
                        <div className="space-y-0.5 pt-0.5">
                          <DisclosureButton className="group flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs font-medium text-[#787774] hover:bg-white/40 hover:text-[#37352F] focus:outline-none">
                            <div className="flex items-center gap-2">
                              <FolderIcon className="h-4 w-4 text-[#787774]" />
                              <span>Libros Contables</span>
                            </div>
                            <ChevronDownIcon
                              className={`h-3 w-3 text-[#787774] transition-transform duration-200 ${
                                booksOpen ? 'rotate-180 transform' : ''
                              }`}
                            />
                          </DisclosureButton>

                          <DisclosurePanel className="space-y-0.5 pl-3">
                            <SidebarItem to="/accounting/journal" icon={DocumentTextIcon} label="Libro Diario" isCollapsed={false} />
                            <SidebarItem to="/accounting/ledger" icon={DocumentTextIcon} label="Libro Mayor" isCollapsed={false} />
                            <SidebarItem to="/accounting/purchases-book" icon={ReceiptPercentIcon} label="Libro de Compras" isCollapsed={false} />
                            <SidebarItem to="/accounting/sales-book" icon={ReceiptPercentIcon} label="Libro de Ventas" isCollapsed={false} />
                          </DisclosurePanel>
                        </div>
                      )}
                    </Disclosure>

                    {/* Sub-acordeón: Estados Financieros */}
                    <Disclosure defaultOpen={pathname.includes('/balance-8-cols') || pathname.includes('/classified-balance') || pathname.includes('/p-and-l')}>
                      {({ open: finOpen }) => (
                        <div className="space-y-0.5 pt-0.5">
                          <DisclosureButton className="group flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs font-medium text-[#787774] hover:bg-white/40 hover:text-[#37352F] focus:outline-none">
                            <div className="flex items-center gap-2">
                              <ScaleIcon className="h-4 w-4 text-[#787774]" />
                              <span>Estados Financieros</span>
                            </div>
                            <ChevronDownIcon
                              className={`h-3 w-3 text-[#787774] transition-transform duration-200 ${
                                finOpen ? 'rotate-180 transform' : ''
                              }`}
                            />
                          </DisclosureButton>

                          <DisclosurePanel className="space-y-0.5 pl-3">
                            <SidebarItem to="/accounting/balance-8-cols" icon={ScaleIcon} label="Balance de 8 Columnas" isCollapsed={false} />
                            <SidebarItem to="/accounting/classified-balance" icon={ScaleIcon} label="Balance Clasificado" isCollapsed={false} />
                            <SidebarItem to="/accounting/p-and-l" icon={ChartBarIcon} label="Estado de Resultados (P&L)" isCollapsed={false} />
                          </DisclosurePanel>
                        </div>
                      )}
                    </Disclosure>

                    <SidebarItem to="/accounting/reconciliation" icon={BanknotesIcon} label="Conciliación Bancaria" isCollapsed={false} />
                  </DisclosurePanel>
                </div>
              )}
            </Disclosure>
          )}

          {/* 4. Compras y Ventas */}
          {isCollapsed ? (
            <Menu as="div" className="relative flex justify-center w-full">
              <MenuButton
                title="Compras y Ventas"
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl border border-transparent transition-all duration-200 ${
                  isSalesPurchasesActive
                    ? 'border-white/80 bg-white/80 text-[#37352F] shadow-2xs backdrop-blur-md'
                    : 'text-[#787774] hover:bg-white/50 hover:text-[#37352F]'
                }`}
              >
                <BriefcaseIcon className="h-5 w-5 flex-shrink-0" />
              </MenuButton>

              <MenuItems
                transition
                className="absolute left-full top-0 ml-3 w-64 origin-top-left rounded-2xl border border-white/90 bg-white/95 p-2 shadow-2xl backdrop-blur-2xl transition duration-150 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 focus:outline-none z-50 space-y-0.5"
              >
                <div className="px-3 py-1.5 border-b border-neutral-200/60 mb-1 text-[10px] font-bold uppercase tracking-wider text-[#787774]">
                  Compras y Ventas
                </div>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => navigate('/sales-purchases/purchases')}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        focus ? 'bg-[#37352F] text-white' : 'text-[#37352F] hover:bg-neutral-100'
                      }`}
                    >
                      <ReceiptPercentIcon className="h-4 w-4 flex-shrink-0" />
                      <span>Registro de Compras (RCV)</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => navigate('/sales-purchases/sales')}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        focus ? 'bg-[#37352F] text-white' : 'text-[#37352F] hover:bg-neutral-100'
                      }`}
                    >
                      <ReceiptPercentIcon className="h-4 w-4 flex-shrink-0" />
                      <span>Registro de Ventas</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => navigate('/sales-purchases/bhe')}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        focus ? 'bg-[#37352F] text-white' : 'text-[#37352F] hover:bg-neutral-100'
                      }`}
                    >
                      <DocumentTextIcon className="h-4 w-4 flex-shrink-0" />
                      <span>Boletas de Honorarios (BHE)</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => navigate('/sales-purchases/receivables-payables')}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        focus ? 'bg-[#37352F] text-white' : 'text-[#37352F] hover:bg-neutral-100'
                      }`}
                    >
                      <BanknotesIcon className="h-4 w-4 flex-shrink-0" />
                      <span>Cuentas por Cobrar / Pagar</span>
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          ) : (
            <Disclosure defaultOpen={isSalesPurchasesActive}>
              {({ open }) => (
                <div className="space-y-1">
                  <DisclosureButton className="group relative flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-xs font-medium text-[#787774] border border-transparent transition-all duration-200 hover:bg-white/50 hover:text-[#37352F] focus:outline-none">
                    <div className="flex items-center gap-2.5">
                      <BriefcaseIcon className="h-4.5 w-4.5 flex-shrink-0 text-[#787774] transition-colors group-hover:text-[#37352F]" />
                      <span>Compras y Ventas</span>
                    </div>
                    <ChevronDownIcon
                      className={`h-3.5 w-3.5 text-[#787774] transition-transform duration-200 ${
                        open ? 'rotate-180 transform' : ''
                      }`}
                    />
                  </DisclosureButton>

                  <DisclosurePanel transition className="space-y-0.5 pl-3 transition duration-150 ease-out data-[closed]:opacity-0">
                    <SidebarItem to="/sales-purchases/purchases" icon={ReceiptPercentIcon} label="Registro de Compras (RCV)" isCollapsed={false} />
                    <SidebarItem to="/sales-purchases/sales" icon={ReceiptPercentIcon} label="Registro de Ventas" isCollapsed={false} />
                    <SidebarItem to="/sales-purchases/bhe" icon={DocumentTextIcon} label="Boletas de Honorarios (BHE)" isCollapsed={false} />
                    <SidebarItem to="/sales-purchases/receivables-payables" icon={BanknotesIcon} label="Cuentas por Cobrar / Pagar" isCollapsed={false} />
                  </DisclosurePanel>
                </div>
              )}
            </Disclosure>
          )}

          {/* 5. Configuración & Sistema */}
          {isCollapsed ? (
            <Menu as="div" className="relative flex justify-center w-full">
              <MenuButton
                title="Configuración & Sistema"
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl border border-transparent transition-all duration-200 ${
                  isSettingsActive
                    ? 'border-white/80 bg-white/80 text-[#37352F] shadow-2xs backdrop-blur-md'
                    : 'text-[#787774] hover:bg-white/50 hover:text-[#37352F]'
                }`}
              >
                <Cog6ToothIcon className="h-5 w-5 flex-shrink-0" />
              </MenuButton>

              <MenuItems
                transition
                className="absolute left-full top-0 ml-3 w-64 origin-top-left rounded-2xl border border-white/90 bg-white/95 p-2 shadow-2xl backdrop-blur-2xl transition duration-150 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 focus:outline-none z-50 space-y-0.5"
              >
                <div className="px-3 py-1.5 border-b border-neutral-200/60 mb-1 text-[10px] font-bold uppercase tracking-wider text-[#787774]">
                  Configuración & Sistema
                </div>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => navigate('/settings/parameters')}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        focus ? 'bg-[#37352F] text-white' : 'text-[#37352F] hover:bg-neutral-100'
                      }`}
                    >
                      <AdjustmentsHorizontalIcon className="h-4 w-4 flex-shrink-0" />
                      <span>Parámetros Mensuales</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => navigate('/settings/companies')}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        focus ? 'bg-[#37352F] text-white' : 'text-[#37352F] hover:bg-neutral-100'
                      }`}
                    >
                      <BuildingOfficeIcon className="h-4 w-4 flex-shrink-0" />
                      <span>Datos Empresa & Sucursales</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => navigate('/settings/sii-certificate')}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        focus ? 'bg-[#37352F] text-white' : 'text-[#37352F] hover:bg-neutral-100'
                      }`}
                    >
                      <KeyIcon className="h-4 w-4 flex-shrink-0" />
                      <span>Certificado Digital SII</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => navigate('/settings/users')}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        focus ? 'bg-[#37352F] text-white' : 'text-[#37352F] hover:bg-neutral-100'
                      }`}
                    >
                      <UserIcon className="h-4 w-4 flex-shrink-0" />
                      <span>Usuarios & Permisos</span>
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          ) : (
            <Disclosure defaultOpen={isSettingsActive}>
              {({ open }) => (
                <div className="space-y-1">
                  <DisclosureButton className="group relative flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-xs font-medium text-[#787774] border border-transparent transition-all duration-200 hover:bg-white/50 hover:text-[#37352F] focus:outline-none">
                    <div className="flex items-center gap-2.5">
                      <Cog6ToothIcon className="h-4.5 w-4.5 flex-shrink-0 text-[#787774] transition-colors group-hover:text-[#37352F]" />
                      <span>Configuración & Sistema</span>
                    </div>
                    <ChevronDownIcon
                      className={`h-3.5 w-3.5 text-[#787774] transition-transform duration-200 ${
                        open ? 'rotate-180 transform' : ''
                      }`}
                    />
                  </DisclosureButton>

                  <DisclosurePanel transition className="space-y-0.5 pl-3 transition duration-150 ease-out data-[closed]:opacity-0">
                    <SidebarItem to="/settings/parameters" icon={AdjustmentsHorizontalIcon} label="Parámetros Mensuales" isCollapsed={false} />
                    <SidebarItem to="/settings/companies" icon={BuildingOfficeIcon} label="Empresas & Sucursales" isCollapsed={false} />
                    <SidebarItem to="/settings/sii-certificate" icon={KeyIcon} label="Certificado Digital SII" isCollapsed={false} />
                    <SidebarItem to="/settings/users" icon={UserIcon} label="Usuarios & Permisos" isCollapsed={false} />
                  </DisclosurePanel>
                </div>
              )}
            </Disclosure>
          )}
        </nav>
      </div>

      {/* Bottom Section: Authenticated User Profile Dropdown Menu & Logout */}
      <div className="space-y-3 pt-3 border-t border-neutral-200/60">
        {/* User Profile Dropdown Menu */}
        <Menu as="div" className="relative w-full">
          <MenuButton
            title={isCollapsed ? `${user?.name || 'Usuario'} (${user?.email || ''})` : undefined}
            className={`flex w-full items-center rounded-xl border border-white/80 bg-white/70 shadow-2xs backdrop-blur-md transition-all duration-200 hover:border-neutral-300 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-neutral-300 ${
              isCollapsed ? 'justify-center p-2' : 'justify-between p-3'
            }`}
          >
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'min-w-0'}`}>
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#37352F] text-xs font-bold text-white shadow-xs">
                {getInitials(user?.name)}
              </div>

              {!isCollapsed && (
                <div className="flex flex-col text-left min-w-0">
                  <span className="truncate text-xs font-bold text-[#37352F] hover:underline">
                    {user?.name || 'Usuario'}
                  </span>
                  <span className="truncate text-[10px] text-[#787774]">
                    {user?.email || 'email@ejemplo.com'}
                  </span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <ChevronUpDownIcon className="h-4 w-4 text-[#787774] flex-shrink-0 ml-1" />
            )}
          </MenuButton>

          <MenuItems
            transition
            className="absolute bottom-full left-0 mb-2 w-56 origin-bottom-left rounded-2xl border border-white/90 bg-white/90 p-1.5 shadow-xl backdrop-blur-2xl transition duration-150 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 focus:outline-none z-50"
          >
            <div className="px-3 py-2 border-b border-neutral-200/60 mb-1">
              <p className="text-xs font-bold text-[#37352F] truncate">{user?.name}</p>
              <p className="text-[11px] text-[#787774] truncate">{user?.email}</p>
            </div>

            <MenuItem>
              {({ focus }) => (
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    focus ? 'bg-[#37352F] text-white' : 'text-[#37352F]'
                  }`}
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Ver Perfil</span>
                </button>
              )}
            </MenuItem>

            <MenuItem>
              {({ focus }) => (
                <button
                  type="button"
                  onClick={() => navigate('/settings/parameters')}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    focus ? 'bg-[#37352F] text-white' : 'text-[#37352F]'
                  }`}
                >
                  <Cog6ToothIcon className="h-4 w-4" />
                  <span>Configuración</span>
                </button>
              )}
            </MenuItem>

            <div className="my-1 border-t border-neutral-200/60" />

            <MenuItem>
              {({ focus }) => (
                <button
                  type="button"
                  onClick={handleLogout}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    focus ? 'bg-rose-600 text-white' : 'text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          title={isCollapsed ? 'Cerrar Sesión' : undefined}
          className={`flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white text-[#37352F] shadow-2xs backdrop-blur-md transition-all duration-200 hover:bg-[#37352F] hover:text-white hover:border-[#37352F] focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50 ${
            isCollapsed ? 'px-2 py-2' : 'px-3 py-2'
          }`}
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-xs font-medium">{logoutMutation.isPending ? 'Cerrando...' : 'Cerrar Sesión'}</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
