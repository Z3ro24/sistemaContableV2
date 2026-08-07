import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BuildingOfficeIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import companiesService from '../../services/companiesService';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { setSelectedCompanyId } from '../../store/slices/company.slice';
import CustomSelect from '../common/CustomSelect';

interface SelectOption {
  value: string;
  label: string;
}

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedCompanyId = useAppSelector((state) => state.company.selectedCompanyId);
  const user = useAppSelector((state) => state.auth.user);

  // Fetch companies for global selector
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: companiesService.getAll,
  });

  const companyOptions: SelectOption[] = [
    { value: 'all', label: 'Todas las Empresas' },
    ...companies.map((c) => ({
      value: c.id.toString(),
      label: `${c.name} (${c.rutCompany})`,
    })),
  ];

  const selectedOption =
    companyOptions.find((o) => o.value === selectedCompanyId) || companyOptions[0];

  const handleCompanyChange = (option: SelectOption | null) => {
    const val = option?.value || 'all';
    dispatch(setSelectedCompanyId(val));
  };

  const selectedCompanyObj = companies.find((c) => c.id.toString() === selectedCompanyId);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/80 bg-white/70 px-8 shadow-2xs backdrop-blur-2xl transition-all">
      {/* Left: Global Active Company Selector */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#37352F] text-white shadow-xs">
          <BuildingOfficeIcon className="h-5 w-5 text-amber-400" />
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider text-[#787774]">
            Empresa Activa:
          </span>
          <div className="w-64 sm:w-80">
            <CustomSelect<SelectOption>
              options={companyOptions}
              value={selectedOption}
              onChange={handleCompanyChange}
            />
          </div>
        </div>

        {selectedCompanyObj && (
          <span className="hidden md:inline-flex items-center rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200/80 font-mono">
            RUT: {selectedCompanyObj.rutCompany}
          </span>
        )}
      </div>

      {/* Right: Authenticated User Info */}
      {user && (
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <span className="block text-xs font-bold text-[#37352F] leading-tight">
              {user.name}
            </span>
            <span className="block text-[10px] text-[#787774] capitalize font-medium">
              {user.role || 'Usuario'}
            </span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 border border-neutral-200 text-[#37352F]">
            <UserCircleIcon className="h-5 w-5 text-[#787774]" />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
