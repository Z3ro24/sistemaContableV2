# Proposal: Módulos Explotadores Independientes e Historial de Descargas

## Why
Employers and accounting personnel require PreviRed fixed-width `.TXT` exports directly from the main payroll calculation view (`PayrollsPage.tsx`). Additionally, for auditing and compliance, users need an Export History / Log table in the "Archivos y Reportes" section to inspect, track, and re-download previously generated PreviRed, LRE, and Bank transfer files. To keep the NestJS backend clean, decoupled, and maintainable, exporters should be split into dedicated modules (`PreviredExporterModule`, `LreDtExporterModule`, `BancosExporterModule`, and `ExportLogsModule`).

## What Changes
- **Database Schema (`schema.prisma`)**:
  - Add `ExportLog` model (`export_logs`) tracking export metadata: `id`, `userId`, `companyId`, `exportType`, `periodYyyyMm`, `recordCount`, `totalAmount`, `filename`, `createdAt`.
- **Backend Decoupled Modules**:
  - `PreviredExporterModule` (`PreviredExporterService`, `PreviredExporterController`): PreviRed 105-column fixed-width `.TXT` generator.
  - `LreDtExporterModule` (`LreDtExporterService`, `LreDtExporterController`): DT Chile LRE `.CSV` generator.
  - `BancosExporterModule` (`BancosExporterService`, `BancosExporterController`): Multi-bank transfer generator (Santander, BancoEstado PAE, Banco de Chile, Universal TEF).
  - `ExportLogsModule` (`ExportLogsService`, `ExportLogsController`): Audit log persistence and query API.
- **Frontend Enhancements**:
  - Add **"📄 PreviRed (.TXT)"** to the **Exportar Masivo ▾** dropdown menu in `PayrollsPage.tsx`.
  - Add **Historial de Exportaciones** table component (`ExportHistoryTable.tsx`) to `/reports/previred`, `/lre`, and `/reports/bank-transfers` views.
  - Add `exportLogsService.ts` for fetching export history and re-downloading archived files.
