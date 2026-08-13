import api from './apiService';
import type { Worker } from './workersService';

export interface PayrollDetail {
  id: number;
  payrollId: number;
  conceptCode: string;
  conceptLabel: string;
  conceptType: 'TAXABLE_INCOME' | 'NON_TAXABLE_INCOME' | 'LEGAL_DEDUCTION' | 'OTHER_DEDUCTION';
  amount: number;
}

export interface Payroll {
  id: number;
  workerId: number;
  worker: Worker;
  periodYyyyMm: string;
  issueDate: string;
  baseSalaryAgreed: number;
  totalTaxable: number;
  totalNonTaxable: number;
  totalLegalDeductions: number;
  totalOtherDeductions: number;
  netPayable: number;
  afpHistoricalName: string;
  afpHistoricalRate: number;
  healthHistoricalName: string;
  paymentStatus: 'PENDIENTE' | 'PAGADO';
  details: PayrollDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface CalculatePayrollPayload {
  workerId: number;
  periodYyyyMm: string;
  workedDays?: number;
  sickLeaveDays?: number;
  absenceDays?: number;
  overtime50Hrs?: number;
  overtime100Hrs?: number;
  familyDependentsCount?: number;
  otherTaxableIncome?: number;
  otherNonTaxableIncome?: number;
  otherDeductions?: number;
}

export const payrollsService = {
  calculateAndSave: async (payload: CalculatePayrollPayload): Promise<Payroll> => {
    const response = await api.post('/payrolls/calculate', payload);
    return response.data;
  },

  getAll: async (period?: string, companyId?: number): Promise<Payroll[]> => {
    const response = await api.get('/payrolls', {
      params: { period, companyId },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Payroll> => {
    const response = await api.get(`/payrolls/${id}`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/payrolls/${id}`);
  },
};

export default payrollsService;
