import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyParametersService } from './monthly-parameters.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('MonthlyParametersService', () => {
  let service: MonthlyParametersService;
  let prisma: PrismaService;

  const mockParameter = {
    id: 1,
    periodYyyyMm: '2026-07',
    ufClosingValue: 38500,
    utmValue: 67500,
    minimumWage: 500000,
    afpCappingUf: 84.3,
    afcCappingUf: 126.6,
    sisRate: 1.54,
    userId: 'user-123',
    uniqueTaxBrackets: [],
    familyAllowanceBrackets: [],
  };

  const mockPrismaService = {
    monthlyParameter: {
      findUnique: jest.fn(),
      findMany: jest.fn().mockResolvedValue([mockParameter]),
      findFirst: jest.fn().mockResolvedValue(mockParameter),
      create: jest.fn().mockResolvedValue(mockParameter),
      update: jest.fn().mockResolvedValue(mockParameter),
      delete: jest.fn().mockResolvedValue(mockParameter),
    },
    uniqueTaxBracket: {
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    familyAllowanceBracket: {
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonthlyParametersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MonthlyParametersService>(MonthlyParametersService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create monthly parameters if period does not exist', async () => {
    (mockPrismaService.monthlyParameter.findUnique as jest.Mock).mockResolvedValue(null);

    const dto = {
      periodYyyyMm: '2026-08',
      ufClosingValue: 38500,
      utmValue: 67500,
      minimumWage: 500000,
      afpCappingUf: 84.3,
      afcCappingUf: 126.6,
      sisRate: 1.54,
      uniqueTaxBrackets: [],
      familyAllowanceBrackets: [],
    };

    const result = await service.create('user-123', dto);
    expect(result).toBeDefined();
    expect(result.periodYyyyMm).toBe('2026-07');
  });

  it('should throw ConflictException if period already exists', async () => {
    (mockPrismaService.monthlyParameter.findUnique as jest.Mock).mockResolvedValue(mockParameter);

    const dto = {
      periodYyyyMm: '2026-07',
      ufClosingValue: 38500,
      utmValue: 67500,
      minimumWage: 500000,
      afpCappingUf: 84.3,
      afcCappingUf: 126.6,
      sisRate: 1.54,
      uniqueTaxBrackets: [],
      familyAllowanceBrackets: [],
    };

    await expect(service.create('user-123', dto)).rejects.toThrow(ConflictException);
  });

  it('should return all monthly parameters for a user', async () => {
    const list = await service.findAll('user-123');
    expect(list).toHaveLength(1);
    expect(prisma.monthlyParameter.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-123' },
      orderBy: { periodYyyyMm: 'desc' },
      include: {
        uniqueTaxBrackets: { orderBy: { bracketNumber: 'asc' } },
        familyAllowanceBrackets: { orderBy: { bracketLetter: 'asc' } },
      },
    });
  });

  it('should find parameter by period', async () => {
    (mockPrismaService.monthlyParameter.findUnique as jest.Mock).mockResolvedValue(mockParameter);

    const param = await service.findByPeriod('user-123', '2026-07');
    expect(param.periodYyyyMm).toBe('2026-07');
  });

  it('should throw NotFoundException if parameter by period is not found', async () => {
    (mockPrismaService.monthlyParameter.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.findByPeriod('user-123', '2025-01')).rejects.toThrow(NotFoundException);
  });
});
