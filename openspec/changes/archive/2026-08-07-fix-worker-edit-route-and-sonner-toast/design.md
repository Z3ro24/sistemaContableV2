# Design: Corrección de Ruta de Edición de Trabajadores, Sonner Toaster y AlertDialog en WorkersPage

## Architecture & Integration

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                   WORKER EDIT ROUTE & SONNER TOASTER INTEGRATION                         │
└──────────────────────────────────────────────────────────────────────────────────────────┘
                                             │
                                    `<AppLayout />`
                                             │
                   ┌─────────────────────────┴─────────────────────────┐
                   ▼                                                   ▼
     `<Toaster position="top-center" />`                     `<Outlet />` (Routes)
       (from `@/components/ui/sonner`)                                  │
                                                   ┌───────────────────┴───────────────────┐
                                                   ▼                                       ▼
                                          `<WorkersPage />`                     `<EditWorkerPage />`
                                        - Navigates to `/workers/:id/edit`     - Route `/workers/:id/edit`
                                        - Opens `<AlertDialog>` on delete       - Route `/settings/workers/edit/:id`
```

## Changes
1. **`App.tsx`**: Maps `/workers/:id/edit` to `<EditWorkerPage />`.
2. **`sonner.tsx`**: Official primitive in `@/components/ui/sonner.tsx`.
3. **`WorkersPage.tsx`**: Navigates to `/workers/${worker.id}/edit` and displays `<AlertDialog>`.
