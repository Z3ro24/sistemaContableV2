# Design: Correcciones de Actualización de Tabla de Novedades

## Architecture & Data Flow

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                            NOVELTY MODAL TO NOVELTIES PAGE SYNC                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘
                                             │
                                   `NoveltyModal.tsx`
                         Submit payload (workerId, periodYyyyMm, ...)
                                             │
                             `onSuccess(periodYyyyMm)` Callback
                                             │
                                   `NoveltiesPage.tsx`
                       1. `setFilterPeriod(savedPeriod)`
                       2. `queryClient.invalidateQueries({ queryKey: ['noveltiesList'] })`
                                             │
                                     Table Auto-Refetch
```

## Solution Details

1. In `NoveltiesPage.tsx`:
   ```tsx
   const filteredWorkersForModal = useMemo(() => {
     if (filterCompanyId === 'all') return workers;
     return workers.filter((w) => w.companyId === parseInt(filterCompanyId, 10));
   }, [workers, filterCompanyId]);
   ```

2. In `NoveltiesPage.tsx` `onSuccess`:
   ```tsx
   onSuccess={(savedPeriod) => {
     if (savedPeriod) {
       setFilterPeriod(savedPeriod);
     }
     queryClient.invalidateQueries({ queryKey: ['noveltiesList'] });
     setSuccessMessage(editingNovelty ? 'Novedad actualizada exitosamente' : 'Novedad registrada exitosamente');
     setTimeout(() => setSuccessMessage(null), 3000);
   }}
   ```
