## Context

Users want responsive search and filtering without page reloads or network latency, with a max of 10 items per page.

## Goals / Non-Goals

**Goals:**
- Client-side filtering via `useMemo` for zero-latency instant search as user types.
- Search algorithm: Case-insensitive match against name or cleaned/raw RUT (`cleanRut` / `formatRut`).
- Workers filter: Match selected `companyId` ('all', 'none', or specific `companyId`).
- Pagination: 10 items per page. Display page info ("Página X de Y", "Mostrando X a Y de Z resultados") with Notion Glass controls.

**Non-Goals:**
- Server-side database pagination.

## Decisions

1. **Client-side Filtering with useMemo**
   - *Decision*: Filter fetched React Query array in memory.
   - *Rationale*: Zero network delay while typing in search bar.

2. **RUT Sanitized Search**
   - *Decision*: Match query against both raw RUT (digits only) and formatted RUT (`11.111.111-1`).
   - *Rationale*: Allows users to search RUT with or without dots and hyphen.

## Risks / Trade-offs

- None identified.
