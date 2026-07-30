## ADDED Requirements

### Requirement: Sidebar Profile Dropdown Menu
The system SHALL provide a Headless UI dropdown menu when clicking the user profile area in the sidebar.

#### Scenario: User clicks profile card in sidebar
- **WHEN** user clicks on the profile section in the sidebar
- **THEN** system opens a dropdown menu displaying "Ver Perfil", "Configuración", and "Cerrar Sesión" options.

### Requirement: Dedicated ProfilePage View
The system SHALL render a ProfilePage view presenting user account details.

#### Scenario: User navigates to /profile
- **WHEN** user opens the `/profile` route
- **THEN** system displays the `ProfilePage` with user avatar, name, email, role, and account information cards.

### Requirement: Navigation Breadcrumbs
The system SHALL display dynamic navigation breadcrumbs at the top of the main content area.

#### Scenario: User navigates between sections
- **WHEN** user navigates from `/home` to `/profile`
- **THEN** system renders breadcrumbs showing `Inicio / Mi Perfil` with clickable navigation links.
