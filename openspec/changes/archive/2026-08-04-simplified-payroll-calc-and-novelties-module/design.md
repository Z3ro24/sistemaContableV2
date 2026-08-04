# Design: Simplificación de Modal de Liquidación y Módulo de Novedades del Mes

## System Architecture

```
 ┌──────────────────────────────────────────────────────────────────────────┐
 │                     NOVEDADES VS. PROCESO LIQUIDACIÓN                    │
 └──────────────────────────────────────────────────────────────────────────┘

  1. REGISTRO DE NOVEDADES                             2. CÁLCULO SIMPLIFICADO
  ┌─────────────────────────────────────┐              ┌─────────────────────────────────────┐
  │ Vista: /hr/novelties                │              │ Vista: /payrolls                    │
  ├─────────────────────────────────────┤              ├─────────────────────────────────────┤
  │ - Selector Trabajador + Mes         │              │ Modal: Calcular Liquidación         │
  │ - Asistencia, Licencias, Horas Ext. │   ───────▶   │ - Solo Seleccionar Trabajador + Mes │
  │ - Bonos Imponibles & No Imponibles  │              │ - Botón: "Calcular y Emitir"        │
  │ - Guardar Novedades en DB           │              └──────────────────┬──────────────────┘
  └──────────────────┬──────────────────┘                                 │
                     │                                                    │
                     ▼                                                    ▼
             ┌──────────────────────────────────────────────────────────────────┐
             │ Backend: Prisma `monthly_novelties`                              │
             │ (workerId, periodYyyyMm, workedDays, overtime50Hrs, bonus, ...)  │
             └──────────────────────────────────────────────────────────────────┘
```

## Backend API Specs

1. **`GET /api/v1/novelties?workerId=1&periodYyyyMm=2026-07`**:
   - Returns the existing `MonthlyNovelty` for worker & period or default values.
2. **`POST /api/v1/novelties`**:
   - Upserts `MonthlyNovelty` record for worker & period.
3. **`PayrollsService.calculateAndSave`**:
   - Resolves `MonthlyNovelty` from DB if DTO fields are not explicitly provided.

## Frontend UI Architecture

1. **`PayrollsPage.tsx`**:
   - Simplified modal with inputs: `workerId`, `periodYyyyMm`.
   - Banner: "Los haberes, horas extras y licencias se cargarán desde Novedades del Mes ({periodYyyyMm})."
2. **`NoveltiesPage.tsx`**:
   - Selector for Worker and Period (`YYYY-MM`).
   - Cards/Tabs:
     - Días Trabajados (0-30), Licencias Médicas, Inasistencias.
     - Horas Extras 50% y 100%.
     - Cargas Familiares, Bonos Imponibles, Haberes No Imponibles.
     - Otros Descuentos / Anticipos.
   - Save button with toast notification.
