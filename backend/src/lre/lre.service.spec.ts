import { Test, TestingModule } from '@nestjs/testing';
import { LreService } from './lre.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('LreService', () => {
  let service: LreService;
  let prismaService: any;

  const mockPrismaService = {
    payroll: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LreService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<LreService>(LreService);
    prismaService = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLreReport', () => {
    it('should throw BadRequestException if periodYyyyMm is missing', async () => {
      await expect(service.getLreReport('user-1', '')).rejects.toThrow(BadRequestException);
    });

    it('should calculate LRE metrics correctly for payrolls', async () => {
      const mockPayrolls = [
        {
          id: 101,
          periodYyyyMm: '2026-07',
          baseSalaryAgreed: 600000,
          totalTaxable: 650000,
          totalNonTaxable: 50000,
          totalLegalDeductions: 120000,
          totalOtherDeductions: 0,
          netPayable: 580000,
          afpHistoricalName: 'AFP Habitat',
          healthHistoricalName: 'Fonasa',
          worker: {
            rut: '15.678.901-2',
            name: 'Juan',
            paternalLastName: 'Pérez',
            maternalLastName: 'Soto',
            company: { name: 'Empresa Test' },
          },
          details: [
            { conceptCode: 'AFP', amount: 74100 },
            { conceptCode: 'SALUD', amount: 45500 },
          ],
        },
      ];

      mockPrismaService.payroll.findMany.mockResolvedValue(mockPayrolls);

      const res = await service.getLreReport('user-1', '2026-07', 1);

      expect(res.totalWorkers).toBe(1);
      expect(res.totalTaxable).toBe(650000);
      expect(res.totalNetPayable).toBe(580000);
      expect(res.records.length).toBe(1);
      expect(res.records[0].workerName).toBe('Juan Pérez Soto');
    });
  });

  describe('exportLreCsv', () => {
    it('should return a CSV string with semicolon delimiters', async () => {
      mockPrismaService.payroll.findMany.mockResolvedValue([]);

      const csv = await service.exportLreCsv('user-1', '2026-07');
      expect(csv).toContain('RUT_TRABAJADOR;NOMBRE_TRABAJADOR');
    });
  });
});
