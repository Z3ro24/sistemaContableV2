# lre Specification

## Purpose
TBD - created by archiving change lre-module-and-dt-exporter. Update Purpose after archive.
## Requirements
### Requirement: LRE Backend Module and Export Endpoint
The backend MUST provide an `LreModule` with endpoints to retrieve LRE data and export the standardized DT CSV file.

#### Scenario: Requesting LRE report export
- **WHEN** client sends GET request to `/api/v1/lre/export` with `periodYyyyMm` and optional `companyId`
- **THEN** backend generates and returns a CSV file matching DT Chile LRE column specifications.

### Requirement: LRE Navigation and Breadcrumbs
The frontend MUST include an LRE navigation item under Remuneración sub-menu and display proper breadcrumbs.

#### Scenario: Navigating to LRE page
- **WHEN** user navigates to `/payrolls/lre`
- **THEN** the breadcrumb displays `Inicio > Liquidaciones > Libro de Remuneraciones (LRE)`.

### Requirement: LRE Pre-visualization and Summary
The LRE page MUST display summary metrics and a pre-visualization table of worker LRE records before CSV download.

#### Scenario: Viewing LRE summary
- **WHEN** user opens `/payrolls/lre`
- **THEN** page shows total worker records, total taxable income, total legal deductions, total net payable, and a DT pre-visualization table.

