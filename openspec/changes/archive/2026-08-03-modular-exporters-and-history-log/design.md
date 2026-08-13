# Design: Módulos Explotadores Independientes e Historial de Descargas

## System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              MODULAR EXPORTER ARCHITECTURE & HISTORY LOG                                  │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                FRONTEND                                                    │
│                                                   │                                                        │
│     ┌────────────────────────┬────────────────────┼─────────────────────┬────────────────────────┐         │
│     ▼                        ▼                    ▼                     ▼                        ▼         │
│ 📄 Liquidaciones      📑 Reporte PreviRed     📊 Reporte LRE      🏦 Nómina Bancaria      📋 Historial Export │
│ (Exportar PreviRed)   (/reports/previred)     (/lre)              (/reports/bank-transfers) (Log & Re-descarga)│
└───────────────────────────────────────────────────┬────────────────────────────────────────────────────────┘
                                                    │ REST API
                                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                BACKEND NESTJS                                              │
├──────────────────────────┬──────────────────────────┬──────────────────────────┬───────────────────────────┤
│ PreviredExporterModule   │ LreDtExporterModule      │ BancosExporterModule     │ ExportLogsModule          │
│ ├─ Service               │ ├─ Service               │ ├─ Service               │ ├─ Service                │
│ └─ Controller            │ └─ Controller            │ └─ Controller            │ └─ Controller             │
│ (105 col TXT PreviRed)   (CSV LRE DT Chile)         (Santander/PAE/Chile/TEF)  (Tabla DB `export_logs`)    │
└──────────────────────────┴──────────────────────────┴──────────────────────────┴───────────────────────────┘
```

## Database Schema (`schema.prisma`)

```prisma
model ExportLog {
  id           Int      @id @default(autoincrement())
  userId       String   @map("user_id") @db.Uuid
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  companyId    Int?     @map("company_id")
  exportType   String   @map("export_type") // 'PREVIRED_TXT', 'LRE_CSV', 'BANCO_SANTANDER', 'BANCO_ESTADO_PAE', 'BANCO_DE_CHILE', 'UNIVERSAL_TEF'
  periodYyyyMm String   @map("period_yyyy_mm")
  recordCount  Int      @map("record_count")
  totalAmount  Decimal  @default(0.0) @map("total_amount") @db.Decimal(14, 2)
  filename     String
  fileData     String?  @db.Text
  createdAt    DateTime @default(now()) @map("created_at")

  @@map("export_logs")
}
```

## Module Responsibilities

1. **`PreviredExporterService`**:
   - Compiles worker payroll data for period/company.
   - Generates 105-column fixed-width text string with RUTs, AFP codes, Health codes, taxable amounts, and insurance details.
   - Saves an entry to `ExportLog`.
2. **`LreDtExporterService`**:
   - Generates standardized DT Chile CSV format with semicolon delimiters.
   - Saves an entry to `ExportLog`.
3. **`BancosExporterService`**:
   - Formats mass payment files for Santander, BancoEstado PAE, Banco de Chile, and Universal TEF.
   - Saves an entry to `ExportLog`.
4. **`ExportLogsService`**:
   - CRUD service for creating and querying `ExportLog` records filterable by `exportType`, `periodYyyyMm`, and `companyId`.

## Frontend Integration

1. **`PayrollsPage.tsx`**:
   - Add **"📄 PreviRed (.TXT)"** to **Exportar Masivo ▾** dropdown. Clicking calls `previredExporterService.downloadTxt(periodYyyyMm, companyId)`.
2. **`ExportHistoryTable.tsx`**:
   - Reusable component displaying recent export history logs with columns: Fecha/Hora, Tipo Archivo, Empresa/Período, Registros, Monto Total, and "Re-descargar Archivo".
3. **`PreviredPage.tsx`**, `LrePage.tsx`, **`BankTransfersPage.tsx`**:
   - Embed `<ExportHistoryTable exportType="..." />`.
