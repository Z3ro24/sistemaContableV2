# Design: Filtrado de Modales por Empresa Activa Global

## Architecture & Logic

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                             MODAL ACTIVE COMPANY FILTERING                               │
└──────────────────────────────────────────────────────────────────────────────────────────┘
                                             │
                          Redux `state.company.selectedCompanyId`
                                             │
               ┌─────────────────────────────┼─────────────────────────────┐
               ▼                             ▼                             ▼
   `PayrollsPage` Calc Modal         `NoveltiesPage` Modal          `WorkerModal` Form
Worker options filtered by       Worker options filtered by      Default companyId set to
   `selectedCompanyId`               `selectedCompanyId`            `selectedCompanyId`
```

## Code Implementation Details

1. In `PayrollsPage.tsx`:
   ```tsx
   const filteredWorkersForModal = useMemo(() => {
     if (filterCompanyId === "all") return workers;
     return workers.filter((w) => w.companyId === parseInt(filterCompanyId, 10));
   }, [workers, filterCompanyId]);
   ```

2. In `NoveltiesPage.tsx`:
   ```tsx
   const filteredWorkersForModal = useMemo(() => {
     if (filterCompanyId === "all") return workers;
     return workers.filter((w) => w.companyId === parseInt(filterCompanyId, 10));
   }, [workers, filterCompanyId]);
   ```

3. In `WorkerModal.tsx`:
   ```tsx
   const selectedCompanyId = useAppSelector((state) => state.company.selectedCompanyId);
   // Default companyId state to selectedCompanyId if not 'all'
   ```
