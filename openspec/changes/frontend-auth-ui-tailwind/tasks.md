## 1. Setup & Dependencies

- [x] 1.1 Install `@headlessui/react`, `@heroicons/react`, `clsx`, `tailwind-merge` and Tailwind CSS in `frontend` package.
- [x] 1.2 Configure Tailwind CSS directives in `frontend/src/index.css` and Vite plugin in `vite.config.ts`.

## 2. Reusable UI Components & Validation

- [x] 2.1 Update `authValidator.ts` with Spanish error messages and strict password validation rules.
- [x] 2.2 Create `AlertBanner.tsx` component using Headless UI and Heroicons for backend API errors.
- [x] 2.3 Create `PasswordStrengthMeter.tsx` component to calculate and display real-time strength indicators.
- [x] 2.4 Create `FormInput.tsx` component wrapper incorporating Headless UI `Field`, `Label`, `Input`, and error text styling.

## 3. Auth Pages Redesign

- [x] 3.1 Redesign `LoginPage.tsx` with modern split-panel card layout, field validation states, and backend alert banner.
- [x] 3.2 Redesign `RegisterPage.tsx` with modern split-panel card layout, password strength meter, field validation states, and backend alert banner.

## 4. Verification

- [x] 4.1 Run frontend build and verify clean compilation without TypeScript or CSS lint errors.
