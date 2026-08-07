# shadcn-skill-sidebar Specification

## Purpose
TBD - created by archiving change shadcn-skill-sidebar-redesign. Update Purpose after archive.
## Requirements
### Requirement: Strict shadcn UI Component Composition & Semantic Color Tokens
The application navigation components MUST follow strict shadcn/ui skill rules: using semantic CSS color tokens (`bg-sidebar`, `text-sidebar-foreground`), native `Badge` and `Separator` components, and zero hardcoded raw color values.

#### Scenario: Navigating Active Modules in AppSidebar
- **WHEN** user clicks "Ficha Empleados" in `AppSidebar`
- **THEN** route updates to `/workers` and `SidebarMenuButton` highlights with `data-active` semantic state.

#### Scenario: Rendering Version Badge in Sidebar Header
- **WHEN** `AppSidebar` renders
- **THEN** a native shadcn `Badge` component displays the version tag.

