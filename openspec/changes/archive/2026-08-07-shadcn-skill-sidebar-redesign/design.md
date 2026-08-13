# Design: Rediseño Estricto del Sidebar Siguiendo las Reglas de shadcn/ui

## Component Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                     STRICT SHADCN SKILL COMPOSITION ARCHITECTURE                         │
└──────────────────────────────────────────────────────────────────────────────────────────┘
                                             │
                                    `<SidebarProvider>`
                                             │
                    ┌────────────────────────┴────────────────────────┐
                    ▼                                                 ▼
             `<AppSidebar />`                                  `<SidebarInset>`
          - Uses `@/components/ui/badge`                     - `<Navbar />` (With `<SidebarTrigger />`)
          - Uses `@/components/ui/separator`                 - `<main>` Content Container
          - Uses `@/components/ui/sidebar`                   - `<Breadcrumbs />` & `<Outlet />`
          - Semantic tokens (`bg-sidebar`, `text-sidebar`)
```

## Primitives & Design Tokens

- **Semantic Variables (`src/index.css`)**:
  - `--sidebar-background`: `hsl(0 0% 98%)`
  - `--sidebar-foreground`: `hsl(240 5.3% 26.1%)`
  - `--sidebar-primary`: `hsl(240 5.9% 10%)`
  - `--sidebar-accent`: `hsl(240 4.8% 95.9%)`
  - `--sidebar-border`: `hsl(240 5.9% 90%)`
- **Primitives**:
  - `@/components/ui/badge.tsx` (generated via shadcn CLI).
  - `@/components/ui/separator.tsx`.
  - `@/components/ui/sidebar.tsx`.
