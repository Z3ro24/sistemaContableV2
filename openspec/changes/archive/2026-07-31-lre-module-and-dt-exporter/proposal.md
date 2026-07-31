# Proposal: Libro de Remuneraciones Electrónico (LRE - DT Chile)

## Why
Employers and accountants in Chile are legally mandated by the Dirección del Trabajo (DT Ex. Res. Nº 39) to submit a monthly Electronic Payroll Book (Libro de Remuneraciones Electrónico - LRE) in a standardized CSV file format via the "Mi DT" portal.

## What Changes
- **Backend (`backend/src/lre/`)**:
  - Add `LreModule`, `LreController`, and `LreService`.
  - Endpoint `GET /api/v1/lre`: Returns LRE summary metrics and pre-formatted worker payroll rows for the period/company.
  - Endpoint `GET /api/v1/lre/export`: Generates and downloads the standardized CSV file formatted per DT Chile specifications.
  - Add unit test suites (`lre.service.spec.ts`, `lre.controller.spec.ts`).
- **Frontend Navigation & Page (`LrePage.tsx`)**:
  - Add route `/payrolls/lre` in `App.tsx`.
  - Add sub-menu item **"Libro de Remuneraciones (LRE)"** under *Remuneración* in `Sidebar.tsx`.
  - Add breadcrumb route mapping `lre: 'Libro de Remuneraciones (LRE)'` in `Breadcrumbs.tsx` (`Inicio > Liquidaciones > Libro de Remuneraciones (LRE)`).
  - Create `LrePage.tsx` with company & period filters, summary metrics card, DT field pre-visualization table, and **"Descargar LRE (.CSV - DT Chile)"** export button.
  - Create `lreService.ts` in `frontend/src/services/lreService.ts`.
