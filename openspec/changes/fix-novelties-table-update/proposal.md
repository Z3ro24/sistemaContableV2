# Proposal: Correcciones de Actualización de Tabla de Novedades

## Why
When registering or editing a monthly novelty record in `NoveltyModal`, the table in `NoveltiesPage.tsx` did not immediately reflect the changes due to two issues:
1. `filteredWorkersForModal` was passed as an inline IIFE array instance in JSX, causing `NoveltyModal`'s `useEffect` to re-trigger endlessly and reset state.
2. If the novelty was saved for a specific period, `NoveltiesPage.tsx` did not update `filterPeriod` to match the target period of the saved record or trigger a refetch across `['noveltiesList']`.

## What Changes
- **Fix 1: Stabilize `workers` array reference with `useMemo` in `NoveltiesPage.tsx`**:
  - Extract `filteredWorkersForModal` to a top-level `useMemo` hook so `NoveltyModal` receives a stable reference, preventing unwanted resets.
- **Fix 2: Synchronize period and invalidate query cache on save**:
  - Update `NoveltyModal.tsx` to pass the saved `periodYyyyMm` in `onSuccess(savedPeriod)`.
  - In `NoveltiesPage.tsx`, update `filterPeriod` to `savedPeriod` and invalidate `['noveltiesList']` so the table instantly refetches and displays the new/edited novelty.
