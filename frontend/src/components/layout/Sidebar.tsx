import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { logout } from '../../store/slices/auth.slice';
import authService from '../../services/authService';
import SidebarItem from './SidebarItem';
import {
  HomeIcon,
  ChartBarIcon,
  CreditCardIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

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
      className={`relative flex h-screen flex-col justify-between border-r border-white/80 bg-white/60 backdrop-blur-3xl transition-all duration-300 ease-in-out selection:bg-neutral-200 ${
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
          <SidebarItem to="/home" icon={HomeIcon} label="Inicio" isCollapsed={isCollapsed} />
          <SidebarItem to="/transactions" icon={CreditCardIcon} label="Transacciones" isCollapsed={isCollapsed} />
          <SidebarItem to="/reports" icon={ChartPieIcon} label="Reportes" isCollapsed={isCollapsed} />
          <SidebarItem to="/settings" icon={Cog6ToothIcon} label="Configuración" isCollapsed={isCollapsed} />
        </nav>
      </div>

      {/* Bottom Section: Authenticated User Profile & Logout */}
      <div className="space-y-3 pt-4 border-t border-neutral-200/60">
        {/* User Card */}
        <div
          className={`flex items-center rounded-xl border border-white/80 bg-white/70 shadow-2xs backdrop-blur-md ${
            isCollapsed ? 'justify-center p-2' : 'justify-between p-3'
          }`}
          title={isCollapsed ? `${user?.name || 'Usuario'} (${user?.email || ''})` : undefined}
        >
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'min-w-0'}`}>
            {/* Avatar Circle */}
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#37352F] text-xs font-bold text-white shadow-xs">
              {getInitials(user?.name)}
            </div>

            {/* Name & Email (only when expanded) */}
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="truncate text-xs font-bold text-[#37352F]">
                  {user?.name || 'Usuario'}
                </span>
                <span className="truncate text-[11px] text-[#787774]">
                  {user?.email || 'email@ejemplo.com'}
                </span>
              </div>
            )}
          </div>
        </div>

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
