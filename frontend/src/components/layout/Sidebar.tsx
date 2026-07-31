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
  BanknotesIcon,
  AdjustmentsHorizontalIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  ChevronUpDownIcon,
  ChevronDownIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const isSettingsActive = location.pathname.startsWith('/settings');
  const isRemunerationActive = location.pathname.startsWith('/payrolls');

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
      <div className="space-y-6">
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

        {/* Navigation Items */}
        <nav className="space-y-1">
          {!isCollapsed && (
            <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
              Menú Principal
            </div>
          )}

          {/* 1. Dashboard / Inicio */}
          <SidebarItem to="/home" icon={HomeIcon} label="Dashboard" isCollapsed={isCollapsed} />

          {/* 2. Remuneración Accordion Sub-Menu */}
          {isCollapsed ? (
            /* Collapsed State: Popover Menu */
            <Menu as="div" className="relative flex justify-center w-full">
              <MenuButton
                title="Remuneración"
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl border border-transparent transition-all duration-200 ${
                  isRemunerationActive
                    ? 'border-white/80 bg-white/80 text-[#37352F] shadow-2xs backdrop-blur-md'
                    : 'text-[#787774] hover:bg-white/50 hover:text-[#37352F]'
                }`}
              >
                <BanknotesIcon className="h-5 w-5 flex-shrink-0" />
              </MenuButton>

              <MenuItems
                transition
                className="absolute left-full top-0 ml-3 w-56 origin-top-left rounded-2xl border border-white/90 bg-white/95 p-2 shadow-2xl backdrop-blur-2xl transition duration-150 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 focus:outline-none z-50"
              >
                <div className="px-3 py-1.5 border-b border-neutral-200/60 mb-1 text-[10px] font-bold uppercase tracking-wider text-[#787774]">
                  Remuneración
                </div>

                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => navigate('/payrolls')}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        focus ? 'bg-[#37352F] text-white' : 'text-[#37352F] hover:bg-neutral-100'
                      }`}
                    >
                      <DocumentTextIcon className="h-4 w-4 flex-shrink-0" />
                      <span>Liquidación de Sueldo</span>
                    </button>
                  )}
                </MenuItem>

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
                      <span>Fichas de empleado</span>
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          ) : (
            /* Expanded State: Standard Disclosure Accordion */
            <Disclosure defaultOpen={isRemunerationActive}>
              {({ open }) => (
                <div className="space-y-1">
                  <DisclosureButton className="group relative flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#787774] border border-transparent transition-all duration-200 hover:bg-white/50 hover:text-[#37352F] focus:outline-none">
                    <div className="flex items-center gap-3">
                      <BanknotesIcon className="h-5 w-5 flex-shrink-0 text-[#787774] transition-colors group-hover:text-[#37352F]" />
                      <span>Remuneración</span>
                    </div>
                    <ChevronDownIcon
                      className={`h-4 w-4 text-[#787774] transition-transform duration-200 ${
                        open ? 'rotate-180 transform' : ''
                      }`}
                    />
                  </DisclosureButton>

                  <DisclosurePanel transition className="space-y-1 pl-4 transition duration-150 ease-out data-[closed]:opacity-0">
                    <SidebarItem to="/payrolls" icon={DocumentTextIcon} label="Liquidación de Sueldo" isCollapsed={false} />
                    <SidebarItem to="/settings/workers" icon={UserGroupIcon} label="Fichas de empleado" isCollapsed={false} />
                  </DisclosurePanel>
                </div>
              )}
            </Disclosure>
          )}

          {/* 3. Settings Accordion Sub-Menu */}
          {isCollapsed ? (
            /* Collapsed State: Popover Menu for Accordion Items (Elevated z-50 above dashboard) */
            <Menu as="div" className="relative flex justify-center w-full">
              <MenuButton
                title="Configuración"
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
                className="absolute left-full top-0 ml-3 w-56 origin-top-left rounded-2xl border border-white/90 bg-white/95 p-2 shadow-2xl backdrop-blur-2xl transition duration-150 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 focus:outline-none z-50"
              >
                <div className="px-3 py-1.5 border-b border-neutral-200/60 mb-1 text-[10px] font-bold uppercase tracking-wider text-[#787774]">
                  Configuración
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
                      <span>Personas</span>
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
                      <span>Empresas</span>
                    </button>
                  )}
                </MenuItem>

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
              </MenuItems>
            </Menu>
          ) : (
            /* Expanded State: Standard Disclosure Accordion */
            <Disclosure defaultOpen={isSettingsActive}>
              {({ open }) => (
                <div className="space-y-1">
                  <DisclosureButton className="group relative flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#787774] border border-transparent transition-all duration-200 hover:bg-white/50 hover:text-[#37352F] focus:outline-none">
                    <div className="flex items-center gap-3">
                      <Cog6ToothIcon className="h-5 w-5 flex-shrink-0 text-[#787774] transition-colors group-hover:text-[#37352F]" />
                      <span>Configuración</span>
                    </div>
                    <ChevronDownIcon
                      className={`h-4 w-4 text-[#787774] transition-transform duration-200 ${
                        open ? 'rotate-180 transform' : ''
                      }`}
                    />
                  </DisclosureButton>

                  <DisclosurePanel transition className="space-y-1 pl-4 transition duration-150 ease-out data-[closed]:opacity-0">
                    <SidebarItem to="/settings/workers" icon={UserGroupIcon} label="Personas" isCollapsed={false} />
                    <SidebarItem to="/settings/companies" icon={BuildingOfficeIcon} label="Empresas" isCollapsed={false} />
                    <SidebarItem to="/settings/parameters" icon={AdjustmentsHorizontalIcon} label="Parámetros Mensuales" isCollapsed={false} />
                  </DisclosurePanel>
                </div>
              )}
            </Disclosure>
          )}
        </nav>
      </div>

      {/* Bottom Section: Authenticated User Profile Dropdown Menu & Logout */}
      <div className="space-y-3 pt-4 border-t border-neutral-200/60">
        {/* User Profile Dropdown Menu */}
        <Menu as="div" className="relative w-full">
          <MenuButton
            title={isCollapsed ? `${user?.name || 'Usuario'} (${user?.email || ''})` : undefined}
            className={`flex w-full items-center rounded-xl border border-white/80 bg-white/70 shadow-2xs backdrop-blur-md transition-all duration-200 hover:border-neutral-300 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-neutral-300 ${
              isCollapsed ? 'justify-center p-2' : 'justify-between p-3'
            }`}
          >
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'min-w-0'}`}>
              {/* Avatar Circle */}
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#37352F] text-xs font-bold text-white shadow-xs">
                {getInitials(user?.name)}
              </div>

              {/* Name & Email (only when expanded) */}
              {!isCollapsed && (
                <div className="flex flex-col text-left min-w-0">
                  <span className="truncate text-xs font-bold text-[#37352F] hover:underline">
                    {user?.name || 'Usuario'}
                  </span>
                  <span className="truncate text-[11px] text-[#787774]">
                    {user?.email || 'email@ejemplo.com'}
                  </span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <ChevronUpDownIcon className="h-4 w-4 text-[#787774] flex-shrink-0 ml-1" />
            )}
          </MenuButton>

          {/* Dropdown Items (Pops upwards above footer) */}
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
                  onClick={() => navigate('/settings/workers')}
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

        {/* Logout Button (Black & White Notion Style) */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          title={isCollapsed ? 'Cerrar Sesión' : undefined}
          className={`flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white text-[#37352F] shadow-2xs backdrop-blur-md transition-all duration-200 hover:bg-[#37352F] hover:text-white hover:border-[#37352F] focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50 ${
            isCollapsed ? 'px-2 py-2.5' : 'px-3 py-2.5'
          }`}
        >
          <ArrowRightOnRectangleIcon className="h-4.5 w-4.5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-xs font-medium">{logoutMutation.isPending ? 'Cerrando...' : 'Cerrar Sesión'}</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
