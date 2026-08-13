# Proposal: Integración de React Sonner (Top-Center) e Íconos Lucide Save en Botones de Guardado

## Why
Users need clear, elegant feedback when performing save operations across key modules of the system (Payrolls, Worker Profiles, Monthly Parameters, Companies, and Monthly Novelties). Adding `sonner` notifications positioned at `top-center` with `toast.success` and `toast.error`, along with Lucide's standard `Save` icon on all save buttons, enhances visual clarity and UX consistency.

## What Changes
- **Dependencies**:
  - Install `sonner` and `lucide-react` in `frontend`.
- **Global Toast Container**:
  - Add `<Toaster position="top-center" richColors closeButton />` to `AppLayout.tsx`.
- **Save Buttons & Toast Triggers across Views**:
  - **Ficha de Empleado (`EditWorkerPage.tsx`, `WorkersPage.tsx`)**: Update save button to display Lucide `Save` icon; trigger `toast.success('Trabajador guardado exitosamente')` / `toast.error(msg)`.
  - **Empresas (`EditCompanyPage.tsx`, `CompaniesPage.tsx`)**: Update save button to display Lucide `Save` icon; trigger `toast.success('Empresa guardada exitosamente')` / `toast.error(msg)`.
  - **Parámetros Mensuales (`MonthlyParametersPage.tsx`)**: Update save button to display Lucide `Save` icon; trigger `toast.success('Parámetros mensuales guardados exitosamente')` / `toast.error(msg)`.
  - **Liquidaciones (`PayrollsPage.tsx`)**: Update calculate/save button to display Lucide `Save` icon; trigger `toast.success('Liquidación calculada y guardada exitosamente')` / `toast.error(msg)`.
  - **Novedades del Mes (`NoveltyModal.tsx`)**: Update save button to display Lucide `Save` icon; trigger `toast.success(...)` / `toast.error(...)`.
