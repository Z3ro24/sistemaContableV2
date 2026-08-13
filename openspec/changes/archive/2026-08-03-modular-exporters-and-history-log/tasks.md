# Tasks: Módulos Explotadores Independientes e Historial de Descargas

- [ ] Add `ExportLog` model to `backend/prisma/schema.prisma` and run `npx prisma db push` / `npx prisma generate` <!-- id: 0 -->
- [ ] Create `ExportLogsModule` (`ExportLogsService`, `ExportLogsController`) in `backend/src/exports/export-logs/` <!-- id: 1 -->
- [ ] Create `PreviredExporterModule` (`PreviredExporterService`, `PreviredExporterController`) in `backend/src/exports/previred/` <!-- id: 2 -->
- [ ] Create `LreDtExporterModule` (`LreDtExporterService`, `LreDtExporterController`) in `backend/src/exports/lre-dt/` <!-- id: 3 -->
- [ ] Create `BancosExporterModule` (`BancosExporterService`, `BancosExporterController`) in `backend/src/exports/bancos/` <!-- id: 4 -->
- [ ] Register new export modules in `backend/src/app.module.ts` <!-- id: 5 -->
- [ ] Create unit tests for exporter services and controllers in backend <!-- id: 6 -->
- [ ] Add `previredExporterService.ts` and `exportLogsService.ts` in frontend `frontend/src/services/` <!-- id: 7 -->
- [ ] Add "📄 PreviRed (.TXT)" export option to `PayrollsPage.tsx` dropdown menu <!-- id: 8 -->
- [ ] Create `ExportHistoryTable.tsx` component in `frontend/src/components/common/ExportHistoryTable.tsx` <!-- id: 9 -->
- [ ] Integrate `ExportHistoryTable.tsx` into `/reports/previred`, `/lre`, and `/reports/bank-transfers` views <!-- id: 10 -->
- [ ] Verify `pnpm test` in backend and `pnpm build` in frontend <!-- id: 11 -->
