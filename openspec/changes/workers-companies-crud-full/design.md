## Context

We need full end-to-end CRUD for Workers and Companies with Chilean tax compliance (RUT formatting and Modulo 11 validation) and strict user isolation.

## Goals / Non-Goals

**Goals:**
- Schema: Change global RUT uniqueness to composite unique `@@unique([rut, userId])` on `Worker` and `@@unique([rutCompany, userId])` on `Company`.
- Relational link: `Worker` optional `companyId Int?` referencing `Company.id` (`onDelete: SetNull`).
- RUT Utilities: `formatRut` formats live inputs as `XX.XXX.XXX-X`. `validateRut` verifies Chilean Modulo 11 check digit.
- Creation: Headless UI `Dialog` modals (`WorkerModal` and `CompanyModal`). `WorkerModal` provides a dropdown selecting user's created companies.
- Edit Pages: Dedicated routes `/settings/workers/edit/:id` (`EditWorkerPage.tsx`) and `/settings/companies/edit/:id` (`EditCompanyPage.tsx`).
- Delete: Soft/Hard deletion with confirmation prompt.

**Non-Goals:**
- Cross-tenant user data sharing.

## Decisions

1. **User-Scoped Composite Unique Index**
   - *Decision*: `@@unique([rut, userId])` and `@@unique([rutCompany, userId])`.
   - *Rationale*: Allows different users to independently manage workers or companies having the same RUT.

2. **RUT Live Formatting**
   - *Decision*: Strip non-alphanumeric characters, pad dots, insert hyphen before verification digit (`K` or `0-9`).
   - *Rationale*: Guarantees standard Chilean display format (`11.111.111-1`).

## Risks / Trade-offs

- **[Risk]** Migration push with existing unique constraints. → *Mitigation*: Run `pnpm exec prisma db push` to recreate indices cleanly.
