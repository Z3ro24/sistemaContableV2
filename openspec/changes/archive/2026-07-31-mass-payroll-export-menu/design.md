# Design: Mass Payroll Export Menu (PDF, ZIP & Excel/CSV)

## Architecture & Menu Options

In `frontend/src/pages/app/PayrollsPage.tsx`:
Add a Headless UI `<Menu>` dropdown **"Exportar Masivo ▾"**:

```
┌─────────────────────────────────────────────────────────┐
│ 📄 Exportar Masivo ▾                                   │
├─────────────────────────────────────────────────────────┤
│  📄 PDF Unificado (Todas las Liquidaciones)            │
│  📦 Paquete ZIP (PDFs Individuales)                     │
│  📊 Nómina de Pago (Excel / CSV Bancario)               │
└─────────────────────────────────────────────────────────┘
```

## Helper Utilities
1. `generateUnifiedPdf(payrolls)`:
   - Renders hidden container with all liquidations sequentially.
   - Uses `html2pdf.js` with `pagebreak: { mode: 'always' }`.

2. `generateZipOfPdfs(payrolls)`:
   - Iterates through payrolls, converts each to PDF blob using `html2pdf.js` output stream.
   - Adds blobs to `JSZip` instance.
   - Triggers `saveAs(zipContent, 'Liquidaciones_[Empresa]_[Periodo].zip')`.

3. `exportPaymentCsv(payrolls)`:
   - Generates CSV string with headers: `RUT,Nombre,Empresa,Banco,Tipo Cuenta,Numero Cuenta,Liquido a Pagar`.
   - Triggers browser blob download `.csv`.

## Dependencies
- `jszip` & `@types/jszip`
- `file-saver` & `@types/file-saver`
