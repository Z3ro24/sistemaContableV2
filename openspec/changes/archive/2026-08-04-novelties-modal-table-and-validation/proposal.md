# Proposal: Modal de Registro, Validación de Duplicidad y Tabla Paginada en Novedades del Mes

## Why
Users need an intuitive, error-free workflow when recording monthly worker novelties (worked days, sick leave, overtime, bonuses, and deductions). Currently, novelties are entered via a static form on `/hr/novelties` without duplicate record validation, a history table, or edit/delete capabilities. Switching to a modal-based creation form (`NoveltyModal.tsx`), enforcing duplicate record validation for a worker and period `(workerId, periodYyyyMm)`, providing a 10-item paginated table, and offering edit/delete controls will deliver a production-ready, seamless experience.

## What Changes
- **Backend (`backend/src/novelties/`)**:
  - Add `GET /api/v1/novelties/list` endpoint returning all saved `MonthlyNovelty` records belonging to the authenticated user with worker & company relations.
  - Add duplicate validation to `POST /api/v1/novelties`: Throw `BadRequestException` if a record already exists for `(workerId, periodYyyyMm)` when creating a new record (`isEdit: false`).
  - Add `DELETE /api/v1/novelties/:id` endpoint to remove a novelty record by ID.
  - Update `NoveltiesService` with `delete(userId, id)` and `findAll(userId)`.
- **Frontend (`NoveltiesPage.tsx`, `NoveltyModal.tsx`, `noveltiesService.ts`)**:
  - Create `NoveltyModal.tsx` for creating/editing monthly worker novelties.
  - Update `noveltiesService.ts` with `getAll()`, `create()`, `update()`, `delete()`.
  - Refactor `NoveltiesPage.tsx` with:
    - Top action button **"➕ Registrar Novedad del Mes"**.
    - Filter bar (Empresa, Período, Búsqueda por RUT/Nombre).
    - Notion Glass styled table displaying all novelties with 10-item pagination.
    - Fila por fila: Acciones de **✏️ Editar** y **🗑️ Eliminar** (con modal de confirmación).
