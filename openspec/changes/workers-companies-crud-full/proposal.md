## Why

Users need full CRUD capabilities for managing companies and workers/persons. Creating workers requires assigning them to an existing company created by the user. Chilean RUT formatting (`11.111.111-1`) and Modulo 11 validation must be enforced on both worker and company RUT fields. RUT uniqueness must be scoped per user (`@@unique([rut, userId])` and `@@unique([rutCompany, userId])`), allowing different users to register the same RUT independently.

## What Changes

- Update `backend/prisma/schema.prisma` to scope RUT uniqueness per user (`@@unique([rut, userId])` on `Worker`, `@@unique([rutCompany, userId])` on `Company`) and connect `Worker` to `Company` via `companyId`.
- Add Chilean RUT validation and formatting utilities (`rutUtils.ts`) in both backend and frontend.
- Implement full NestJS REST CRUD controllers, services, DTOs, and Prisma queries for `Workers` and `Companies` authenticated via JWT (`@GetUser()`).
- Implement creation modals in frontend: `WorkerModal.tsx` (with company select dropdown) and `CompanyModal.tsx`.
- Implement edit pages in frontend: `EditWorkerPage.tsx` (`/settings/workers/edit/:id`) and `EditCompanyPage.tsx` (`/settings/companies/edit/:id`).
- Update `WorkersPage.tsx` and `CompaniesPage.tsx` with dynamic data tables, creation modals, edit links, and deletion actions.

## Capabilities

### New Capabilities
- `workers-companies-crud-full`: Full CRUD operations for Workers and Companies with Chilean RUT validation/formatting, user-scoped RUT uniqueness, creation modals, and dedicated edit pages (`EditWorkerPage` & `EditCompanyPage`).

### Modified Capabilities

## Impact

- `backend/prisma/schema.prisma`: Modified unique constraints to composite `[rut, userId]` and `[rutCompany, userId]`, added `companyId` relation.
- `backend/src/workers/`: Full CRUD service and controller.
- `backend/src/companies/`: Full CRUD service and controller.
- `frontend/src/utils/rutUtils.ts`: RUT Chilean validation & live formatting helper.
- `frontend/src/components/modals/WorkerModal.tsx`: Creation modal.
- `frontend/src/components/modals/CompanyModal.tsx`: Creation modal.
- `frontend/src/pages/app/WorkersPage.tsx`: List table view with actions.
- `frontend/src/pages/app/CompaniesPage.tsx`: List table view with actions.
- `frontend/src/pages/app/EditWorkerPage.tsx`: Edit page view.
- `frontend/src/pages/app/EditCompanyPage.tsx`: Edit page view.
- `frontend/src/navigation/App.tsx`: Routes `/settings/workers/edit/:id` and `/settings/companies/edit/:id`.
