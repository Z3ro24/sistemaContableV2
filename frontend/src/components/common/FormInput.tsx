import React from 'react';
import { Field, Label, Input, Description } from '@headlessui/react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: string;
  description?: string;
  autoComplete?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  register,
  error,
  description,
  autoComplete,
}) => {
  return (
    <Field className="space-y-1.5">
      <Label htmlFor={id} className="block text-[11px] font-semibold uppercase tracking-wider text-[#787774]">
        {label}
      </Label>

      <div className="relative">
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...register}
          className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#37352F] placeholder-neutral-400 shadow-sm backdrop-blur-md transition-all duration-200 outline-none ${
            error
              ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
              : 'border-white/80 bg-white/60 focus:bg-white/90 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 hover:border-neutral-300'
          }`}
        />
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon className="h-4 w-4 text-rose-500" />
          </div>
        )}
      </div>

      {description && !error && (
        <Description className="text-xs text-[#787774]">{description}</Description>
      )}

      {error && (
        <p className="flex items-center gap-1 text-xs font-medium text-rose-600">
          <span>{error}</span>
        </p>
      )}
    </Field>
  );
};

export default FormInput;
