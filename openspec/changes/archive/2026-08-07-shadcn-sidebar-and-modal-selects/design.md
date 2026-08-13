# Design: Rediseño de Sidebar y Selects en Modales al Estilo shadcn UI

## Component Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                   SHADCN SIDEBAR & MODAL SELECTS ARCHITECTURE                            │
└──────────────────────────────────────────────────────────────────────────────────────────┘
                                             │
               ┌─────────────────────────────┴─────────────────────────────┐
               ▼                                                           ▼
     shadcn UI `Sidebar.tsx`                                   shadcn UI `Select` Component
   - Fixed Desktop Sidebar                                   (`src/components/ui/select.tsx`)
   - Slide-out Mobile Drawer Overlay                         - Radix `@radix-ui/react-select`
   - Active Module Highlighting                              - Integrated into WorkerModal,
   - User Profile Footer & Logout Button                     NoveltyModal, BankPayrollModal, etc.
```

## Primitives & Design Tokens

- **Select Primitive (`select.tsx`)**:
  - `@radix-ui/react-select` primitives (`Root`, `Trigger`, `Value`, `Content`, `Viewport`, `Item`, `ItemText`, `ItemIndicator`).
  - Styled with `border border-neutral-200 bg-white/95 text-xs text-[#37352F] shadow-xs hover:bg-neutral-50 focus:ring-2 focus:ring-neutral-400`.
- **Sidebar (`Sidebar.tsx`)**:
  - Accepts `isMobileOpen?: boolean` and `onCloseMobile?: () => void`.
  - Desktop view (`hidden lg:flex`).
  - Mobile view (`fixed inset-0 z-50 flex lg:hidden bg-black/40 backdrop-blur-xs`).
  - `Navbar.tsx` updated with hamburger button for mobile viewports (`lg:hidden`).
