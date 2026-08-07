# Design: Diálogos de Confirmación de Borrado con AlertDialog y Toasts en Top-Center

## Component Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                     ALERTDIALOG & SONNER TOAST ARCHITECTURE                              │
└──────────────────────────────────────────────────────────────────────────────────────────┘
                                             │
                                    `<AppLayout />`
                                             │
                   ┌─────────────────────────┴─────────────────────────┐
                   ▼                                                   ▼
     `<Toaster position="top-center" />`                     `<Outlet />` (Pages)
                                                                       │
           ┌──────────────────────┬──────────────────────┬─────────────┴────────┬──────────────────────┐
           ▼                      ▼                      ▼                      ▼                      ▼
    `<WorkersPage />`     `<PayrollsPage />`    `<CompaniesPage />`  `<MonthlyParamsPage />`   `<NoveltiesPage />`
           │                      │                      │                      │                      │
           └──────────────────────┴──────────────────────┼──────────────────────┴──────────────────────┘
                                                         ▼
                                               `<AlertDialog>`
                                            - `<AlertDialogContent>`
                                            - `<AlertDialogHeader>`
                                            - `<AlertDialogTitle>`
                                            - `<AlertDialogDescription>`
                                            - `<AlertDialogFooter>`
                                              - `<AlertDialogCancel>`
                                              - `<AlertDialogAction variant="destructive">`
```

## Primitives & Design Tokens

- **Primitives**:
  - `@/components/ui/alert-dialog.tsx`: `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel`.
  - `@/components/ui/button.tsx`: `Button` with `variant="destructive"` for confirm delete actions.
  - `sonner`: `toast.success()`, `toast.error()`, `toast.info()` at `top-center`.
