## 1. Backend Prisma Schema & NestJS Modules

- [x] 1.1 Add `Worker` and `Company` models to `backend/prisma/schema.prisma`.
- [x] 1.2 Generate NestJS resources using `nest g res workers --no-spec` and `nest g res companies --no-spec` in `backend`.
- [x] 1.3 Run `pnpm prisma generate` and `pnpm prisma db push` in `backend`.

## 2. Frontend Accordion Sidebar & Pages

- [x] 2.1 Update `Sidebar.tsx` with an accordion Disclosure sub-menu for Settings containing Workers and Companies links.
- [x] 2.2 Create `WorkersPage.tsx` and `CompaniesPage.tsx` page views in English in `frontend/src/pages/app/`.
- [x] 2.3 Register `/settings/workers` and `/settings/companies` routes in `frontend/src/navigation/App.tsx`.

## 3. Verification

- [x] 3.1 Run backend build and frontend build to verify clean compilation.
