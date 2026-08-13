import api from './apiService';

export interface LreRecord {
  payrollId: number;
  workerRut: string;
  workerName: string;
  companyName: string;
  periodYyyyMm: string;
  workedDays: number;
  baseSalary: number;
  totalTaxable: number;
  totalNonTaxable: number;
  afpName: string;
  afpDeduction: number;
  healthName: string;
  healthDeduction: number;
  afcDeduction: number;
  uniqueTaxDeduction: number;
  totalLegalDeductions: number;
  totalOtherDeductions: number;
  netPayable: number;
}

export interface LreSummaryResponse {
  periodYyyyMm: string;
  companyId?: number;
  companyName: string;
  totalWorkers: number;
  totalTaxable: number;
  totalNonTaxable: number;
  totalLegalDeductions: number;
  totalOtherDeductions: number;
  totalNetPayable: number;
  records: LreRecord[];
}

export const lreService = {
  getReport: async (periodYyyyMm: string, companyId?: number): Promise<LreSummaryResponse> => {
    const params: Record<string, any> = { periodYyyyMm };
    if (companyId) params.companyId = companyId;

    const response = await api.get<LreSummaryResponse>('/lre', { params });
    return response.data;
  },

  downloadCsv: async (periodYyyyMm: string, companyId?: number): Promise<void> => {
    const params: Record<string, any> = { periodYyyyMm };
    if (companyId) params.companyId = companyId;

    const response = await api.get('/lre/export', {
      params,
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `LRE_DT_${periodYyyyMm}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};

export default lreService;
