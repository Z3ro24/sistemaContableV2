# sidebar-navigation Specification

## Purpose
TBD - created by archiving change sidebar-navigation-reorganization. Update Purpose after archive.
## Requirements
### Requirement: Structured Domain Sidebar Navigation
The frontend sidebar MUST organize navigation into 5 primary domain categories: Dashboard, RRHH & Sueldos, Contabilidad & Finanzas, Compras y Ventas, and Configuración & Sistema.

#### Scenario: Expanding a domain accordion
- **WHEN** user clicks on any main category accordion in the sidebar
- **THEN** it smoothly expands to reveal all nested sub-modules and secondary sub-accordions.

### Requirement: Placeholder Pages for Future ERP Modules
The router MUST provide clean placeholder views for upcoming modules (such as Plan de Cuentas, Libros Contables, RCV, BHE, Certificado Digital SII) so navigation operates seamlessly.

#### Scenario: Navigating to a placeholder route
- **WHEN** user clicks on a new module link like `/accounting/chart-of-accounts`
- **THEN** the page renders a Notion Glass styled placeholder with domain icon, title, and "Módulo en desarrollo" status.

### Requirement: Breadcrumb Mapping for All Sub-modules
The `Breadcrumbs` component MUST map all nested module routes to human-readable Spanish titles.

#### Scenario: Viewing breadcrumbs on nested route
- **WHEN** user navigates to `/accounting/journal`
- **THEN** breadcrumb displays `Inicio > Contabilidad > Libros Contables > Libro Diario`.

