## Why

Users currently lack a direct profile management page and dynamic navigation breadcrumbs. Adding a Headless UI dropdown menu in the sidebar's user profile section, building a dedicated `ProfilePage`, and introducing a dynamic `Breadcrumbs` component will enhance navigation context and user account management.

## What Changes

- Add a Headless UI `Menu` dropdown in `Sidebar.tsx` at the user profile section with options: **Ver Perfil** (`/profile`), **Configuración** (`/settings`), and **Cerrar Sesión**.
- Create `ProfilePage.tsx` (`frontend/src/pages/app/ProfilePage.tsx`) displaying user profile info, initials avatar, role badge, and account details formatted with Notion Glassmorphism.
- Create `Breadcrumbs.tsx` (`frontend/src/components/common/Breadcrumbs.tsx`) generating route breadcrumbs dynamically based on `useLocation().pathname`.
- Add `Breadcrumbs` rendering to `AppLayout.tsx` top main section.
- Register `/profile` route in `frontend/src/navigation/App.tsx`.

## Capabilities

### New Capabilities
- `profile-breadcrumbs`: User profile dropdown menu in sidebar, dedicated ProfilePage view, and dynamic Breadcrumbs component.

### Modified Capabilities

## Impact

- `frontend/src/components/layout/Sidebar.tsx`: Updated with Headless UI Menu dropdown.
- `frontend/src/components/common/Breadcrumbs.tsx`: New component.
- `frontend/src/pages/app/ProfilePage.tsx`: New page view.
- `frontend/src/layouts/AppLayout.tsx`: Updated to render `Breadcrumbs`.
- `frontend/src/navigation/App.tsx`: Updated with `/profile` route.
