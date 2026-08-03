# Delta Spec: Módulos Explotadores Independientes e Historial de Descargas

## ADDED Requirements

### Requirement: Decoupled Exporter Backend Modules
The backend MUST provide separate NestJS modules for PreviRed, LRE DT, Bank transfers, and Export Logs.

#### Scenario: Exporting PreviRed file
- **WHEN** client sends GET request to `/api/v1/exports/previred`
- **THEN** `PreviredExporterService` generates the 105-column fixed-width file and records an entry in `ExportLog`.

### Requirement: Export Audit History Persistence
The backend MUST record export metadata (timestamp, type, period, record count, total amount, filename) in `ExportLog` whenever a file is generated.

#### Scenario: Querying export history
- **WHEN** client requests GET `/api/v1/exports/history`
- **THEN** backend returns the list of recorded export logs filterable by type and period.

### Requirement: PreviRed Export Option in Payrolls Page
The `PayrollsPage` export dropdown menu MUST include a direct "PreviRed (.TXT)" export option.

#### Scenario: Clicking PreviRed export in Payrolls page
- **WHEN** user selects "PreviRed (.TXT)" in the export menu
- **THEN** system downloads the PreviRed TXT file and logs the export.

### Requirement: Export History View in Report Pages
Report pages (PreviRed, LRE, Bank Transfers) MUST display an interactive Export History table allowing users to view past downloads and re-download files.

#### Scenario: Viewing report history
- **WHEN** user opens `/reports/previred`, `/lre`, or `/reports/bank-transfers`
- **THEN** page displays previous export logs with a "Re-descargar Archivo" button.
