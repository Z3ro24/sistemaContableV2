# Design: Payroll PDF Printable Modal & Download

## Overview
Implement a high-fidelity, printable Chilean Liquidación de Sueldo document component (`PayrollPdfModal.tsx`) using Headless UI `<Dialog>`, Tailwind CSS print styles (`@media print`), and `html2pdf.js` for instant client-side PDF downloads.

## Layout Specification

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ LIQUIDACIÓN DE SUELDO                                                 FOLIO: #2026-07-001│
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ EMPRESA: Servicios Contables SpA                    RUT EMPRESA: 76.123.456-0            │
│ DIRECCIÓN: Av. Providencia 1234, Santiago            PERÍODO: Julio 2026                 │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ TRABAJADOR: Juan Antonio Pérez González             RUT: 19.876.543-2                   │
│ FECHA INGRESO: 15/01/2024                            DÍAS TRABAJADOS: 30                 │
│ AFP: Habitat (11.27%)                                SALUD: Fonasa (7%)                  │
├──────────────────────────────────────┬──────────────────────────────────────────────────┤
│ HABERES IMPONIBLES                   │ DESCUENTOS LEGALES                               │
│ • Sueldo Base              $600.000  │ • Cotización AFP (Habitat 11.27%)     $67.620    │
│ • Horas Extra 50%                 $0 │ • Cotización Salud (Fonasa 7%)        $42.000    │
│ TOTAL HABERES IMPONIBLES   $600.000  │ • Seguro Cesantía AFC (0.6%)           $3.600    │
│                                      │ • Impuesto Único 2ª Categoría             $0    │
│ HABERES NO IMPONIBLES                │ TOTAL DESCUENTOS LEGALES             $113.220    │
│ • Movilización                    $0 │                                                  │
│ TOTAL HABERES NO IMPONIBLES       $0 │ OTROS DESCUENTOS                                 │
│                                      │ TOTAL OTROS DESCUENTOS                    $0    │
├──────────────────────────────────────┴──────────────────────────────────────────────────┤
│ MONTO LÍQUIDO A PAGAR: $486.780 (Cuatrocientos ochenta y seis mil setecientos ochenta)  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  _____________________________________               _________________________________  │
│         Firma Trabajador (Recibí Conforme)                     Firma Empleador          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Helper Utilities
- `numberToWordsCLP`: Utility in `frontend/src/utils/numberToWords.ts` to convert numeric net payable amounts to official Spanish words.

## Dependencies
- `html2pdf.js` for instant client-side PDF export.
