import { IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CalculatePayrollDto {
  @IsNumber()
  workerId: number;

  @IsString()
  @IsNotEmpty()
  periodYyyyMm: string; // e.g. '2026-07'

  @IsOptional()
  @IsNumber()
  workedDays?: number; // Default 30

  @IsOptional()
  @IsNumber()
  sickLeaveDays?: number; // Default 0

  @IsOptional()
  @IsNumber()
  absenceDays?: number; // Default 0

  @IsOptional()
  @IsNumber()
  overtime50Hrs?: number; // Default 0.0

  @IsOptional()
  @IsNumber()
  overtime100Hrs?: number; // Default 0.0

  @IsOptional()
  @IsNumber()
  familyDependentsCount?: number; // Default 0

  @IsOptional()
  @IsNumber()
  otherTaxableIncome?: number; // Default 0

  @IsOptional()
  @IsNumber()
  otherNonTaxableIncome?: number; // Default 0

  @IsOptional()
  @IsNumber()
  otherDeductions?: number; // Default 0
}
