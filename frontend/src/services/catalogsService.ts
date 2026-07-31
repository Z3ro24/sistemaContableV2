import api from './apiService';

export interface Afp {
  id: number;
  name: string;
  previredCode: string;
  commissionRate: number;
}

export interface HealthInstitution {
  id: number;
  name: string;
  previredCode: string;
  isIsapre: boolean;
}

export interface ContractType {
  id: number;
  name: string;
  dtCode: string;
  afcWorkerDiscount: boolean;
}

export interface Bank {
  id: number;
  name: string;
  sbifCode: string;
}

export interface CostCenter {
  id: number;
  code: string;
  name: string;
}

export interface JobPosition {
  id: number;
  name: string;
}

export const catalogsService = {
  getAfps: async (): Promise<Afp[]> => {
    const response = await api.get('/catalogs/afp');
    return response.data;
  },

  getHealthInstitutions: async (): Promise<HealthInstitution[]> => {
    const response = await api.get('/catalogs/health-institutions');
    return response.data;
  },

  getContractTypes: async (): Promise<ContractType[]> => {
    const response = await api.get('/catalogs/contract-types');
    return response.data;
  },

  getBanks: async (): Promise<Bank[]> => {
    const response = await api.get('/catalogs/banks');
    return response.data;
  },

  getCostCenters: async (): Promise<CostCenter[]> => {
    const response = await api.get('/catalogs/cost-centers');
    return response.data;
  },

  getJobPositions: async (): Promise<JobPosition[]> => {
    const response = await api.get('/catalogs/job-positions');
    return response.data;
  },
};

export default catalogsService;
