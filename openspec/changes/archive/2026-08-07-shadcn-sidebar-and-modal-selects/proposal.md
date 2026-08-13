# Proposal: Rediseño de Sidebar y Selects en Modales al Estilo shadcn UI

## Why
Following the successful migration of the Navbar to shadcn UI, the application's navigation sidebar (`Sidebar.tsx`) and form modal dropdown selectors (`WorkerModal.tsx`, `NoveltyModal.tsx`, `BankPayrollModal.tsx`, `PayrollsPage.tsx`, `EditWorkerPage.tsx`) need to be upgraded to matching **shadcn UI** standards. This ensures visual consistency across the design system, improves keyboard accessibility, and introduces mobile-first responsive drawer navigation.

## What Changes
- **Package Installation via `pnpm`**:
  - Install `@radix-ui/react-select` for accessible unstyled select primitives.
- **shadcn Select Component (`src/components/ui/select.tsx`)**:
  - Create standard shadcn `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel` primitives based on Radix UI.
- **Modal Selects Modernization**:
  - Refactor `WorkerModal.tsx`, `NoveltyModal.tsx`, `BankPayrollModal.tsx`, `PayrollsPage.tsx`, and `EditWorkerPage.tsx` to use the new `Select` component.
- **Sidebar Modernization (`Sidebar.tsx` & `AppLayout.tsx`)**:
  - Refactor `Sidebar.tsx` with clean shadcn navigation tokens, module group collapse badges, user profile summary, and logout button.
  - Implement mobile drawer overlay (`isMobileOpen` / `onCloseMobile`) with hamburger toggle connected to `Navbar.tsx` and `AppLayout.tsx`.
