# Delta Spec: Novedades del Mes y Modal de Liquidación Simplificado

## ADDED Requirements

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
