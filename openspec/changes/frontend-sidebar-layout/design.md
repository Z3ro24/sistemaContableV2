## Context

Authenticated users in the Sistema Contable application require a clean, responsive sidebar for navigation between modules (Inicio/Dashboard, Transacciones, Reportes, Configuración). The sidebar must be modular, adhering to our Notion Minimalist + Ultra-Glassmorphism design system (`bg-white/65 backdrop-blur-3xl border-r border-white/80`), displaying the user's name and an accessible logout option.

## Goals / Non-Goals

**Goals:**
- Implement `SidebarItem` component with active routing detection (`useLocation` / `NavLink`) and Notion glass styling.
- Implement `Sidebar` container component with top brand header, navigation section, and bottom user profile card with avatar initials and logout button.
- Build `AppLayout` wrapper component combining `Sidebar` and `<Outlet />`.
- Connect logout button to Redux `logout` reducer and `authService.logout()` API call.

**Non-Goals:**
- Modifying authentication logic in the backend.

## Decisions

1. **Decoupled `SidebarItem` and `Sidebar` Components**
   - *Decision*: Separate item renderer from container logic.
   - *Rationale*: Allows easy addition of new menu items and clean prop interfaces.

2. **Notion Minimalist Glassmorphism Styling**
   - *Decision*: Apply `bg-white/60 backdrop-blur-3xl border-r border-white/80 shadow-sm` for the sidebar container, and `bg-white/80 border border-white font-semibold text-[#37352F] backdrop-blur-md` for active items.
   - *Rationale*: Maintains visual harmony with `DESIGN.md`.

## Risks / Trade-offs

- **[Risk]** Responsive overflow on smaller viewports. → *Mitigation*: Ensure main content area has `flex-1 overflow-y-auto` and sidebar maintains fixed height `h-screen`.
