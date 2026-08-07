# Design: Rediseño del Navbar al Estilo shadcn UI

## Component Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                             SHADCN NAVBAR ARCHITECTURE                                   │
└──────────────────────────────────────────────────────────────────────────────────────────┘
                                             │
                                   `Navbar.tsx` (Header Bar)
                                             │
               ┌─────────────────────────────┴─────────────────────────────┐
               ▼                                                           ▼
    Active Company Selector                                     User Avatar Menu
   (`DropdownMenu` Primitive)                                 (`DropdownMenu` Primitive)
   - Building2 Icon (Lucide)                                  - User Avatar Badge
   - Dynamic Company Options                                  - User Name & Role
   - RUT Display Badge                                        - Logout Action Button
```

## Primitives & Design Tokens

- **Primitives**:
  - `@radix-ui/react-dropdown-menu` handles menu open/close, focus lock, Esc handling, and ARIA attributes.
  - `button.tsx` handles `variant` (`default`, `outline`, `ghost`, `secondary`) and `size` (`sm`, `md`, `lg`, `icon`).
- **Icons**: `lucide-react` icons (`Building2`, `User`, `ChevronDown`, `Check`, `LogOut`, `Menu`, `Shield`).
- **Styling**: `border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-8 shadow-xs`.
