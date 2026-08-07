# Proposal: Diálogos de Confirmación de Borrado con AlertDialog y Toasts en Top-Center

## Why
Native `window.confirm()` dialogs disrupt the user experience, lack accessibility, and clash with the modern shadcn UI design system. Replacing them with the official **`AlertDialog`** component from shadcn/ui ensures accessible, elegant modal confirmations before deleting items across tables (`WorkersPage.tsx`, `PayrollsPage.tsx`, `CompaniesPage.tsx`, `MonthlyParametersPage.tsx`, `NoveltiesPage.tsx`), while standardizing top-center toast notifications using `sonner`.

## What Changes
- **Package & Component Installation**:
  - Install `alert-dialog` via `pnpm dlx shadcn@latest add alert-dialog --yes`.
- **Top-Center Toast Standard**:
  - Ensure `<Toaster position="top-center" richColors closeButton />` is rendered globally in `AppLayout.tsx` and consumed via `toast` from `sonner`.
- **Delete Confirmation with `AlertDialog`**:
  - Integrate `@/components/ui/alert-dialog` for delete operations across all primary table views:
    - **`WorkersPage.tsx`**: Confirmation modal before deleting an employee record.
    - **`PayrollsPage.tsx`**: Confirmation modal before deleting a payroll record.
    - **`CompaniesPage.tsx`**: Confirmation modal before deleting a company/branch record.
    - **`MonthlyParametersPage.tsx`**: Confirmation modal before deleting a monthly parameter period.
    - **`NoveltiesPage.tsx`**: Refactor existing delete modal to official `AlertDialog`.
- **Shadcn Button Integration**:
  - Ensure all delete actions and modal buttons utilize `@/components/ui/button` with `variant="destructive"` or `variant="outline"`.
