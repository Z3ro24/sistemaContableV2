# Proposal: Rediseño Estricto del Sidebar Siguiendo las Reglas de shadcn/ui

## Why
Following the installed **shadcn skill** guidelines, the application navigation layout (`AppSidebar.tsx`, `Navbar.tsx`, `AppLayout.tsx`) must strictly adhere to `ui.shadcn.com` principles: using semantic CSS color tokens (`bg-sidebar`, `text-sidebar-foreground`, `bg-sidebar-accent`), composing native shadcn components (`Badge`, `Separator`, `Skeleton`, `cn()`), avoiding raw hardcoded color values, and managing path aliases (`@/components/ui/`) without legacy code artifacts.

## What Changes
- **Package Installation via CLI**:
  - Add official `Badge` component via `pnpm dlx shadcn@latest add badge --yes`.
- **CSS Theme Variables (`src/index.css`)**:
  - Configure semantic CSS variables for Sidebar theming (`--sidebar-background`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-accent`, `--sidebar-[#]`).
- **Strict Component Composition (`AppSidebar.tsx`)**:
  - Refactor `AppSidebar.tsx` to compose native `Badge` for version tag, `Separator` for clean dividers, and `SidebarMenuButton` with Lucide icons.
  - "Ficha Empleados" menu item navigates directly to `/workers`.
- **Navbar & Layout Integration (`Navbar.tsx` & `AppLayout.tsx`)**:
  - Integrate `SidebarTrigger` in `Navbar.tsx`.
  - Wrap app container in `<SidebarProvider>` and `<SidebarInset>` in `AppLayout.tsx`.
