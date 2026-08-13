# notifications Specification

## Purpose
TBD - created by archiving change react-sonner-top-center-and-lucide-save-icon. Update Purpose after archive.
## Requirements
### Requirement: Top-Center React Sonner Toast Notifications
The application MUST provide top-center rich-color toast notifications via `sonner` for all save and mutation operations.

#### Scenario: Successful save operation
- **WHEN** user saves a worker, company, monthly parameter, payroll, or novelty
- **THEN** system displays a top-center green success toast message.

#### Scenario: Failed save operation
- **WHEN** a save operation fails due to validation or server error
- **THEN** system displays a top-center red error toast message with the error details.

### Requirement: Lucide Save Icon on Save Buttons
All save buttons across forms MUST display the Lucide `Save` icon alongside the button text.

#### Scenario: Viewing a save button
- **WHEN** user views any form submit/save button in Payrolls, Workers, Companies, Monthly Parameters, or Novelties
- **THEN** button displays the Lucide `Save` icon.

