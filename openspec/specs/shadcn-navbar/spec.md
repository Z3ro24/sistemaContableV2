# shadcn-navbar Specification

## Purpose
TBD - created by archiving change shadcn-navbar-redesign. Update Purpose after archive.
## Requirements
### Requirement: shadcn UI Navbar Component
The application header (`Navbar.tsx`) MUST render a modern shadcn UI component navbar featuring an active company selector, user profile menu, and mobile layout support.

#### Scenario: Interacting with the User Avatar Menu
- **WHEN** user clicks on their user avatar in the top right of the Navbar
- **THEN** a shadcn `DropdownMenu` opens displaying user details and logout option.

#### Scenario: Selecting Active Company in shadcn Navbar
- **WHEN** user selects a company in the active company dropdown
- **THEN** Redux state `selectedCompanyId` updates and the selected company RUT badge renders.

### Requirement: Installation of Radix & shadcn Primitives
The application MUST install `@radix-ui/react-dropdown-menu`, `@radix-ui/react-slot`, `class-variance-authority`, and `lucide-react` via `pnpm`.

#### Scenario: Building frontend with shadcn primitives
- **WHEN** developer runs `pnpm build`
- **THEN** all Radix and shadcn component primitives compile without errors.

