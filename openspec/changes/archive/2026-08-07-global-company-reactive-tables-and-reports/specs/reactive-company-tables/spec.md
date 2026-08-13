# Delta Spec: Actualización Reactiva de Tablas y Reportes al Cambiar Empresa en Navbar

## ADDED Requirements

### Requirement: Reactive Table Update on Active Company Change
When the user changes the active company in the top Navbar, the table and query data of the active page MUST automatically update and re-render.

#### Scenario: Changing active company while viewing Payrolls or Novelties
- **WHEN** user selects a new active company in the top Navbar while viewing `/payrolls` or `/hr/novelties`
- **THEN** page table refetches and re-renders data for the selected company and resets pagination to page 1.

### Requirement: Removal of Local Company Filters in Report Pages
The report pages (`LrePage`, `PreviredPage`, `BankTransfersPage`) MUST remove their local company dropdowns and filter report data using Redux `state.company.selectedCompanyId`.

#### Scenario: Generating LRE report with active company
- **WHEN** user views `/lre` with an active company selected in Navbar
- **THEN** LRE report automatically calculates for the selected active company.
