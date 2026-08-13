import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ClockIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import exportLogsService from '../../services/exportLogsService';

interface ExportHistoryTableProps {
  exportType?: string;
  periodYyyyMm?: string;
  companyId?: number;
  title?: string;
}

export const ExportHistoryTable: React.FC<ExportHistoryTableProps> = ({
  exportType,
  periodYyyyMm,
  companyId,
  title = 'Historial de Archivos Generados',
}) => {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const { data: logs = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['exportLogs', exportType, periodYyyyMm, companyId],
    queryFn: () => exportLogsService.getAll(exportType, periodYyyyMm, companyId),
  });

  const handleRedownload = async (id: number, filename: string) => {
    setDownloadingId(id);
    try {
      await exportLogsService.redownload(id, filename);
    } catch {
      alert('Error al re-descargar el archivo guardado');
    } finally {
      setDownloadingId(null);
    }
  };

  const formatExportTypeLabel = (type: string) => {
    switch (type) {
      case 'PREVIRED_TXT':
        return '📑 PreviRed (.TXT)';
      case 'LRE_CSV':
        return '📊 Libro Remuneraciones LRE (.CSV)';
      case 'BANCO_SANTANDER':
        return '🟢 Banco Santander (CSV)';
      case 'BANCO_ESTADO_PAE':
        return '🔵 BancoEstado PAE (.TXT)';
      case 'BANCO_DE_CHILE':
        return '🔴 Banco de Chile (CSV)';
      case 'UNIVERSAL_TEF':
        return '🌐 Estándar Universal TEF (CSV)';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-white/80 bg-white/60 p-6 shadow-sm backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
        <div className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5 text-[#37352F]" />
          <h3 className="text-sm font-bold text-[#37352F]">{title}</h3>
          <span className="rounded-full bg-neutral-200/60 px-2 py-0.5 text-[10px] font-bold text-[#787774]">
            {logs.length} registros
          </span>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          title="Actualizar historial"
          className="p-1 rounded-lg text-[#787774] hover:bg-neutral-100 hover:text-[#37352F] transition-colors"
        >
          <ArrowPathIcon className="h-4 w-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="py-6 text-center text-xs text-[#787774]">Cargando historial de descargas...</div>
      ) : isError ? (
        <div className="py-4 text-center text-xs text-rose-700">Error al obtener el historial de descargas</div>
      ) : logs.length === 0 ? (
        <div className="py-6 text-center text-xs text-[#787774]">
          No hay registros de descargas anteriores para este informe.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200/60 text-[#787774] uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="py-2.5 px-3">Fecha y Hora</th>
                <th className="py-2.5 px-3">Tipo de Archivo</th>
                <th className="py-2.5 px-3">Período</th>
                <th className="py-2.5 px-3 text-right">Registros</th>
                <th className="py-2.5 px-3 text-right">Monto Total</th>
                <th className="py-2.5 px-3">Nombre del Archivo</th>
                <th className="py-2.5 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60 text-[#37352F]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/40 transition-colors">
                  <td className="py-3 px-3 font-mono text-[11px] text-[#787774]">
                    {new Date(log.createdAt).toLocaleString('es-CL', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-3 font-medium">
                    {formatExportTypeLabel(log.exportType)}
                  </td>
                  <td className="py-3 px-3 font-mono font-medium">
                    {log.periodYyyyMm}
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    {log.recordCount} trab.
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold">
                    ${Number(log.totalAmount).toLocaleString('es-CL')}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#787774] truncate max-w-[180px]">
                    {log.filename}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      disabled={downloadingId === log.id}
                      onClick={() => handleRedownload(log.id, log.filename)}
                      className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#37352F] shadow-2xs hover:bg-neutral-100 transition-colors disabled:opacity-50"
                    >
                      {downloadingId === log.id ? (
                        <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <DocumentArrowDownIcon className="h-3.5 w-3.5 text-emerald-700" />
                      )}
                      <span>Re-descargar</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExportHistoryTable;
