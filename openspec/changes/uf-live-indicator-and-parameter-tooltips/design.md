## Context

The `MonthlyParametersPage.tsx` allows accounting users to enter Chilean payroll variables per period (`YYYY-MM`). Currently, users must manually look up the daily UF closing rate. By querying the `https://mindicador.cl/api/uf` public endpoint using React Query or Axios/fetch on client mount, we can fetch the live UF rate, date, and unit, auto-populating the input while maintaining manual override capability.

## Goals / Non-Goals

**Goals:**
- Query `https://mindicador.cl/api/uf` on page load in `MonthlyParametersPage.tsx`.
- Render a Notion Glass styled live UF card showing value, date, and "Usar valor oficial" action button.
- Auto-fill `ufClosingValue` state with the fetched live UF rate.
- Add tooltips to all parameter label headers detailing their exact role in Chilean payroll math.

**Non-Goals:**
- Server-side caching or storing mindicador responses in PostgreSQL (client-side fetch is sufficient and real-time).
- Modifying backend schemas or API DTOs.

## Decisions

- **Decision 1: Direct Client Fetch via TanStack Query**:
  Query `https://mindicador.cl/api/uf` directly in frontend using `@tanstack/react-query` (`useQuery`).
  *Rationale*: Avoids backend proxy complexity; mindicador API supports CORS for public browser queries.

- **Decision 2: Auto-Fill with Manual Override**:
  On query success, if `ufClosingValue` equals its initial default, set `ufClosingValue` to `data.uf.valor.toString()`. Provide a button to re-apply the live rate at any time.
  *Rationale*: Provides zero-click convenience while giving accountants full authority to adjust values if required by company policy.

- **Decision 3: Field Tooltips with Custom Floating UI**:
  Add an informational icon `ⓘ` next to each parameter label that displays a floating tooltip explaining the purpose of each field.
  *Rationale*: Improves usability for non-expert users and prevents data entry mistakes.

## Risks / Trade-offs

- [Risk] mindicador.cl API downtime or network latency. → Mitigation: Wrap in try/catch or React Query error state; default values remain intact if API fails.
- [Risk] CORS or rate limiting. → Mitigation: Handle failure gracefully without blocking parameter saving.
