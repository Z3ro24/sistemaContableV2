# official-shadcn-sidebar Specification

## Purpose
TBD - created by archiving change official-shadcn-sidebar-primitive. Update Purpose after archive.
## Requirements
### Requirement: Official shadcn UI Sidebar Primitives
The application MUST provide official shadcn UI `Sidebar` compound component primitives (`sidebar.tsx` and `tooltip.tsx`) supporting icon collapsible states, keyboard shortcuts (`Cmd+B` / `Ctrl+B`), and tooltips.

#### Scenario: Toggling Sidebar Collapse with Keyboard Shortcut
- **WHEN** user presses `Cmd+B` or `Ctrl+B`
- **THEN** `Sidebar` toggles between expanded state and icon-collapsed state.

#### Scenario: Hovering Over Collapsed Sidebar Menu Items
- **WHEN** `Sidebar` is in icon-collapsed mode and user hovers over a menu item
- **THEN** a shadcn `Tooltip` appears displaying the module label.

### Requirement: AppSidebar Component Integration
The application MUST replace legacy sidebar styling with `AppSidebar.tsx` using `SidebarMenuButton` and Lucide icons for all navigation items.

#### Scenario: Navigating Active Modules
- **WHEN** user clicks a `SidebarMenuButton` navigation item
- **THEN** route changes to target path and `SidebarMenuButton` renders with active highlight state.

