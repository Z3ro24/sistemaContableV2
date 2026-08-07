import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  ChevronDown,
  Check,
  User,
  LogOut,
  Shield,
  Building,
} from 'lucide-react';
import companiesService from '../../services/companiesService';
import authService from '../../services/authService';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { setSelectedCompanyId } from '../../store/slices/company.slice';
import { logout } from '../../store/slices/auth.slice';
import { Button } from '../ui/button';
import { SidebarTrigger } from '../ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';

export interface NavbarProps {
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedCompanyId = useAppSelector((state) => state.company.selectedCompanyId);
  const user = useAppSelector((state) => state.auth.user);

  // Fetch companies for global selector
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: companiesService.getAll,
  });

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

  const selectedCompanyObj = companies.find((c) => c.id.toString() === selectedCompanyId);
  const selectedLabel = selectedCompanyId === 'all'
    ? 'Todas las Empresas'
    : selectedCompanyObj
      ? selectedCompanyObj.name
      : 'Empresa Seleccionada';

  const getUserInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-neutral-200/80 bg-white/80 px-4 sm:px-8 shadow-2xs backdrop-blur-2xl transition-all">
      {/* Left: Sidebar Toggle & Active Company Selector */}
      <div className="flex items-center gap-3">
        <SidebarTrigger />

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#37352F] text-white shadow-xs shrink-0">
          <Building2 className="h-5 w-5 text-amber-400" />
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[11px] font-bold uppercase tracking-wider text-[#787774]">
            Empresa Activa:
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 min-w-[14rem] sm:min-w-[18rem] justify-between text-xs font-semibold"
              >
                <span className="truncate">{selectedLabel}</span>
                <ChevronDown className="h-3.5 w-3.5 text-[#787774] shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72 sm:w-80">
              <DropdownMenuLabel>Seleccionar Empresa</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => dispatch(setSelectedCompanyId('all'))}
                className="justify-between"
              >
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-[#787774]" />
                  <span>Todas las Empresas</span>
                </div>
                {selectedCompanyId === 'all' && (
                  <Check className="h-4 w-4 text-emerald-600" />
                )}
              </DropdownMenuItem>

              {companies.map((comp) => {
                const isSelected = selectedCompanyId === comp.id.toString();
                return (
                  <DropdownMenuItem
                    key={comp.id}
                    onClick={() => dispatch(setSelectedCompanyId(comp.id.toString()))}
                    className="justify-between"
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="font-semibold truncate">{comp.name}</span>
                      <span className="text-[10px] text-[#787774] font-mono">
                        RUT: {comp.rutCompany}
                      </span>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-emerald-600 shrink-0" />}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {selectedCompanyObj && (
          <span className="hidden md:inline-flex items-center rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-200/80 font-mono">
            RUT: {selectedCompanyObj.rutCompany}
          </span>
        )}
      </div>

      {/* Right: Authenticated User Profile Menu */}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 px-2.5 hover:bg-neutral-100/80 rounded-xl gap-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#37352F] text-white font-bold text-xs shadow-xs">
                {getUserInitials(user.name)}
              </div>
              <div className="text-left hidden sm:block">
                <span className="block text-xs font-bold text-[#37352F] leading-none mb-0.5">
                  {user.name}
                </span>
                <span className="block text-[10px] text-[#787774] capitalize font-medium">
                  {user.role || 'Usuario'}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[#787774] hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-bold">Mi Cuenta</DropdownMenuLabel>
            <div className="px-2.5 py-1.5 text-xs border-b border-neutral-200/60 mb-1">
              <span className="block font-semibold text-[#37352F]">{user.name}</span>
              <span className="block text-[10px] text-[#787774] font-mono">{user.email || 'user@sistemacontable.cl'}</span>
            </div>

            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="h-4 w-4 text-[#787774]" />
              <span>Ver Perfil</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => navigate('/settings/parameters')}>
              <Shield className="h-4 w-4 text-[#787774]" />
              <span>Configuración</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => logoutMutation.mutate()}
              className="text-rose-700 focus:bg-rose-600 focus:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
};

export default Navbar;
