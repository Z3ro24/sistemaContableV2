## Why

The system requires a complete Chilean payroll calculation module (`Liquidaciones de Sueldo`) and monthly parameter management (`Parámetros Mensuales` - SII/Previred). To calculate pay slips, `Worker` and `Company` entities must be expanded with essential fields (AFP, Health Institution, Contract Type, Bank, Base Salary, Entry Date, Family Dependents, Cost Center, Job Position, Address), and Previred catalog tables must be established.

## What Changes

- **Prisma Schema Update**:
  - Update `Company` with `address` and `digitalCertificateId`.
  - Update `Worker` with `paternalLastName`, `maternalLastName`, `entryDate`, `baseSalary`, `afpId`, `healthInstitutionId`, `healthAgreedUf`, `contractTypeId`, `bankId`, `bankAccountType`, `bankAccountNumber`, `costCenterId`, `jobPositionId`.
  - Add catalog models: `Afp`, `HealthInstitution`, `ContractType`, `Bank`, `CostCenter`, `JobPosition`.
  - Add monthly calculation models: `MonthlyParameter`, `UniqueTaxBracket`, `FamilyAllowanceBracket`.
  - Add payroll operation models: `MonthlyNovelty`, `Payroll`, `PayrollDetail`.
  - Seed catalog tables with standard Chilean Previred data (Habitat, Cuprum, Modelo, Provida, Capital, Planvital, Uno, Fonasa, Isapres, Banks, Contract Types).
- **Backend Modules (NestJS)**:
  - Create `catalogs` module (endpoints to fetch AFPs, Health Institutions, Contract Types, Banks, Cost Centers, Job Positions).
  - Create `monthly-parameters` module (CRUD for monthly UF, UTM, Minimum Wage, Imponibles, Tax Brackets).
  - Create `payrolls` module (Endpoints for monthly novelties entry and automatic Chilean payroll calculation engine).
- **Frontend Updates**:
  - Expand `CompanyModal.tsx` and `EditCompanyPage.tsx` with `address` field and Zod validation.
  - Expand `WorkerModal.tsx` and `EditWorkerPage.tsx` with all missing worker fields using `CustomSelect` (React Select) for AFPs, Health, Contract Types, Banks.
  - Create `MonthlyParametersPage.tsx` (`/settings/parameters`) for managing monthly Previred/SII values.
  - Create `PayrollsPage.tsx` (`/payrolls`) for generating, viewing, and calculating pay slips with full breakdown of taxable income, legal deductions (AFP, Health, AFC, Unique Tax), non-taxable income, and net salary.

## Capabilities

### New Capabilities
- `payroll-and-monthly-parameters`: Complete Chilean payroll calculation engine, monthly parameters management, Previred catalogs, and expanded Worker/Company profiles.

### Modified Capabilities
- `workers-companies-crud-full`: Expanded with comprehensive Chilean labor & banking attributes.

## Impact

- `backend/prisma/schema.prisma`: Added 11 new models and updated `Worker` & `Company`.
- `backend/src/catalogs/*`: Catalog endpoints.
- `backend/src/monthly-parameters/*`: Monthly parameter endpoints.
- `backend/src/payrolls/*`: Calculation engine and endpoints.
- `frontend/src/pages/app/PayrollsPage.tsx`: Pay slip generation & calculation page.
- `frontend/src/pages/app/MonthlyParametersPage.tsx`: Monthly parameters management page.
- `frontend/src/components/modals/WorkerModal.tsx`: Comprehensive worker creation modal.
- `frontend/src/components/modals/CompanyModal.tsx`: Expanded company creation modal.
