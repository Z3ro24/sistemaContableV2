import api from './apiService';

export interface UniqueTaxBracket {
  id?: number;
  bracketNumber: number;
  fromUtm: number;
  toUtm?: number | null;
  factor: number;
  deductionUtm: number;
}

export interface FamilyAllowanceBracket {
  id?: number;
  bracketLetter: string;
  incomeFrom: number;
  incomeTo: number;
  amountPerDependent: number;
}

export interface MonthlyParameter {
  id: number;
  periodYyyyMm: string;
  ufClosingValue: number;
  utmValue: number;
  minimumWage: number;
  afpCappingUf: number;
  afcCappingUf: number;
  sisRate: number;
  uniqueTaxBrackets: UniqueTaxBracket[];
  familyAllowanceBrackets: FamilyAllowanceBracket[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMonthlyParameterPayload {
  periodYyyyMm: string;
  ufClosingValue: number;
  utmValue: number;
  minimumWage: number;
  afpCappingUf: number;
  afcCappingUf: number;
  sisRate: number;
  uniqueTaxBrackets: UniqueTaxBracket[];
  familyAllowanceBrackets: FamilyAllowanceBracket[];
}

export const monthlyParametersService = {
  getAll: async (): Promise<MonthlyParameter[]> => {
    const response = await api.get('/monthly-parameters');
    return response.data;
  },

  getByPeriod: async (periodYyyyMm: string): Promise<MonthlyParameter> => {
    const response = await api.get(`/monthly-parameters/${periodYyyyMm}`);
    return response.data;
  },

  create: async (payload: CreateMonthlyParameterPayload): Promise<MonthlyParameter> => {
    const response = await api.post('/monthly-parameters', payload);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/monthly-parameters/${id}`);
  },
};

export default monthlyParametersService;
