## Why

The accounting system requires managing workers (persons) and companies, establishing a relational model linking Users -> Workers -> Companies. Additionally, the sidebar needs an expandable accordion under Settings to navigate directly to Workers and Companies pages.

## What Changes

- Update `backend/prisma/schema.prisma` with `Worker` (id: autoincrement int, name, rut, userId) and `Company` (id: autoincrement int, name, rutCompany, workerId) models.
- Generate NestJS modules for `Workers` and `Companies` using Nest CLI commands (`nest g module`, `controller`, `service`).
- Run `pnpm prisma generate` and `pnpm prisma db push` to sync database schema.
- Convert Settings item in `Sidebar.tsx` into an expandable Accordion sub-menu with sub-items for **Workers** (`/settings/workers`) and **Companies** (`/settings/companies`).
- Create `WorkersPage.tsx` and `CompaniesPage.tsx` page views in English in `frontend/src/pages/app/`.
- Register `/settings/workers` and `/settings/companies` routes in `frontend/src/navigation/App.tsx`.

## Capabilities

### New Capabilities
- `workers-companies`: Relational Worker and Company backend models, NestJS resource modules, accordion Settings sidebar sub-menu, and English frontend page views.

### Modified Capabilities

## Impact

- `backend/prisma/schema.prisma`: Added `Worker` and `Company` models.
- `backend/src/workers/`: New NestJS module.
- `backend/src/companies/`: New NestJS module.
- `frontend/src/components/layout/Sidebar.tsx`: Accordion Disclosure sub-menu.
- `frontend/src/pages/app/WorkersPage.tsx`: New frontend view.
- `frontend/src/pages/app/CompaniesPage.tsx`: New frontend view.
- `frontend/src/navigation/App.tsx`: Updated routes.
