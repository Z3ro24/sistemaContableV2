## Context

Users need to quickly navigate to their profile details from the sidebar and maintain visual orientation across modules via breadcrumbs. The design follows our established Notion Minimalist + Ultra-Glassmorphism system (`DESIGN.md`).

## Goals / Non-Goals

**Goals:**
- Replace or enhance the static sidebar user card with a Headless UI `Menu` dropdown component.
- Build `ProfilePage` showcasing user details (`name`, `email`, `role`, account metadata).
- Build `Breadcrumbs` component parsing current path to friendly Spanish titles (e.g. `Inicio / Mi Perfil`).
- Integrate `Breadcrumbs` inside `AppLayout.tsx`.

**Non-Goals:**
- Backend database schema modifications (profile reads existing Redux user state).

## Decisions

1. **Headless UI Menu for Sidebar User Dropdown**
   - *Decision*: Wrap the user profile footer in `<Menu>` with `<MenuButton>` and `<MenuItems>`.
   - *Rationale*: Guarantees keyboard accessibility and positioning with Notion glass styling (`bg-white/90 backdrop-blur-xl border border-white shadow-xl`).

2. **Dynamic Breadcrumbs mapping**
   - *Decision*: Map path segments (e.g., `/profile` -> `Mi Perfil`, `/settings` -> `Configuración`) with Chevron separators.
   - *Rationale*: Clear, lightweight navigation context.

## Risks / Trade-offs

- **[Risk]** Dropdown menu clipping inside overflow hidden sidebar. → *Mitigation*: Position menu items dropdown upwards/side-popover (`bottom-full mb-2` or `origin-bottom-left`).
