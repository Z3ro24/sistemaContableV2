import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'El nombre de la empresa es requerido' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'El RUT de la empresa es requerido' })
  @IsString()
  rutCompany: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  digitalCertificateId?: number;
}
