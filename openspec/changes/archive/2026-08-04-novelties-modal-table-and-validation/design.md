# Design: Modal de Registro, Validación de Duplicidad y Tabla Paginada en Novedades del Mes

## Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                NOVEDADES DEL MES (MODAL & PAGINATED TABLE)                                 │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                FRONTEND                                                    │
│                                                   │                                                        │
│       ┌───────────────────────────────────────────┼───────────────────────────────────────────┐            │
│       ▼                                           ▼                                           ▼            │
│ ➕ Botón Registrar Novedad              📊 Tabla Paginada (10 por pág)              ✏️ Editar / 🗑️ Eliminar│
│ Opens `NoveltyModal.tsx`                Renders `MonthlyNovelty` list               Updates/Deletes record │
└───────────────────────────────────────────────────┬────────────────────────────────────────────────────────┘
                                                    │ REST API
                                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                BACKEND NESTJS                                              │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ `NoveltiesModule`                                                                                          │
│  ├─ GET  /api/v1/novelties/list      -> Returns user novelties with worker relation                        │
│  ├─ POST /api/v1/novelties           -> Validates no existing (workerId, period) before insert             │
│  ├─ PUT  /api/v1/novelties/:id       -> Updates existing record                                            │
│  └─ DELETE /api/v1/novelties/:id     -> Deletes record by ID                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## Backend API Endpoints

1. **`GET /api/v1/novelties/list`**:
   - Query params: `periodYyyyMm?`, `companyId?`, `search?`.
   - Returns list of `MonthlyNovelty` with `worker` (name, rut, company).
2. **`POST /api/v1/novelties`**:
   - Body: `UpsertNoveltyDto`.
   - Validation: Checks `findUnique({ workerId_periodYyyyMm })`. If exists, throws `BadRequestException('Ya existe una novedad registrada para este trabajador en el período seleccionado. Edite la novedad existente desde la tabla.')`.
3. **`PUT /api/v1/novelties/:id`**:
   - Updates `MonthlyNovelty` by ID.
4. **`DELETE /api/v1/novelties/:id`**:
   - Deletes `MonthlyNovelty` by ID.

## Frontend UI Architecture

1. **`NoveltyModal.tsx`**:
   - Controlled modal component.
   - Props: `isOpen`, `onClose`, `initialData?: MonthlyNoveltyData`, `workers: Worker[]`.
   - Form inputs: Worker, Period, Worked days (0-30), Sick leave, Absences, Overtime 50%/100%, Family dependents, Other taxable, Non-taxable, Other deductions.
2. **`NoveltiesPage.tsx`**:
   - Header with **"➕ Registrar Novedad del Mes"** button.
   - Filter bar: Company select, Period YYYY-MM input, Search text input.
   - Notion Glass table displaying novelties with columns:
     - Worker Name & RUT
     - Period
     - Worked Days / Sick Leave
     - Overtime (50% / 100%)
     - Taxable Bonuses
     - Non-Taxable Allowances
     - Deductions
     - Actions: Edit (Pencil), Delete (Trash)
   - Pagination: 10 items per page with Next / Previous page buttons (`Página X de Y`).
   - Confirm Delete Modal dialog.
