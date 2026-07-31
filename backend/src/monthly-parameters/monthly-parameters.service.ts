import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMonthlyParameterDto } from './dto/create-monthly-parameter.dto';

@Injectable()
export class MonthlyParametersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateMonthlyParameterDto) {
    const existing = await this.prisma.monthlyParameter.findUnique({
      where: {
        periodYyyyMm_userId: {
          periodYyyyMm: dto.periodYyyyMm,
          userId,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Ya existen parámetros configurados para el período ${dto.periodYyyyMm}`);
    }

    return this.prisma.monthlyParameter.create({
      data: {
        periodYyyyMm: dto.periodYyyyMm,
        ufClosingValue: dto.ufClosingValue,
        utmValue: dto.utmValue,
        minimumWage: dto.minimumWage,
        afpCappingUf: dto.afpCappingUf,
        afcCappingUf: dto.afcCappingUf,
        sisRate: dto.sisRate,
        userId,
        uniqueTaxBrackets: {
          create: dto.uniqueTaxBrackets.map((b) => ({
            bracketNumber: b.bracketNumber,
            fromUtm: b.fromUtm,
            toUtm: b.toUtm ?? null,
            factor: b.factor,
            deductionUtm: b.deductionUtm,
          })),
        },
        familyAllowanceBrackets: {
          create: dto.familyAllowanceBrackets.map((f) => ({
            bracketLetter: f.bracketLetter,
            incomeFrom: f.incomeFrom,
            incomeTo: f.incomeTo,
            amountPerDependent: f.amountPerDependent,
          })),
        },
      },
      include: {
        uniqueTaxBrackets: true,
        familyAllowanceBrackets: true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.monthlyParameter.findMany({
      where: { userId },
      orderBy: { periodYyyyMm: 'desc' },
      include: {
        uniqueTaxBrackets: { orderBy: { bracketNumber: 'asc' } },
        familyAllowanceBrackets: { orderBy: { bracketLetter: 'asc' } },
      },
    });
  }

  async findByPeriod(userId: string, periodYyyyMm: string) {
    const parameter = await this.prisma.monthlyParameter.findUnique({
      where: {
        periodYyyyMm_userId: {
          periodYyyyMm,
          userId,
        },
      },
      include: {
        uniqueTaxBrackets: { orderBy: { bracketNumber: 'asc' } },
        familyAllowanceBrackets: { orderBy: { bracketLetter: 'asc' } },
      },
    });

    if (!parameter) {
      throw new NotFoundException(`No existen parámetros para el período ${periodYyyyMm}`);
    }

    return parameter;
  }

  async delete(userId: string, id: number) {
    const existing = await this.prisma.monthlyParameter.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Parámetro mensual no encontrado');
    }

    return this.prisma.monthlyParameter.delete({
      where: { id },
    });
  }
}
