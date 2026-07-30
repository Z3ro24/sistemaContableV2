## Why

Users need to quickly search, filter, and paginate through records in both `WorkersPage` and `CompaniesPage`. Adding search inputs (by name or RUT), company filter selects, and a 10-record-per-page pagination control improves data scannability and performance.

## What Changes

- Add a dynamic search input and company dropdown filter in `WorkersPage.tsx` filtering by name, RUT, and assigned company.
- Add a dynamic search input in `CompaniesPage.tsx` filtering by company name or RUT.
- Implement reusable client-side pagination displaying max 10 records per page with page indicator and `[Anterior]` / `[Siguiente]` controls.
- Automatically reset to page 1 whenever search query or company filter changes.

## Capabilities

### New Capabilities
- `tables-pagination-filters`: Instant search by name and RUT, company filter select, and 10-item pagination controls for Workers and Companies tables.

### Modified Capabilities

## Impact

- `frontend/src/pages/app/WorkersPage.tsx`: Integrated search input, company select filter, and pagination bar.
- `frontend/src/pages/app/CompaniesPage.tsx`: Integrated search input and pagination bar.
