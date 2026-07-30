import api from './apiService';

export interface Company {
  id: number;
  name: string;
  rutCompany: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    workers: number;
  };
}

export interface CreateCompanyPayload {
  name: string;
  rutCompany: string;
}

export interface UpdateCompanyPayload {
  name?: string;
  rutCompany?: string;
}

export const companiesService = {
  getAll: async (): Promise<Company[]> => {
    const response = await api.get<Company[]>('/companies');
    return response.data;
  },

  getById: async (id: number): Promise<Company> => {
    const response = await api.get<Company>(`/companies/${id}`);
    return response.data;
  },

  create: async (payload: CreateCompanyPayload): Promise<Company> => {
    const response = await api.post<Company>('/companies', payload);
    return response.data;
  },

  update: async (id: number, payload: UpdateCompanyPayload): Promise<Company> => {
    const response = await api.patch<Company>(`/companies/${id}`, payload);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/companies/${id}`);
    return response.data;
  },
};

export default companiesService;
