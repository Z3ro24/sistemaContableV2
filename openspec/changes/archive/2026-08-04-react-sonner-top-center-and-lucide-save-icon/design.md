# Design: Integración de React Sonner (Top-Center) e Íconos Lucide Save en Botones de Guardado

## Component Architecture

```
 ┌─────────────────────────────────────────────────────────────────────────────────────────┐
 │                       GLOBAL REACT SONNER & LUCIDE SAVE ICONS                           │
 └─────────────────────────────────────────────────────────────────────────────────────────┘
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    ▼                                                   ▼
       `<Toaster position="top-center" />`                   `import { Save } from 'lucide-react'`
       Rendered in `AppLayout.tsx`                           Rendered inside Save Buttons
                    │                                                   │
   ┌────────────────┼────────────────┬───────────────────┬──────────────┼──────────────────┐
   ▼                ▼                ▼                   ▼              ▼                  ▼
PayrollsPage    WorkersPage    CompaniesPage   ParametersPage   NoveltyModal    EditCompanyPage
(toast.success) (toast.success) (toast.success) (toast.success)  (toast.success) (toast.success)
```

## Toast Position & Configuration

```tsx
// AppLayout.tsx
import { Toaster } from 'sonner';

export const AppLayout = () => {
  return (
    <div>
      <Toaster position="top-center" richColors closeButton />
      {/* ... layout structure ... */}
    </div>
  );
};
```

## Button Design System Pattern

```tsx
import { Save } from 'lucide-react';
import { toast } from 'sonner';

<button
  type="submit"
  disabled={isPending}
  className="flex items-center gap-2 rounded-xl bg-[#37352F] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#201F1C] disabled:opacity-50"
>
  <Save className="h-4 w-4 text-emerald-400" />
  <span>{isPending ? 'Guardando...' : 'Guardar'}</span>
</button>
```
