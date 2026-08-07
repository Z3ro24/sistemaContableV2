# Delta Spec: Estado Global de Empresa Activa con Redux Toolkit y Navbar Superior

## ADDED Requirements

### Requirement: Global Active Company State in Redux
The application MUST maintain the currently selected active company in Redux state (`state.company.selectedCompanyId`) with persistence in `localStorage`.

#### Scenario: Selecting an active company in Navbar
- **WHEN** user selects a company in the top Navbar dropdown
- **THEN** Redux state `state.company.selectedCompanyId` updates and persists to `localStorage`.

### Requirement: Top Navbar Component
The application layout (`AppLayout.tsx`) MUST render a top Navbar containing a company selector showing active company name and RUT.

#### Scenario: Creating a new company
- **WHEN** user creates a new company via `CompanyModal.tsx`
- **THEN** Navbar company selector list updates immediately to include the new company.

### Requirement: Global Filtering in RRHH Modules
Modules in RRHH & Sueldos (`PayrollsPage`, `NoveltiesPage`, `WorkersPage`) MUST remove their local company dropdown filters and filter data according to `state.company.selectedCompanyId`.

#### Scenario: Viewing Payrolls with Global Active Company
- **WHEN** user visits `/payrolls` with a company selected in the top Navbar
- **THEN** payrolls list automatically filters for that active company.
