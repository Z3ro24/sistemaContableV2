## Context

We are introducing two key domain models (`Worker` and `Company`) to represent individuals and business entities managed under the system. The frontend requires a nested accordion sub-menu in the sidebar under Settings to navigate to these views seamlessly.

## Goals / Non-Goals

**Goals:**
- Schema: Define `Worker` with autoincrement `id: Int`, `name: String`, `rut: String @unique`, `userId: String` (FK to `User`). Define `Company` with autoincrement `id: Int`, `name: String`, `rutCompany: String @unique`, `workerId: Int` (FK to `Worker`).
- Backend: Generate NestJS `WorkersModule` and `CompaniesModule` using Nest CLI and Prisma client generation.
- Frontend: Implement accordion Disclosure for Settings in `Sidebar.tsx` with sub-items Workers (`/settings/workers`) and Companies (`/settings/companies`).
- Pages: Implement `WorkersPage.tsx` and `CompaniesPage.tsx` in English following Notion Glassmorphism.

**Non-Goals:**
- Complex CRUD form UI forms beyond standard placeholder pages in this initial change step.

## Decisions

1. **Relation Chain: User -> Worker -> Company**
   - *Decision*: User owns Workers, Worker owns Companies.
   - *Rationale*: Fits the domain model where a logged-in user manages worker profiles, who in turn represent or manage business entities.

2. **Headless UI Disclosure for Accordion Sidebar Sub-menu**
   - *Decision*: Wrap Settings sub-items in `@headlessui/react` `Disclosure`, `DisclosureButton`, and `DisclosurePanel`.
   - *Rationale*: Standard accessible accordion sub-menu pattern.

## Risks / Trade-offs

- **[Risk]** Migration sync conflicts. → *Mitigation*: Run `pnpm prisma db push` and `pnpm prisma generate`.
