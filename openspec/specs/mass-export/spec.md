# mass-export Specification

## Purpose
TBD - created by archiving change mass-payroll-export-menu. Update Purpose after archive.
## Requirements
### Requirement: Company Filtered Mass Export Menu
The liquidations page MUST provide a mass export dropdown menu that respects the currently selected company filter.

#### Scenario: Selecting mass export menu options
- **WHEN** user clicks "Exportar Masivo ▾" in `PayrollsPage`
- **THEN** user can select "PDF Unificado", "Paquete ZIP", or "Nómina Excel / CSV".

### Requirement: Unified Multi-Page PDF Generation
The application MUST allow exporting all filtered liquidations into a single multi-page PDF document.

#### Scenario: Exporting unified PDF
- **WHEN** user selects "PDF Unificado"
- **THEN** a multi-page PDF containing all filtered liquidations is downloaded.

### Requirement: ZIP Package Export
The application MUST allow packaging individual liquidations into a downloadable `.zip` archive.

#### Scenario: Exporting ZIP archive
- **WHEN** user selects "Paquete ZIP"
- **THEN** a ZIP file containing `Liquidacion_[RUT]_[Periodo].pdf` for each worker is downloaded.

### Requirement: Payment CSV Matrix Export
The application MUST allow exporting worker payment details into a CSV file.

#### Scenario: Exporting CSV payment matrix
- **WHEN** user selects "Nómina Excel / CSV"
- **THEN** a `.csv` file with worker banking details and net payable amounts is downloaded.

