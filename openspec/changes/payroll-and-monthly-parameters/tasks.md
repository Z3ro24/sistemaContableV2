## 1. Schema & Database Setup

- [x] 1.1 Update `backend/prisma/schema.prisma` with `Afp`, `HealthInstitution`, `ContractType`, `Bank`, `CostCenter`, `JobPosition`, `MonthlyParameter`, `UniqueTaxBracket`, `FamilyAllowanceBracket`, `MonthlyNovelty`, `Payroll`, `PayrollDetail` and update `Worker` & `Company`.
- [x] 1.2 Run `pnpm exec prisma generate` and `pnpm exec prisma db push`.
- [x] 1.3 Create database seed script `backend/prisma/seed.ts` for Chilean Previred catalog data.

## 2. Backend Modules & Calculation Engine

- [x] 2.1 Implement `CatalogsModule`, `CatalogsService`, `CatalogsController`.
- [x] 2.2 Implement `MonthlyParametersModule`, `MonthlyParametersService`, `MonthlyParametersController`.
- [x] 2.3 Implement `PayrollsModule`, `PayrollsService`, `PayrollsController` with calculation engine for Chilean pay slips.
- [x] 2.4 Update `WorkersModule` & `CompaniesModule` DTOs and services for expanded fields.

## 3. Frontend Services & Form Modals

- [x] 3.1 Create `catalogsService.ts`, `monthlyParametersService.ts`, `payrollsService.ts`.
- [x] 3.2 Update `CompanyModal.tsx`, `EditCompanyPage.tsx`, `WorkerModal.tsx`, `EditWorkerPage.tsx` with expanded fields and Zod validation.

## 4. Frontend Pages & Navigation

- [x] 4.1 Create `MonthlyParametersPage.tsx` (`/settings/parameters`).
- [x] 4.2 Create `PayrollsPage.tsx` (`/payrolls`) for generating and calculating pay slips.
- [x] 4.3 Update navigation routes in `App.tsx`, `Sidebar.tsx`, and `Breadcrumbs.tsx`.

## 5. Verification

- [x] 5.1 Run backend build and frontend build to verify clean compilation.
