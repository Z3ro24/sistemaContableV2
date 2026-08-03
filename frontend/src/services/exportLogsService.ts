import api from './apiService';

export interface ExportLogItem {
  id: number;
  exportType: string;
  periodYyyyMm: string;
  recordCount: number;
  totalAmount: string | number;
  filename: string;
  createdAt: string;
  companyId?: number;
}

export const exportLogsService = {
  getAll: async (exportType?: string, periodYyyyMm?: string, companyId?: number): Promise<ExportLogItem[]> => {
    const params: Record<string, any> = {};
    if (exportType) params.type = exportType;
    if (periodYyyyMm) params.periodYyyyMm = periodYyyyMm;
    if (companyId) params.companyId = companyId;

    const response = await api.get<ExportLogItem[]>('/exports/logs', { params });
    return response.data;
  },

  redownload: async (id: number, filename: string): Promise<void> => {
    const response = await api.get(`/exports/logs/${id}/redownload`, {
      responseType: 'blob',
    });

    const isCsv = filename.endsWith('.csv');
    const contentType = isCsv ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;';

    const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};

export default exportLogsService;
