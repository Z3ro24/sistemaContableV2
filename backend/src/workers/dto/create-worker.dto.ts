import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateWorkerDto {
  @IsNotEmpty({ message: 'El nombre del trabajador es requerido' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'El RUT del trabajador es requerido' })
  @IsString()
  rut: string;

  @IsOptional()
  @IsInt()
  companyId?: number;
}
