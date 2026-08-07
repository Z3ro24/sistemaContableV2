# Delta Spec: Filtrado de Modales por Empresa Activa Global

## ADDED Requirements

### Requirement: Active Company Filter in Payroll Calculation Modal
The worker selection dropdown in the Payroll calculation modal MUST filter workers belonging to the active company selected in Redux.

#### Scenario: Opening Payroll Calculation Modal with an Active Company
- **WHEN** user opens calculation modal while "Empresa SpA" is active in the top Navbar
- **THEN** worker select dropdown only displays workers assigned to "Empresa SpA".

### Requirement: Active Company Filter in Novelties Modal
The worker selection dropdown in the Novelty registration modal MUST filter workers belonging to the active company selected in Redux.

#### Scenario: Registering a Novelty with an Active Company
- **WHEN** user opens Novelty modal while a specific company is active in the top Navbar
- **THEN** worker select dropdown only displays workers assigned to that active company.

### Requirement: Default Company Pre-selection in Worker Modal
The worker creation modal (`WorkerModal.tsx`) MUST automatically pre-select the active company if one is selected in Redux.

#### Scenario: Creating a Worker with an Active Company
- **WHEN** user opens Worker creation modal while a specific company is active
- **THEN** company dropdown in the form defaults to that active company.
