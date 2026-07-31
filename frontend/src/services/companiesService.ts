import api from './apiService';

export interface Company {
  id: number;
  name: string;
  rutCompany: string;
  address?: string | null;
  digitalCertificateId?: number | null;
  _count?: {
    workers: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyPayload {
  name: string;
  rutCompany: string;
  address?: string;
  digitalCertificateId?: number;
}

export interface UpdateCompanyPayload {
  name?: string;
  rutCompany?: string;
  address?: string;
  digitalCertificateId?: number;
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
