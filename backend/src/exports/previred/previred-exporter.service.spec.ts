import { Test, TestingModule } from '@nestjs/testing';
import { PreviredExporterService } from './previred-exporter.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ExportLogsService } from '../export-logs/export-logs.service';
import { BadRequestException } from '@nestjs/common';

describe('PreviredExporterService', () => {
  let service: PreviredExporterService;

  const mockPrismaService = {
    payroll: {
      findMany: jest.fn(),
    },
  };

  const mockExportLogsService = {
    create: jest.fn().mockResolvedValue({ id: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreviredExporterService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ExportLogsService, useValue: mockExportLogsService },
      ],
    }).compile();

    service = module.get<PreviredExporterService>(PreviredExporterService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if periodYyyyMm is missing', async () => {
    await expect(service.generatePreviredTxt('user-1', '')).rejects.toThrow(BadRequestException);
  });

  it('should generate PreviRed 105-column txt content and persist log', async () => {
    mockPrismaService.payroll.findMany.mockResolvedValue([
      {
        id: 1,
        periodYyyyMm: '2026-07',
        totalTaxable: 600000,
        netPayable: 500000,
        worker: {
          rut: '12.345.678-9',
          name: 'Juan',
          paternalLastName: 'Pérez',
          afp: { previredCode: '05' },
          healthInstitution: { previredCode: '01' },
          company: { name: 'Empresa Test' },
        },
        details: [
          { conceptCode: 'AFP', amount: 60000 },
          { conceptCode: 'SALUD', amount: 42000 },
        ],
      },
    ]);

    const txt = await service.generatePreviredTxt('user-1', '2026-07', 1);

    expect(txt).toContain('0123456789Juan Pérez');
    expect(mockExportLogsService.create).toHaveBeenCalled();
  });
});
