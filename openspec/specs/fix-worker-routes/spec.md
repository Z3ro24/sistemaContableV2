# fix-worker-routes Specification

## Purpose
TBD - created by archiving change fix-worker-edit-route-and-sonner-toast. Update Purpose after archive.
## Requirements
### Requirement: Worker Edit Navigation & Route Resolution
The application MUST resolve worker edit navigation routes for `/workers/:id/edit`, `/workers/edit/:id`, and `/settings/workers/edit/:id` rendering `EditWorkerPage`.

#### Scenario: Clicking edit button in WorkersPage
- **WHEN** user clicks the edit button on a worker row in `WorkersPage`
- **THEN** application navigates to `/workers/:id/edit` and renders `EditWorkerPage`.

### Requirement: Official Sonner Toaster Component
The application MUST render the official shadcn `Toaster` component from `@/components/ui/sonner` positioned at `top-center`.

#### Scenario: Toast Notification Triggers
- **WHEN** a toast notification is dispatched via `toast.success` or `toast.error`
- **THEN** a styled notification banner appears at `top-center` of the viewport.

