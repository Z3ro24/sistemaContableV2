# Design: Libro de Remuneraciones Electrónico (LRE - DT Chile)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│             LIBRO DE REMUNERACIONES ELECTRÓNICO (LRE - DT CHILE)            │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
         ┌────────────────────────────┴────────────────────────────┐
         ▼                                                         ▼
┌───────────────────────────────────────┐       ┌───────────────────────────────┐
│         Backend (NestJS LRE)          │       │      Frontend (React UI)      │
├───────────────────────────────────────┤       ├───────────────────────────────┤
│ - LreModule & LreService              │       │ - Ruta: /payrolls/lre         │
│ - GET /api/v1/lre                     │       │ - Breadcrumb:                 │
│ - GET /api/v1/lre/export              │       │   Inicio > Liquidaciones      │
│ - DT CSV Formatter Engine             │       │   > Libro de Remunerac. (LRE) │
│ - Unit Tests (100% Pass)              │       │ - LrePage.tsx                 │
└───────────────────────────────────────┘       └───────────────────────────────┘
```

## DT Chile LRE Structure Rules

The DT LRE CSV format contains standardized pipe `|` or semicolon `;` delimited columns for each worker liquidation record in the period:

1. **Datos del Trabajador y Contrato**:
   - `RUT_TRABAJADOR`
   - `NOMBRES`, `APELLIDO_PATERNO`, `APELLIDO_MATERNO`
   - `FECHA_INGRESO`
   - `DIAS_TRABAJADOS`
   - `CENTRO_COSTO`
2. **Haberes Imponibles y Tributables**:
   - `SUELDO_BASE`
   - `HORAS_EXTRAS_50`, `MONTO_HORAS_EXTRAS`
   - `GRATIFICACION_LEGAL`
   - `OTROS_IMPONIBLES`
   - `TOTAL_IMPONIBLE`
3. **Haberes No Imponibles**:
   - `ASIGNACION_COLACION`
   - `ASIGNACION_MOVILIZACION`
   - `CARGAS_FAMILIARES`
   - `TOTAL_NO_IMPONIBLE`
4. **Descuentos Legales (Previsionales y Tributarios)**:
   - `COTIZACION_AFP` (Nombre AFP + Monto)
   - `COTIZACION_SALUD` (Nombre Isapre/Fonasa + Monto)
   - `COTIZACION_AFC`
   - `IMPUESTO_UNICO_SEGUNDA_CATEGORIA`
   - `TOTAL_DESCUENTOS_LEGALES`
5. **Alcance Líquido y Líquido a Pagar**:
   - `OTROS_DESCUENTOS`
   - `LIQUIDO_A_PAGAR`

## Navigation Breadcrumbs Mapping
In `Breadcrumbs.tsx`:
Add `lre: 'Libro de Remuneraciones (LRE)'`.
When navigating to `/payrolls/lre`, breadcrumb displays:
`Inicio > Liquidaciones > Libro de Remuneraciones (LRE)`.
