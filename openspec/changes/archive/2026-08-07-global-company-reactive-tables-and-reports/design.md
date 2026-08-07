# Design: Actualización Reactiva de Tablas y Reportes al Cambiar Empresa en Navbar

## Architecture & Data Flow

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                           REACTIVE COMPANY QUERY INVALIDATION & RE-RENDER                │
└──────────────────────────────────────────────────────────────────────────────────────────┘
                                             │
                                   `Navbar.tsx` (Dropdown)
                                             │
                        `dispatch(setSelectedCompanyId(newId))`
                                             │
                                    Redux State Update
                                             │
               ┌─────────────────────────────┼─────────────────────────────┐
               ▼                             ▼                             ▼
       `PayrollsPage`                  `LrePage`                   `PreviredPage`
  queryKey: ["payrolls", id]      queryKey: ["lreReport", id]     queryKey: ["payrolls", id]
       (Auto-Refetch)                 (Auto-Refetch)               (Auto-Refetch)
```

## Implementation Patterns

- **In Report & Table Pages (`LrePage.tsx`, `PreviredPage.tsx`, `BankTransfersPage.tsx`)**:
  ```tsx
  const selectedCompanyId = useAppSelector((state) => state.company.selectedCompanyId);
  const parsedCompanyId = selectedCompanyId !== 'all' ? parseInt(selectedCompanyId, 10) : undefined;

  const { data, refetch } = useQuery({
    queryKey: ['resourceKey', periodYyyyMm, selectedCompanyId],
    queryFn: () => fetcher(periodYyyyMm, parsedCompanyId),
  });
  ```
