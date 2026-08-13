import { IsInt, IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpsertNoveltyDto {
  @Type(() => Number)
  @IsInt()
  workerId: number;

  @IsString()
  periodYyyyMm: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(30)
  workedDays?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sickLeaveDays?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  absenceDays?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  overtime50Hrs?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  overtime100Hrs?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  familyDependentsCount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  otherTaxableIncome?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  otherNonTaxableIncome?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  otherDeductions?: number;
}
