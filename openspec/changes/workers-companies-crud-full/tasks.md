## 1. Schema & RUT Utilities

- [x] 1.1 Update `backend/prisma/schema.prisma` with composite unique indexes `@@unique([rut, userId])` and `@@unique([rutCompany, userId])` and `companyId` relation on `Worker`.
- [x] 1.2 Run `pnpm exec prisma generate` and `pnpm exec prisma db push` in `backend`.
- [x] 1.3 Create `rutUtils.ts` (formatting and Modulo 11 validation) in `frontend/src/utils/rutUtils.ts` and `backend/src/common/rutUtils.ts`.

## 2. Backend CRUD Controllers & Services

- [x] 2.1 Implement `CompaniesService` and `CompaniesController` with full CRUD operations scoped to `@GetUser()`.
- [x] 2.2 Implement `WorkersService` and `WorkersController` with full CRUD operations scoped to `@GetUser()` including company association.

## 3. Frontend API Services & Modals

- [x] 3.1 Create `companiesService.ts` and `workersService.ts` in `frontend/src/services/`.
- [x] 3.2 Create `CompanyModal.tsx` and `WorkerModal.tsx` in `frontend/src/components/modals/`.

## 4. Frontend Pages & Navigation

- [x] 4.1 Update `WorkersPage.tsx` and `CompaniesPage.tsx` with data tables, creation modals, edit links, and deletion actions.
- [x] 4.2 Create `EditWorkerPage.tsx` and `EditCompanyPage.tsx` in `frontend/src/pages/app/`.
- [x] 4.3 Register `/settings/workers/edit/:id` and `/settings/companies/edit/:id` routes in `frontend/src/navigation/App.tsx`.

## 5. Verification

- [x] 5.1 Run backend build and frontend build to verify clean compilation.
