import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CompanyState {
  selectedCompanyId: string; // 'all' or numeric ID as string
}

const getInitialCompanyId = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('activeCompanyId');
    if (saved) return saved;
  }
  return 'all';
};

const initialState: CompanyState = {
  selectedCompanyId: getInitialCompanyId(),
};

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setSelectedCompanyId: (state, action: PayloadAction<string>) => {
      state.selectedCompanyId = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('activeCompanyId', action.payload);
      }
    },
  },
});

export const { setSelectedCompanyId } = companySlice.actions;

export default companySlice.reducer;
