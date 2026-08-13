# Proposal: Simplificación de Modal de Liquidación y Módulo de Novedades del Mes

## Why
Currently, when calculating liquidations in `PayrollsPage.tsx`, the user is prompted to enter worker novelties (worked days, overtime, non-taxable allowances, bonuses, and deductions) directly inside the calculation modal. To adhere to standard accounting & HR best practices (separation of concerns), novelties should be managed on a dedicated page (`/hr/novelties`), while the payroll calculation modal in `PayrollsPage.tsx` simplifies to just selecting the **Worker** and **Period (YYYY-MM)**.

## What Changes
- **Backend (`backend/src/novelties/` & `backend/src/payrolls/`)**:
  - Create `NoveltiesModule` (`NoveltiesService`, `NoveltiesController`) providing CRUD endpoints GET/POST `/api/v1/novelties` for `MonthlyNovelty`.
  - Update `PayrollsService.calculateAndSave`: When calculating a payroll without explicit novelties, query existing `MonthlyNovelty` in database for `(workerId, periodYyyyMm)`. If found, use its values; otherwise, fall back to standard defaults (30 worked days, 0 overtime, 0 bonuses).
- **Frontend (`PayrollsPage.tsx`, `NoveltiesPage.tsx`, `noveltiesService.ts`)**:
  - Simplify "Calcular Liquidación" modal in `PayrollsPage.tsx` to 2 fields: Worker and Period YYYY-MM, with an informative note.
  - Create `noveltiesService.ts` in `frontend/src/services/noveltiesService.ts`.
  - Build `NoveltiesPage.tsx` (`/hr/novelties`) with worker/period selector and tabs/forms for:
    - Asistencia & Licencias (días trabajados, licencias médicas, inasistencias).
    - Horas Extras (50% y 100%).
    - Cargas Familiares y Haberes (imponibles y no imponibles).
    - Descuentos Varios (anticipos, préstamos empresa).
  - Mount `NoveltiesPage.tsx` in `App.tsx` on route `/hr/novelties`.
