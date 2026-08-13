# Proposal: Corrección de Ruta de Edición de Trabajadores, Sonner Toaster y AlertDialog en WorkersPage

## Why
When clicking the edit button for a worker in `WorkersPage.tsx`, navigation failed because the route was registered as `/settings/workers/edit/:id` instead of `/workers/:id/edit`. Additionally, official `sonner` primitive component needs to be generated via shadcn CLI and rendered in `AppLayout.tsx`, and `AlertDialog` in `WorkersPage.tsx` must be triggered smoothly for worker deletions.

## What Changes
- **Ruta de Edición (`App.tsx`)**:
  - Add `/workers/:id/edit` and `/workers/edit/:id` routes pointing to `<EditWorkerPage />` in `App.tsx` alongside `/settings/workers/edit/:id`.
- **Componente Sonner Oficial (`sonner.tsx`)**:
  - Install `sonner` primitive component via `pnpm dlx shadcn@latest add sonner --yes`.
  - Import `<Toaster position="top-center" richColors closeButton />` from `@/components/ui/sonner` in `AppLayout.tsx`.
- **Confirmación de Borrado (`WorkersPage.tsx`)**:
  - Ensure `AlertDialog` opens when clicking the delete icon, and triggers `deleteMutation.mutate(worker.id)` with top-center sonner toast feedback.
