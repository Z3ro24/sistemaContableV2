# Design: Estado Global de Empresa Activa con Redux Toolkit y Navbar Superior

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                         GLOBAL COMPANY ARCHITECTURE (REDUX TOOLKIT)                      │
└──────────────────────────────────────────────────────────────────────────────────────────┘
                                             │
               ┌─────────────────────────────┴─────────────────────────────┐
               ▼                                                           ▼
     `company.slice.ts`                                             `Navbar.tsx`
 (Redux State & LocalStorage)                                  (Rendered in `AppLayout.tsx`)
               │                                                           │
               ├──────────────────────────────────────────┬────────────────┤
               ▼                                          ▼                ▼
         PayrollsPage                               NoveltiesPage     WorkersPage
   (Reads Redux Company)                      (Reads Redux Company) (Reads Redux Company)
```

## State Definition (`company.slice.ts`)

```typescript
interface CompanyState {
  selectedCompanyId: string; // 'all' or numeric ID string
}

const initialCompanyId = localStorage.getItem('activeCompanyId') || 'all';

const initialState: CompanyState = {
  selectedCompanyId: initialCompanyId,
};

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setSelectedCompanyId: (state, action: PayloadAction<string>) => {
      state.selectedCompanyId = action.payload;
      localStorage.setItem('activeCompanyId', action.payload);
    },
  },
});
```

## Navbar Integration (`AppLayout.tsx`)

```tsx
<main className="relative flex-1 overflow-y-auto flex flex-col">
  <Navbar />
  <div className="p-8 flex-1">
    <Breadcrumbs />
    <Outlet />
  </div>
</main>
```
