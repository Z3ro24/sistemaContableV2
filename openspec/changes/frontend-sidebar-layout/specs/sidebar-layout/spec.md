## ADDED Requirements

### Requirement: Authenticated AppLayout with Sidebar
The system SHALL provide an authenticated layout containing a persistent left sidebar and a main content outlet.

#### Scenario: Authenticated user views private page
- **WHEN** user is logged in and visits a protected route like `/home`
- **THEN** system renders the `AppLayout` with `Sidebar` on the left and the route content on the right.

### Requirement: Modular SidebarItem Component
The system SHALL render individual navigation items with active route highlighting, icon, and hover states.

#### Scenario: User clicks a sidebar item
- **WHEN** user clicks on a `SidebarItem`
- **THEN** system navigates to the target route and applies the active glassmorphic highlight style to that item.

### Requirement: User Profile and Logout Footer
The system SHALL display the authenticated user's name and a logout button at the bottom of the sidebar.

#### Scenario: User clicks logout button
- **WHEN** user clicks the logout button in the sidebar footer
- **THEN** system clears credentials from Redux, calls the logout API service, and redirects to the login page.
