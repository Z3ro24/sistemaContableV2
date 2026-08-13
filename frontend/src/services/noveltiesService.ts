import api from './apiService';

export interface MonthlyNoveltyData {
  id?: number | null;
  workerId: number;
  periodYyyyMm: string;
  workedDays: number;
  sickLeaveDays: number;
  absenceDays: number;
  overtime50Hrs: number;
  overtime100Hrs: number;
  familyDependentsCount: number;
  otherTaxableIncome: number;
  otherNonTaxableIncome: number;
  otherDeductions: number;
  worker?: {
    id: number;
    name: string;
    paternalLastName?: string;
    maternalLastName?: string;
    rut: string;
    company?: {
      id: number;
      name: string;
    };
  };
}

export const noveltiesService = {
  getAll: async (periodYyyyMm?: string, companyId?: number): Promise<MonthlyNoveltyData[]> => {
    const params: Record<string, any> = {};
    if (periodYyyyMm) params.periodYyyyMm = periodYyyyMm;
    if (companyId) params.companyId = companyId;

    const response = await api.get<MonthlyNoveltyData[]>('/novelties/list', { params });
    return response.data;
  },

  getByWorkerAndPeriod: async (workerId: number, periodYyyyMm: string): Promise<MonthlyNoveltyData> => {
    const response = await api.get<MonthlyNoveltyData>('/novelties', {
      params: { workerId, periodYyyyMm },
    });
    return response.data;
  },

  create: async (data: MonthlyNoveltyData): Promise<MonthlyNoveltyData> => {
    const response = await api.post<MonthlyNoveltyData>('/novelties', data);
    return response.data;
  },

  update: async (id: number, data: MonthlyNoveltyData): Promise<MonthlyNoveltyData> => {
    const response = await api.put<MonthlyNoveltyData>(`/novelties/${id}`, data);
    return response.data;
  },

  upsert: async (data: MonthlyNoveltyData): Promise<MonthlyNoveltyData> => {
    const response = await api.post<MonthlyNoveltyData>('/novelties', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/novelties/${id}`);
  },
};

export default noveltiesService;
