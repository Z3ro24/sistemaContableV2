# Delta Spec: Modal de Registro, Validación de Duplicidad y Tabla Paginada en Novedades del Mes

## ADDED Requirements

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
