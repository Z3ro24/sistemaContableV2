# Proposal: Mass Payroll Export Menu (PDF, ZIP & Excel/CSV)

## Why
Accountants and HR personnel need to export liquidations in bulk according to the selected company filter. This includes printing all liquidations in a single PDF, packaging individual PDFs into a ZIP file for worker distribution, and exporting an Excel/CSV payment matrix for bank transfers.

## What Changes
- Add a dropdown button **"Exportar Masivo ▾"** in `PayrollsPage.tsx` next to the company filter.
- Support 3 export options matching current company filter selection:
  1. **PDF Unificado**: Combines all filtered liquidations into a single multi-page PDF document.
  2. **Paquete ZIP**: Bundles individual `Liquidacion_[RUT]_[Periodo].pdf` files into a downloadable `.zip` archive using `jszip` & `file-saver`.
  3. **Nómina Excel / CSV**: Exports a CSV spreadsheet containing worker payment details (RUT, Name, Bank, Account Type, Account Number, Net Amount).
- Install `jszip` and `file-saver` (plus types) in `frontend`.
