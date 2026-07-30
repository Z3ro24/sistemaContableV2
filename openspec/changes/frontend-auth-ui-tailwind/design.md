## Context

The current authentication UI in `frontend` relies on default browser styling with inline styles. We need to introduce a clean design system using **Tailwind CSS** and **Headless UI** primitives (`@headlessui/react`) to build responsive, accessible, and elegant `LoginPage` and `RegisterPage` components. The UI must handle field-level validation errors (via Zod and React Hook Form) and backend API error responses (via React Query) with clear visual feedback.

## Goals / Non-Goals

**Goals:**
- Integrate Tailwind CSS (v4 / Vite integration) and Headless UI in the frontend package.
- Build reusable form components (`InputField`, `AlertBanner`, `PasswordStrengthMeter`, `SocialButton`, `PrimaryButton`).
- Redesign `LoginPage` and `RegisterPage` into a responsive split-panel card layout.
- Implement real-time field error highlights (red focus rings, icon badges, subtext error messages).
- Add password strength visual indicator on registration.
- Render dismissible and accessible backend error alert banners.

**Non-Goals:**
- Redesigning dashboard/app internal pages (out of scope for this change).
- Modifying backend authentication logic or API endpoints.

## Decisions

1. **Tailwind CSS + Headless UI for UI Primitives**
   - *Decision*: Combine Tailwind CSS for styling with `@headlessui/react` primitives for accessible form controls (`Field`, `Label`, `Input`, `Description`).
   - *Rationale*: Headless UI handles accessibility (aria attributes, focus management) while Tailwind provides total design freedom without heavy opinionated CSS libraries.

2. **Zod Localized Validation & Dynamic Password Strength**
   - *Decision*: Enhance `authValidator.ts` Zod schemas to return Spanish error messages and implement a client-side strength evaluator for registration passwords.
   - *Rationale*: Clear, immediate validation feedback reduces user frustration before submitting form requests.

3. **Centralized Alert Banner Component for Backend Errors**
   - *Decision*: Build a reusable `AlertBanner` component using Heroicons `ExclamationTriangleIcon` that extracts message strings from React Query `isError` mutation states.
   - *Rationale*: Standardizes API error presentation across authentication views.

## Risks / Trade-offs

- **[Risk]** Tailwind v4 setup with Vite may require CSS import configuration adjustments. → *Mitigation*: Configure `@tailwindcss/vite` plugin in `vite.config.ts` and test build cleanly.
- **[Risk]** Over-complicated form components. → *Mitigation*: Keep form controls modular and clean with minimal prop surface.
