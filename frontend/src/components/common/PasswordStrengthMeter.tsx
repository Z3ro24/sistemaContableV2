import React from 'react';

interface PasswordStrengthMeterProps {
  password?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password = '' }) => {
  if (!password) return null;

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  let label = 'Débil';
  let colorClass = 'bg-rose-500';
  let widthClass = 'w-1/4';

  if (score >= 4) {
    label = 'Muy Fuerte';
    colorClass = 'bg-emerald-600';
    widthClass = 'w-full';
  } else if (score >= 3) {
    label = 'Fuerte';
    colorClass = 'bg-[#37352F]';
    widthClass = 'w-3/4';
  } else if (score >= 2) {
    label = 'Media';
    colorClass = 'bg-amber-500';
    widthClass = 'w-2/4';
  }

  return (
    <div className="mt-2 space-y-1">
      <div className="flex justify-between items-center text-[11px] text-[#787774] font-medium">
        <span>Fortaleza de contraseña</span>
        <span className={score >= 3 ? 'text-[#37352F] font-semibold' : 'text-[#787774]'}>{label}</span>
      </div>
      <div className="h-1.5 w-full bg-neutral-200/80 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} ${widthClass} transition-all duration-300 rounded-full`} />
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
