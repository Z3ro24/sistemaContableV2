# Proposal: Filtrado de Modales por Empresa Activa Global

## Why
When calculating payrolls in `PayrollsPage.tsx`, registering novelties in `NoveltiesPage.tsx` / `NoveltyModal.tsx`, or adding workers in `WorkerModal.tsx`, the worker options and company defaults should automatically respect the global active company selected in the top Navbar via Redux.

## What Changes
- **Payroll Calculation Modal (`PayrollsPage.tsx`)**:
  - Filter the worker options dropdown so that only workers belonging to the selected active company (`selectedCompanyId`) are displayed when a specific company is active.
- **Novelty Creation Modal (`NoveltiesPage.tsx` & `NoveltyModal.tsx`)**:
  - Filter the worker list passed to `NoveltyModal` according to `selectedCompanyId`.
- **Worker Creation Modal (`WorkerModal.tsx`)**:
  - Automatically pre-select the active company ID in the company selector if a specific company is active in Redux.
