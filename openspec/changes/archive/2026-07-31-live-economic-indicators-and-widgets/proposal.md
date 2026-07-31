# Proposal: Live Economic Indicators (UF, UTM, Dólar, IPC) & Widget Dashboard

## Summary
Expand backend catalog proxy to fetch live official Chilean economic indicators (UF, UTM, Dólar Observado, IPC) from mindicador.cl, and enhance `MonthlyParametersPage` with dual primary action cards (UF & UTM auto-fill) and a secondary live indicator ticker/widget bar.

## Value Proposition
- **Automated Parameter Setup**: Instant 1-click auto-fill for both UF and UTM values in Monthly Parameters form.
- **Inflation & Currency Awareness**: Displays real-time IPC and Dólar Observado for salary adjustments, multi-currency invoicing, or inflation-indexed calculations.
- **Resilience**: Server-side proxy with fallback ensures zero CORS or adblocker issues.

## Scope
- Backend: Update `CatalogsService` and `CatalogsController` to export `GET /catalogs/indicators-live` returning `{ uf, utm, dolar, ipc }`.
- Frontend: Update `catalogsService.ts` and `MonthlyParametersPage.tsx` with:
  - UF live card with "Usar Valor Oficial UF" button.
  - UTM live card with "Usar Valor Oficial UTM" button.
  - Secondary Live Economic Ticker widget bar displaying Dólar Observado and IPC.
