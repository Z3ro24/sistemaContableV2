## Why

Configuring Chilean monthly parameters currently requires users to manually look up the daily UF value from external sites. Fetching the official live UF indicator directly from `https://mindicador.cl/api/uf` streamlines the monthly parameter configuration process while providing instant context and guidance via informative tooltips for all parameter input fields.

## What Changes

- Add a live UF indicator card at the top of `MonthlyParametersPage.tsx` fetching data from `https://mindicador.cl/api/uf`.
- Display live UF value, unit, update date, and a "Usar valor oficial" action button.
- Auto-fill the UF closing value input with the live UF value by default, preserving full manual editability.
- Add informative tooltips to all parameter field labels (Period, UF, UTM, Minimum Wage, AFP Cap, AFC Cap, SIS Rate) detailing their usage in Chilean payroll math.

## Capabilities

### New Capabilities
- `uf-live-indicator`: Live indicator card fetching official UF rate from mindicador.cl and auto-filling configuration forms with field tooltips.

### Modified Capabilities
- None

## Impact

- `frontend/src/pages/app/MonthlyParametersPage.tsx`: Adding mindicador API fetch, live UF card component, auto-fill logic, and Headless UI / custom tooltips.
- Dependencies: Standard `fetch` or Axios request to public mindicador API (no backend endpoint needed).
