import { IsNotEmpty, IsOptional, IsString, IsInt, IsNumber } from 'class-validator';

export class CreateWorkerDto {
  @IsNotEmpty({ message: 'El nombre del trabajador es requerido' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  paternalLastName?: string;

  @IsOptional()
  @IsString()
  maternalLastName?: string;

  @IsNotEmpty({ message: 'El RUT del trabajador es requerido' })
  @IsString()
  rut: string;

  @IsOptional()
  @IsString()
  entryDate?: string;

  @IsOptional()
  @IsNumber()
  baseSalary?: number;

  @IsOptional()
  @IsInt()
  companyId?: number;

  @IsOptional()
  @IsInt()
  afpId?: number;

  @IsOptional()
  @IsInt()
  healthInstitutionId?: number;

  @IsOptional()
  @IsNumber()
  healthAgreedUf?: number;

  @IsOptional()
  @IsInt()
  contractTypeId?: number;

  @IsOptional()
  @IsInt()
  bankId?: number;

  @IsOptional()
  @IsString()
  bankAccountType?: string;

  @IsOptional()
  @IsString()
  bankAccountNumber?: string;

  @IsOptional()
  @IsInt()
  costCenterId?: number;

  @IsOptional()
  @IsInt()
  jobPositionId?: number;
}
