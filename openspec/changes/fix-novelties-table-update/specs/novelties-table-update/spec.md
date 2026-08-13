# Delta Spec: Correcciones de Actualización de Tabla de Novedades

## ADDED Requirements

### Requirement: Instant Table Refresh on Novelty Save
When a monthly novelty is created or edited, `NoveltiesPage.tsx` MUST update its table immediately to display the saved novelty record.

#### Scenario: Registering a Novelty for the Active Period
- **WHEN** user submits a new novelty in `NoveltyModal`
- **THEN** table in `NoveltiesPage.tsx` invalidates query cache, syncs filter period, and renders the newly created record.

### Requirement: Stable Worker Options Reference in Novelty Modal
`NoveltiesPage.tsx` MUST supply a stable memoized array reference of workers to `NoveltyModal.tsx` to prevent accidental form state resets.

#### Scenario: Typing inside Novelty Modal form fields
- **WHEN** user types or selects values inside `NoveltyModal`
- **THEN** modal form state remains stable without unexpected resets.
