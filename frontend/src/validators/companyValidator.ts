import { z } from 'zod';
import { validateRut } from '../utils/rutUtils';

export const companySchema = z.object({
  name: z.string().min(1, 'El nombre de la empresa es obligatorio').trim(),
  rutCompany: z
    .string()
    .min(1, 'El RUT de la empresa es obligatorio')
    .refine((val) => validateRut(val), {
      message: 'El RUT ingresado no es válido (ej: 76.123.456-7)',
    }),
});

export type CompanyFormData = z.infer<typeof companySchema>;
