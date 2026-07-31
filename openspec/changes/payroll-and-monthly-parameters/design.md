## Context

Chilean payroll calculation requires strict compliance with labor and tax laws:
- Taxable Income = Base Salary (proportional to worked days) + Overtime 50%/100% + Imponibles.
- AFP Deduction = Min(Taxable Income, AFP Cap UF * UF Value) * AFP Rate %.
- Health Deduction = Max(7% of Taxable Income, Agreed UF * UF Value).
- AFC Deduction = 0.6% of Taxable Income (if Indefinite Contract and worker discount enabled).
- Taxable Base for Unique Tax = Taxable Income - AFP - Health - AFC.
- Unique Tax = (Taxable Base in UTM * Factor) - Deduction UTM.
- Family Allowance = Dependent Count * Amount per Dependent (based on income bracket).
- Net Salary = Total Income - Total Deductions.

## Goals / Non-Goals

**Goals:**
- Provide seeds for Chilean Previred catalogs (AFPs, Health, Banks, Contract Types).
- Store monthly parameters per period (`periodYyyyMm`, e.g. `'2026-07'`).
- Provide an automatic calculation service in NestJS that produces a detailed `Payroll` record and `PayrollDetail` items (Haberes, Descuentos Legales, Otros Descuentos).
- Support full CRUD for monthly novelties (worked days, sick leaves, overtime, family dependents).

**Non-Goals:**
- Electronic Previred file export (.txt) in this initial change (can be added in a follow-up change).

## Decisions

1. **Prisma English Model Names**
   - *Decision*: Map `afp` to `Afp`, `instituciones_salud` to `HealthInstitution`, `tipos_contrato` to `ContractType`, `bancos` to `Bank`, `empleados` to `Worker`, `empresas` to `Company`, `parametros_mensuales` to `MonthlyParameter`, `liquidaciones` to `Payroll`, `liquidacion_detalle` to `PayrollDetail`.
   - *Rationale*: Keeps database models consistent in English while preserving user's database structure.

2. **Snapshot Historical Values in Payroll**
   - *Decision*: Store `afpHistoricalName`, `afpHistoricalRate`, `healthHistoricalName` directly on `Payroll`.
   - *Rationale*: Prevents historical pay slips from changing if AFP rates change in future periods.

## Risks / Trade-offs

- Missing monthly parameters for a period will prevent payroll calculation for that month. The frontend will validate that monthly parameters exist for the chosen period before running calculation.
