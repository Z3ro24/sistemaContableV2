# Tasks: Simplificación de Modal de Liquidación y Módulo de Novedades del Mes

- [ ] Create `NoveltiesModule` (`NoveltiesService`, `NoveltiesController`) in `backend/src/novelties/` <!-- id: 0 -->
- [ ] Create unit tests `novelties.service.spec.ts` and `novelties.controller.spec.ts` in `backend/src/novelties/` <!-- id: 1 -->
- [ ] Register `NoveltiesModule` in `backend/src/app.module.ts` <!-- id: 2 -->
- [ ] Update `PayrollsService.calculateAndSave` in `backend/src/payrolls/payrolls.service.ts` to automatically load `MonthlyNovelty` from DB <!-- id: 3 -->
- [ ] Create `noveltiesService.ts` in `frontend/src/services/noveltiesService.ts` <!-- id: 4 -->
- [ ] Simplify "Calcular Liquidación" modal in `frontend/src/pages/app/PayrollsPage.tsx` to 2 fields (Worker and Period YYYY-MM) <!-- id: 5 -->
- [ ] Create full `NoveltiesPage.tsx` view in `frontend/src/pages/app/NoveltiesPage.tsx` for entering monthly novelties <!-- id: 6 -->
- [ ] Register `NoveltiesPage` route in `frontend/src/navigation/App.tsx` on `/hr/novelties` <!-- id: 7 -->
- [ ] Verify `pnpm test` in backend and `pnpm build` in frontend <!-- id: 8 -->
