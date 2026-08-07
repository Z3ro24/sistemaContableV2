# Design: Primitiva Oficial de Sidebar de shadcn/ui

## Component Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                   OFFICIAL SHADCN SIDEBAR COMPOUND ARCHITECTURE                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘
                                             │
                                    `<SidebarProvider>`
                                             │
                    ┌────────────────────────┴────────────────────────┐
                    ▼                                                 ▼
             `<AppSidebar />`                                  `<SidebarInset>`
          - `<SidebarHeader>` (Logo)                        - `<Navbar />` (With `<SidebarTrigger />`)
          - `<SidebarContent>`                              - `<main>` Content Container
            - `<SidebarGroup>`                              - `<Breadcrumbs />` & `<Outlet />`
              - `<SidebarGroupLabel>`
              - `<SidebarMenu>`
                - `<SidebarMenuItem>`
                  - `<SidebarMenuButton>`
          - `<SidebarFooter>` (User & Logout)
          - `<SidebarRail>` (Interactive Resizer)
```

## Primitives & Design Tokens

- **Primitives**:
  - `src/components/ui/tooltip.tsx`: `@radix-ui/react-tooltip` integration.
  - `src/components/ui/sidebar.tsx`: `useSidebar()`, `SidebarProvider`, `Sidebar`, `SidebarHeader`, `SidebarContent`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarFooter`, `SidebarRail`, `SidebarTrigger`, `SidebarInset`.
- **Icons**: `lucide-react` icons (`LayoutDashboard`, `Users`, `BookOpen`, `FileSpreadsheet`, `Building2`, `Settings`, `LogOut`, `PanelLeft`, `ChevronRight`).
- **Layout Integration**: `AppLayout.tsx` wraps the entire app in `SidebarProvider`.
