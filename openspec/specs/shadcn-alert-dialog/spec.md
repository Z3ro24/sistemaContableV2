# shadcn-alert-dialog Specification

## Purpose
TBD - created by archiving change shadcn-alert-dialog-and-toast-redesign. Update Purpose after archive.
## Requirements
### Requirement: AlertDialog Modal for Table Deletions
The application MUST display a shadcn `AlertDialog` confirmation modal before deleting items across table views (`WorkersPage`, `PayrollsPage`, `CompaniesPage`, `MonthlyParametersPage`, `NoveltiesPage`), replacing browser-native `window.confirm`.

#### Scenario: User clicks delete button on an employee row
- **WHEN** user clicks delete icon in `WorkersPage`
- **THEN** an `AlertDialog` opens asking for confirmation to delete the employee record.

#### Scenario: User confirms deletion in AlertDialog
- **WHEN** user clicks "Eliminar" in `AlertDialog`
- **THEN** item is deleted, modal closes, and a success toast notification appears in `top-center`.

