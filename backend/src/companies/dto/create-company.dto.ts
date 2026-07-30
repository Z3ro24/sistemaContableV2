import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'El nombre de la empresa es requerido' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'El RUT de la empresa es requerido' })
  @IsString()
  rutCompany: string;
}
