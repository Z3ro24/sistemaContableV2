# Tasks: Estado Global de Empresa Activa con Redux Toolkit y Navbar Superior

- [ ] Create `company.slice.ts` in `frontend/src/store/slices/company.slice.ts` with `selectedCompanyId` state and `localStorage` persistence <!-- id: 0 -->
- [ ] Register `companyReducer` in `frontend/src/store/store.ts` <!-- id: 1 -->
- [ ] Create `Navbar.tsx` component in `frontend/src/components/layout/Navbar.tsx` with active company selector <!-- id: 2 -->
- [ ] Integrate `Navbar.tsx` at top of `frontend/src/layouts/AppLayout.tsx` <!-- id: 3 -->
- [ ] Update `CompanyModal.tsx` to automatically select newly created company or invalidate companies query <!-- id: 4 -->
- [ ] Refactor `PayrollsPage.tsx` to remove local company dropdown and use Redux `selectedCompanyId` <!-- id: 5 -->
- [ ] Refactor `NoveltiesPage.tsx` to remove local company dropdown and use Redux `selectedCompanyId` <!-- id: 6 -->
- [ ] Refactor `WorkersPage.tsx` to remove local company dropdown and use Redux `selectedCompanyId` <!-- id: 7 -->
- [ ] Verify `pnpm build` in frontend and `pnpm test` in backend <!-- id: 8 -->
