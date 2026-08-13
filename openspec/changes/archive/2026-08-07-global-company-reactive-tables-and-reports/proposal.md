# Proposal: Actualización Reactiva de Tablas y Reportes al Cambiar Empresa en Navbar

## Why
When the active company is changed in the top Navbar, all active data tables and export pages (`PayrollsPage`, `NoveltiesPage`, `WorkersPage`, `LrePage`, `PreviredPage`, `BankTransfersPage`) must reactively update, re-render, and reset pagination to page 1. Additionally, residual local company dropdowns in report pages must be removed to ensure 100% global context consistency.

## What Changes
- **Report Pages Connection (`LrePage`, `PreviredPage`, `BankTransfersPage`)**:
  - Connect `selectedCompanyId` from Redux state (`state.company.selectedCompanyId`).
  - Remove local company dropdown controls and local states from these pages.
- **Reactive Re-render & Pagination Reset**:
  - Connect React Query keys to Redux `selectedCompanyId` so that changing active company in Navbar triggers automatic data refetch and re-render only for the current active view.
  - Reset table pagination (`currentPage = 1`) whenever `selectedCompanyId` changes.
