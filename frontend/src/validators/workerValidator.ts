import { z } from 'zod';
import { validateRut } from '../utils/rutUtils';

export const workerSchema = z.object({
  name: z.string().min(1, 'El nombre completo es obligatorio').trim(),
  rut: z
    .string()
    .min(1, 'El RUT de la persona es obligatorio')
    .refine((val) => validateRut(val), {
      message: 'El RUT ingresado no es válido (ej: 19.876.543-2)',
    }),
  companyId: z.string().optional().nullable(),
});

export type WorkerFormData = z.infer<typeof workerSchema>;
