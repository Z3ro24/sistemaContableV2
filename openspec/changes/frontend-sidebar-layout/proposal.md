## Why

Authenticated users currently navigate without a persistent layout or navigation sidebar. Adding a modular `Sidebar` and `SidebarItem` component structure within an `AppLayout` will provide a seamless navigation experience following our Notion Minimalist + Glassmorphic design system, displaying user profile details and providing an accessible logout mechanism.

## What Changes

- Create `SidebarItem` component (`frontend/src/components/layout/SidebarItem.tsx`) for navigation links with active state styling, icons, and hover effects.
- Create `Sidebar` component (`frontend/src/components/layout/Sidebar.tsx`) containing the brand header, navigation list, user profile avatar with name (`user.name`), and logout button.
- Create `AppLayout` (`frontend/src/layouts/AppLayout.tsx`) wrapping authenticated routes with the `Sidebar` and `<Outlet />`.
- Update `frontend/src/navigation/App.tsx` to wrap private routes (`/home`, etc.) inside `AppLayout`.
- Connect logout action to Redux `authSlice` and `authService.logout()`.

## Capabilities

### New Capabilities
- `sidebar-layout`: Persistent authenticated sidebar layout with modular components (`Sidebar`, `SidebarItem`), profile avatar, and logout flow.

### Modified Capabilities

## Impact

- `frontend/src/components/layout/Sidebar.tsx`: New component.
- `frontend/src/components/layout/SidebarItem.tsx`: New component.
- `frontend/src/layouts/AppLayout.tsx`: New layout wrapper.
- `frontend/src/navigation/App.tsx`: Updated routes structure for authenticated users.
