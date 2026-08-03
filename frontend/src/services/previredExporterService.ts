import api from './apiService';

export const previredExporterService = {
  downloadTxt: async (periodYyyyMm: string, companyId?: number): Promise<void> => {
    const params: Record<string, any> = { periodYyyyMm };
    if (companyId) params.companyId = companyId;

    const response = await api.get('/exports/previred', {
      params,
      responseType: 'blob',
    });

    const filename = `PreviRed_${periodYyyyMm}.txt`;
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/plain;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};

export default previredExporterService;
