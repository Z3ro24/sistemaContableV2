import React from 'react';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

interface PlaceholderPageProps {
  title: string;
  category: string;
  description: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  category,
  description,
}) => {
  return (
    <div className="space-y-6 max-w-4xl selection:bg-neutral-200">
      {/* Notion Glass Banner */}
      <div className="rounded-3xl border border-white/80 bg-white/60 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] ring-1 ring-white/60 backdrop-blur-3xl space-y-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full border border-neutral-300 bg-white/80 text-[10px] font-bold uppercase tracking-wider text-[#787774] shadow-2xs">
            {category}
          </span>
          <span className="px-2.5 py-0.5 rounded-full border border-amber-200 bg-amber-50 text-[10px] font-semibold text-amber-800">
            Próximamente / En Desarrollo
          </span>
        </div>

        <div className="flex items-start gap-4 pt-1">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#37352F] text-white shadow-md">
            <WrenchScrewdriverIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#37352F]">
              {title}
            </h1>
            <p className="text-xs text-[#787774] mt-1">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="rounded-2xl border border-white/80 bg-white/60 p-8 shadow-sm backdrop-blur-2xl text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-[#787774]">
          <WrenchScrewdriverIcon className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-[#37352F]">Módulo en preparación</h3>
        <p className="text-xs text-[#787774] max-w-md mx-auto">
          Este módulo ya se encuentra estructurado en el sistema de navegación. La lógica operativa y reportería correspondiente estará disponible en la próxima actualización.
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
