import { IsString, IsNotEmpty, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UniqueTaxBracketDto {
  @IsNumber()
  bracketNumber: number;

  @IsNumber()
  fromUtm: number;

  @IsOptional()
  @IsNumber()
  toUtm?: number;

  @IsNumber()
  factor: number;

  @IsNumber()
  deductionUtm: number;
}

export class FamilyAllowanceBracketDto {
  @IsString()
  bracketLetter: string;

  @IsNumber()
  incomeFrom: number;

  @IsNumber()
  incomeTo: number;

  @IsNumber()
  amountPerDependent: number;
}

export class CreateMonthlyParameterDto {
  @IsString()
  @IsNotEmpty()
  periodYyyyMm: string; // e.g., '2026-07'

  @IsNumber()
  ufClosingValue: number;

  @IsNumber()
  utmValue: number;

  @IsNumber()
  minimumWage: number;

  @IsNumber()
  afpCappingUf: number;

  @IsNumber()
  afcCappingUf: number;

  @IsNumber()
  sisRate: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UniqueTaxBracketDto)
  uniqueTaxBrackets: UniqueTaxBracketDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FamilyAllowanceBracketDto)
  familyAllowanceBrackets: FamilyAllowanceBracketDto[];
}
