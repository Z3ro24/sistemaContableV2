import api from './apiService';
import type { Company } from './companiesService';
import type { Afp, HealthInstitution, ContractType, Bank, CostCenter, JobPosition } from './catalogsService';

export interface Worker {
  id: number;
  name: string;
  paternalLastName?: string | null;
  maternalLastName?: string | null;
  rut: string;
  entryDate?: string | null;
  baseSalary?: number | null;
  companyId: number | null;
  company?: Company | null;
  afpId?: number | null;
  afp?: Afp | null;
  healthInstitutionId?: number | null;
  healthInstitution?: HealthInstitution | null;
  healthAgreedUf?: number | null;
  contractTypeId?: number | null;
  contractType?: ContractType | null;
  bankId?: number | null;
  bank?: Bank | null;
  bankAccountType?: string | null;
  bankAccountNumber?: string | null;
  costCenterId?: number | null;
  costCenter?: CostCenter | null;
  jobPositionId?: number | null;
  jobPosition?: JobPosition | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkerPayload {
  name: string;
  paternalLastName?: string;
  maternalLastName?: string;
  rut: string;
  entryDate?: string;
  baseSalary?: number;
  companyId?: number | null;
  afpId?: number | null;
  healthInstitutionId?: number | null;
  healthAgreedUf?: number;
  contractTypeId?: number | null;
  bankId?: number | null;
  bankAccountType?: string;
  bankAccountNumber?: string;
  costCenterId?: number | null;
  jobPositionId?: number | null;
}

export interface UpdateWorkerPayload {
  name?: string;
  paternalLastName?: string;
  maternalLastName?: string;
  rut?: string;
  entryDate?: string;
  baseSalary?: number;
  companyId?: number | null;
  afpId?: number | null;
  healthInstitutionId?: number | null;
  healthAgreedUf?: number;
  contractTypeId?: number | null;
  bankId?: number | null;
  bankAccountType?: string;
  bankAccountNumber?: string;
  costCenterId?: number | null;
  jobPositionId?: number | null;
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
