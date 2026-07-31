import api from './apiService';

export interface LiveUf {
  valor: number;
  fecha: string;
}

export interface LiveIndicatorValue {
  valor: number;
  fecha: string;
}

export interface LiveIndicators {
  uf: LiveIndicatorValue;
  utm: LiveIndicatorValue;
  dolar?: LiveIndicatorValue;
  ipc?: LiveIndicatorValue;
}

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
  getLiveUf: async (): Promise<LiveUf> => {
    const response = await api.get<LiveUf>('/catalogs/uf-live');
    return response.data;
  },

  getLiveIndicators: async (): Promise<LiveIndicators> => {
    const response = await api.get<LiveIndicators>('/catalogs/indicators-live');
    return response.data;
  },

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
