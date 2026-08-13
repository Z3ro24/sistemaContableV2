# novelties Specification

## Purpose
TBD - created by archiving change simplified-payroll-calc-and-novelties-module. Update Purpose after archive.
## Requirements
### Requirement: Simplified Payroll Calculation Modal
The payroll calculation modal in `PayrollsPage` MUST only require selecting the Worker and Period (YYYY-MM).

#### Scenario: Opening calculation modal
- **WHEN** user clicks "Calcular Liquidación" in `PayrollsPage`
- **THEN** modal shows only Worker selection and Period selection fields.

### Requirement: Monthly Novelties Management Module
The system MUST provide a `NoveltiesModule` and page `/hr/novelties` for entering monthly worker novelties (worked days, sick leave, overtime, bonuses, deductions).

#### Scenario: Saving worker novelties for a period
- **WHEN** user enters overtime and bonus amounts in `/hr/novelties` and clicks Save
- **THEN** system saves the `MonthlyNovelty` record in the database.

### Requirement: Automated Novelty Resolution during Payroll Calculation
The backend `PayrollsService` MUST automatically read saved `MonthlyNovelty` records from database when calculating payrolls.

#### Scenario: Calculating payroll with pre-saved novelties
- **WHEN** user calculates a payroll for a worker and period with pre-saved novelties
- **THEN** payroll calculation incorporates the pre-saved overtime and bonus amounts from the database.

### Requirement: Duplicate Novelty Record Validation
The system MUST validate that only one novelty record exists per worker and period `(workerId, periodYyyyMm)`.

#### Scenario: Attempting to create duplicate novelty for worker in period
- **WHEN** user tries to create a new novelty for a worker and period that already has a novelty recorded
- **THEN** system blocks insertion and returns a 400 Bad Request error stating that a novelty already exists for that period.

### Requirement: Novelties Modal Form
The system MUST provide a modal component (`NoveltyModal.tsx`) for creating and editing monthly worker novelties.

#### Scenario: Opening novelty creation modal
- **WHEN** user clicks "Registrar Novedad del Mes"
- **THEN** modal opens allowing worker selection and input of monthly attendance, overtime, bonuses, and deductions.

### Requirement: Paginated Novelties Table with Edit & Delete Actions
The `NoveltiesPage` MUST render an interactive table listing recorded novelties with 10-item pagination and edit/delete controls.

#### Scenario: Viewing paginated novelties table
- **WHEN** user visits `/hr/novelties`
- **THEN** page displays recorded novelties paginated by 10 items per page with "Editar" and "Eliminar" action buttons on each row.

