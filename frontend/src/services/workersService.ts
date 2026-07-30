import api from './apiService';
import type { Company } from './companiesService';

export interface Worker {
  id: number;
  name: string;
  rut: string;
  companyId: number | null;
  company?: Company | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkerPayload {
  name: string;
  rut: string;
  companyId?: number | null;
}

export interface UpdateWorkerPayload {
  name?: string;
  rut?: string;
  companyId?: number | null;
}

export const workersService = {
  getAll: async (): Promise<Worker[]> => {
    const response = await api.get<Worker[]>('/workers');
    return response.data;
  },

  getById: async (id: number): Promise<Worker> => {
    const response = await api.get<Worker>(`/workers/${id}`);
    return response.data;
  },

  create: async (payload: CreateWorkerPayload): Promise<Worker> => {
    const response = await api.post<Worker>('/workers', payload);
    return response.data;
  },

  update: async (id: number, payload: UpdateWorkerPayload): Promise<Worker> => {
    const response = await api.patch<Worker>(`/workers/${id}`, payload);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/workers/${id}`);
    return response.data;
  },
};

export default workersService;
