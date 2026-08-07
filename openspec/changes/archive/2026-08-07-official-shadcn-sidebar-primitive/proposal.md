# Proposal: Primitiva Oficial de Sidebar de shadcn/ui

## Why
While custom sidebar components work, implementing the official **shadcn/ui Sidebar primitive** (`sidebar.tsx` with `SidebarProvider`, `SidebarMenu`, `SidebarMenuButton`, `SidebarRail`) unlocks keyboard shortcuts (`Cmd+B` / `Ctrl+B`), collapsed icon mode tooltips, smooth interactive resizing, and seamless mobile drawer sheet behavior.

## What Changes
- **Package Installation via `pnpm`**:
  - Install `@radix-ui/react-tooltip` for collapsed icon state tooltips.
- **shadcn Tooltip Primitive (`src/components/ui/tooltip.tsx`)**:
  - Create `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` primitives.
- **Official shadcn Sidebar Primitive (`src/components/ui/sidebar.tsx`)**:
  - Create full compound sidebar primitives: `SidebarProvider`, `Sidebar`, `SidebarHeader`, `SidebarContent`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarFooter`, `SidebarRail`, `SidebarTrigger`, `SidebarInset`, `useSidebar`.
- **Navigation Layout Refactoring (`AppSidebar.tsx` & `AppLayout.tsx`)**:
  - Replace custom `Sidebar.tsx` with `AppSidebar.tsx` using `SidebarMenuButton` and Lucide icons for all navigation groups (Inicio, RRHH & Sueldos, Contabilidad, Compras y Ventas, Configuración).
  - Wrap `AppLayout.tsx` with `<SidebarProvider>` and `<SidebarInset>`.
