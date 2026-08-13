import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  BookOpen,
  Receipt,
  Sliders,
  TrendingUp,
  FileText,
  CreditCard,
  Building,
  Key,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from '@/components/ui/sidebar';

export const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;

  return (
    <Sidebar collapsible="icon">
      {/* Brand Header */}
      <SidebarHeader className="h-16 justify-center border-b border-neutral-200/80 px-4 py-0">
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#37352F] text-white shadow-2xs">
              <TrendingUp className="size-5 text-amber-400" />
            </div>
            <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
              <span className="truncate text-xs font-bold text-[#37352F] tracking-tight">
                Sistema Contable
              </span>
              <span className="truncate text-[10px] text-muted-foreground font-mono">
                v2.0 Pro
              </span>
            </div>
          </div>

          <Badge
            variant="amber"
            className="group-data-[collapsible=icon]:hidden shrink-0 text-[10px] px-1.5 py-0"
          >
            PRO
          </Badge>
        </div>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="px-2 py-2">
        {/* Principal */}
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname === '/home'}
                onClick={() => navigate('/home')}
                tooltip="Inicio"
              >
                <LayoutDashboard />
                <span>Inicio</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* RRHH & Sueldos */}
        <SidebarGroup>
          <SidebarGroupLabel>RRHH & Sueldos</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname.startsWith('/workers')}
                onClick={() => navigate('/workers')}
                tooltip="Ficha Empleados"
              >
                <Users />
                <span>Ficha Empleados</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname.startsWith('/payrolls')}
                onClick={() => navigate('/payrolls')}
                tooltip="Procesar Sueldos"
              >
                <FileSpreadsheet />
                <span>Procesar Sueldos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname.startsWith('/novelties')}
                onClick={() => navigate('/novelties')}
                tooltip="Novedades del Mes"
              >
                <Receipt />
                <span>Novedades del Mes</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname.startsWith('/lre')}
                onClick={() => navigate('/lre')}
                tooltip="Libro LRE"
              >
                <BookOpen />
                <span>Libro LRE</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Archivos & Exportaciones */}
        <SidebarGroup>
          <SidebarGroupLabel>Archivos & Exportaciones</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname.startsWith('/reports/previred')}
                onClick={() => navigate('/reports/previred')}
                tooltip="PreviRed (.txt)"
              >
                <FileText />
                <span>PreviRed (.txt)</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname.startsWith('/reports/bank-transfers')}
                onClick={() => navigate('/reports/bank-transfers')}
                tooltip="Pago Masivo Bancos"
              >
                <CreditCard />
                <span>Pago Masivo Bancos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Configuración */}
        <SidebarGroup>
          <SidebarGroupLabel>Configuración</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname.startsWith('/settings/parameters')}
                onClick={() => navigate('/settings/parameters')}
                tooltip="Parámetros Mensuales"
              >
                <Sliders />
                <span>Parámetros Mensuales</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname.startsWith('/settings/companies')}
                onClick={() => navigate('/settings/companies')}
                tooltip="Empresas & Sucursales"
              >
                <Building />
                <span>Empresas & Sucursales</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname.startsWith('/settings/sii-certificate')}
                onClick={() => navigate('/settings/sii-certificate')}
                tooltip="Certificado Digital SII"
              >
                <Key />
                <span>Certificado Digital SII</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Interactive Resizing Rail */}
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
