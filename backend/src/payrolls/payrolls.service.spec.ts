import { Test, TestingModule } from '@nestjs/testing';
import { PayrollsService } from './payrolls.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PayrollsService', () => {
  let service: PayrollsService;

  const mockWorker = {
    id: 1,
    name: 'Juan',
    paternalLastName: 'Pérez',
    rut: '12.345.678-9',
    baseSalary: 600000,
    healthAgreedUf: 0,
    userId: 'user-123',
    company: { id: 1, name: 'Empresa Test' },
    afp: { id: 1, name: 'Habitat', commissionRate: 1.27 },
    healthInstitution: { id: 1, name: 'Fonasa', isIsapre: false },
    contractType: { id: 1, name: 'Indefinido', afcWorkerDiscount: true },
  };

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
    uniqueTaxBrackets: [
      { bracketNumber: 1, fromUtm: 0.0, toUtm: 13.5, factor: 0.0, deductionUtm: 0.0 },
      { bracketNumber: 2, fromUtm: 13.5, toUtm: 30.0, factor: 0.04, deductionUtm: 0.54 },
    ],
    familyAllowanceBrackets: [
      { bracketLetter: 'A', incomeFrom: 0, incomeTo: 600000, amountPerDependent: 20000 },
    ],
  };

  const mockPayrollResult = {
    id: 100,
    workerId: 1,
    periodYyyyMm: '2026-07',
    baseSalaryAgreed: 600000,
    totalTaxable: 600000,
    totalNonTaxable: 0,
    totalLegalDeductions: 113220,
    totalOtherDeductions: 0,
    netPayable: 486780,
    afpHistoricalName: 'Habitat',
    afpHistoricalRate: 11.27,
    healthHistoricalName: 'Fonasa',
    details: [],
    worker: mockWorker,
  };

  const mockPrismaService = {
    worker: {
      findFirst: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 1 && where.userId === 'user-123') {
          return Promise.resolve(mockWorker);
        }
        return Promise.resolve(null);
      }),
    },
    monthlyParameter: {
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.periodYyyyMm_userId?.periodYyyyMm === '2026-07') {
          return Promise.resolve(mockParameter);
        }
        return Promise.resolve(null);
      }),
    },
    monthlyNovelty: {
      upsert: jest.fn().mockResolvedValue({ id: 1 }),
    },
    payroll: {
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(mockPayrollResult),
      findMany: jest.fn().mockResolvedValue([mockPayrollResult]),
      findFirst: jest.fn().mockResolvedValue(mockPayrollResult),
      delete: jest.fn().mockResolvedValue(mockPayrollResult),
    },
    payrollDetail: {
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayrollsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PayrollsService>(PayrollsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw NotFoundException if worker does not exist', async () => {
    await expect(
      service.calculateAndSave('user-123', { workerId: 999, periodYyyyMm: '2026-07' })
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if monthly parameters are missing for period', async () => {
    await expect(
      service.calculateAndSave('user-123', { workerId: 1, periodYyyyMm: '2025-01' })
    ).rejects.toThrow(BadRequestException);
  });

  it('should calculate Chilean payroll correctly', async () => {
    const dto = {
      workerId: 1,
      periodYyyyMm: '2026-07',
      workedDays: 30,
      overtime50Hrs: 0,
      overtime100Hrs: 0,
      familyDependentsCount: 0,
    };

    const result = await service.calculateAndSave('user-123', dto);
    expect(result).toBeDefined();
    expect(result.netPayable).toBeGreaterThan(0);
    expect(result.worker.name).toBe('Juan');
  });

  it('should list payrolls for a user', async () => {
    const payrolls = await service.findAll('user-123', '2026-07');
    expect(payrolls).toHaveLength(1);
    expect(payrolls[0].periodYyyyMm).toBe('2026-07');
  });

  it('should delete payroll by id', async () => {
    const deleted = await service.delete('user-123', 100);
    expect(deleted.id).toBe(100);
  });
});
