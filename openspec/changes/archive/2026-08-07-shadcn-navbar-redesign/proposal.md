# Proposal: Rediseño del Navbar al Estilo shadcn UI

## Why
The application currently uses custom Tailwind styling with legacy icon buttons for the top navigation header. Transforming the Navbar component (`Navbar.tsx`) into a modern **shadcn UI** component design elevates visual polish, enhances keyboard accessibility, improves mobile responsiveness, and introduces an interactive user avatar dropdown menu.

## What Changes
- **Package Installation via `pnpm`**:
  - Install `@radix-ui/react-dropdown-menu`, `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge`, and `lucide-react`.
- **shadcn Utilities & Primitives (`frontend/src/components/ui/`)**:
  - `src/lib/utils.ts`: `cn()` helper function combining `clsx` and `tailwind-merge`.
  - `src/components/ui/button.tsx`: shadcn `Button` primitive component.
  - `src/components/ui/dropdown-menu.tsx`: shadcn `DropdownMenu` primitive based on Radix UI.
- **Navbar Component Modernization (`Navbar.tsx`)**:
  - Re-style header bar with clean border, backdrop-blur, and typography tokens.
  - Add active company selector dropdown styled with shadcn aesthetics and Lucide icons.
  - Add interactive user menu dropdown featuring avatar initials, user name, role badge, and logout action.
  - Integrate responsive mobile menu toggle button for small viewports.
