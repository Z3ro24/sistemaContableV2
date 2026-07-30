## Why

The current frontend authentication pages (`LoginPage` and `RegisterPage`) use plain browser HTML styling without a coherent design system, lacks responsive layout components, and missing polished field-level validation and backend error feedback. Upgrading the UI with Tailwind CSS and Headless UI will provide a modern, accessible, and responsive user experience for system authentication.

## What Changes

- Install and configure **Tailwind CSS** and **Headless UI** (`@headlessui/react`) along with `@heroicons/react` or `lucide-react` icons in `frontend`.
- Create reusable UI form controls (`Input`, `Label`, `Button`, `AlertBanner`, `PasswordStrengthMeter`) built with Headless UI primitives and Tailwind CSS.
- Redesign `LoginPage` and `RegisterPage` with a modern split-card responsive layout.
- Enhance field validation feedback with Zod schema messages and real-time error states (borde highlight, helper text with alert icon).
- Add password strength meter on registration page.
- Add accessible backend error alert banner to display API response messages cleanly.

## Capabilities

### New Capabilities
- `frontend-auth-ui`: Modern, accessible, and responsive authentication UI with Tailwind CSS, Headless UI, field validation feedback, and backend error handling.

### Modified Capabilities

## Impact

- `frontend/package.json`: Adds `@headlessui/react`, `@heroicons/react`, `tailwindcss`, `@tailwindcss/vite`, `clsx`, `tailwind-merge`.
- `frontend/src/index.css`: Imports Tailwind CSS design system utilities.
- `frontend/src/pages/auth/LoginPage.tsx`: Updated with new layout, validation UI, and alert banners.
- `frontend/src/pages/auth/RegisterPage.tsx`: Updated with new layout, password strength meter, validation UI, and alert banners.
- `frontend/src/validators/authValidator.ts`: Updated Zod schemas with localized validation rules.
