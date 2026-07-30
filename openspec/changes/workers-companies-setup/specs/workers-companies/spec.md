## ADDED Requirements

### Requirement: Prisma Worker and Company Relational Models
The database schema SHALL define Worker and Company relational models with autoincrement primary keys.

#### Scenario: Database schema generation
- **WHEN** Prisma schema is generated
- **THEN** system includes `Worker` (id: Int PK, name, rut, userId FK) and `Company` (id: Int PK, name, rutCompany, workerId FK) tables.

### Requirement: NestJS Workers and Companies Modules
The backend API SHALL include NestJS modules, controllers, and services for Workers and Companies.

#### Scenario: Backend module registration
- **WHEN** backend starts
- **THEN** system registers `WorkersModule` and `CompaniesModule` in `AppModule`.

### Requirement: Accordion Settings Sidebar Sub-Menu
The sidebar SHALL render an accordion sub-menu under Settings containing Workers and Companies items.

#### Scenario: User clicks Settings accordion in sidebar
- **WHEN** user clicks Settings in sidebar
- **THEN** system expands the sub-menu disclosing Workers (`/settings/workers`) and Companies (`/settings/companies`) items.

### Requirement: English WorkersPage and CompaniesPage Views
The frontend SHALL provide English page views for Workers and Companies under protected routes.

#### Scenario: User opens /settings/workers or /settings/companies
- **WHEN** user opens `/settings/workers` or `/settings/companies`
- **THEN** system renders `WorkersPage` or `CompaniesPage` formatted with Notion Glassmorphism.
