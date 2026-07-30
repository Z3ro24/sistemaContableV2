## ADDED Requirements

### Requirement: Per-User RUT Uniqueness
The system SHALL enforce RUT uniqueness scoped strictly to the authenticated user.

#### Scenario: Two users register the same RUT
- **WHEN** User A registers Worker with RUT `11.111.111-1`
- **AND** User B registers Worker with RUT `11.111.111-1`
- **THEN** both creations succeed without duplicate key errors.

### Requirement: Chilean RUT Validation and Formatting
The system SHALL format RUT inputs to `XX.XXX.XXX-X` format and validate Modulo 11 correctness.

#### Scenario: User enters invalid RUT
- **WHEN** user enters invalid RUT `11.111.111-0`
- **THEN** form displays validation error "El RUT ingresado no es válido".

### Requirement: Company Select Dropdown in Worker Creation Modal
The creation modal for Workers SHALL offer a selection dropdown populated with the user's registered companies.

#### Scenario: User creates worker
- **WHEN** user opens Worker creation modal
- **THEN** dropdown displays user's created companies to select from.

### Requirement: Dedicated Edit Pages
The system SHALL provide dedicated routes and pages for editing Workers and Companies.

#### Scenario: User navigates to edit worker
- **WHEN** user opens `/settings/workers/edit/:id`
- **THEN** system renders `EditWorkerPage` pre-filled with worker data.
