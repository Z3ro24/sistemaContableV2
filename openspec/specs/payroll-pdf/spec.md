# payroll-pdf Specification

## Purpose
TBD - created by archiving change payroll-pdf-modal-and-download. Update Purpose after archive.
## Requirements
### Requirement: Printable Chilean Liquidación de Sueldo Document
The application MUST provide a printable and exportable PDF modal view of any calculated payroll following Dirección del Trabajo (DT Chile) standards.

#### Scenario: Opening PDF modal for a payroll record
- **WHEN** user clicks "Ver / Exportar PDF" on a payroll item in `PayrollsPage`
- **THEN** a modal displays the official Liquidación de Sueldo with company info, worker info, itemized taxables/deductions, net payable in words, and signature lines.

### Requirement: PDF Export & Print Actions
The PDF modal MUST provide "Descargar PDF" and "Imprimir" action buttons.

#### Scenario: Downloading PDF file
- **WHEN** user clicks "Descargar PDF"
- **THEN** a `.pdf` file named `Liquidacion_RUT_YYYY-MM.pdf` is generated and downloaded to the user's browser.

