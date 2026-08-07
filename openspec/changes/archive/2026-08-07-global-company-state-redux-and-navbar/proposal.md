# Proposal: Estado Global de Empresa Activa con Redux Toolkit y Navbar Superior

## Why
Currently, each module (Payrolls, Novelties, Workers, Reports) maintains its own local company filter dropdown. Users have to re-select their target company on every page change. Introducing a global company state with Redux Toolkit and a top Navbar component allows users to select an active company once globally, automatically filtering data across all sub-modules and removing redundant local dropdowns.

## What Changes
- **Redux Store**:
  - Create `company.slice.ts` managing `selectedCompanyId` (persisted in `localStorage`).
  - Register `companyReducer` in `frontend/src/store/store.ts`.
- **Top Navbar Component (`Navbar.tsx`)**:
  - Create `Navbar.tsx` and place it at the top of `AppLayout.tsx`.
  - Display active company label, building icon, and dynamic company dropdown selector powered by `companiesService.getAll()`.
  - Dispatches `setSelectedCompanyId` on user selection.
- **Dynamic Updates on Creation**:
  - When a company is created or edited (`CompanyModal.tsx` or `EditCompanyPage.tsx`), React Query invalidates `['companies']`, immediately updating the Navbar list and allowing selection of newly created companies.
- **Module Cleanups**:
  - Remove local company dropdown filters in `PayrollsPage.tsx`, `NoveltiesPage.tsx`, and `WorkersPage.tsx`, connecting them directly to the global Redux state `state.company.selectedCompanyId`.
