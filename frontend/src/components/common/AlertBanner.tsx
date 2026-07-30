import React from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface AlertBannerProps {
  message?: string;
  type?: 'error' | 'success' | 'warning';
  onDismiss?: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="mb-4 flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50/90 p-3 text-[#37352F] shadow-sm backdrop-blur-md transition-all duration-200"
    >
      <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0 text-rose-600 mt-0.5" />
      <div className="flex-1 text-xs font-medium leading-relaxed text-rose-900">{message}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="rounded p-0.5 text-rose-500 transition hover:bg-rose-100 hover:text-rose-700"
          aria-label="Cerrar alerta"
        >
          <XMarkIcon className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
