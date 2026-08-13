import { Test, TestingModule } from '@nestjs/testing';
import { ExportLogsService } from './export-logs.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ExportLogsService', () => {
  let service: ExportLogsService;

  const mockPrismaService = {
    exportLog: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExportLogsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ExportLogsService>(ExportLogsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an export log', async () => {
    const dto = {
      userId: 'user-1',
      exportType: 'PREVIRED_TXT',
      periodYyyyMm: '2026-07',
      recordCount: 5,
      totalAmount: 1000000,
      filename: 'PreviRed.txt',
    };
    mockPrismaService.exportLog.create.mockResolvedValue({ id: 1, ...dto });

    const res = await service.create(dto);
    expect(res.id).toBe(1);
    expect(mockPrismaService.exportLog.create).toHaveBeenCalled();
  });

  it('should find all export logs for user', async () => {
    mockPrismaService.exportLog.findMany.mockResolvedValue([{ id: 1, exportType: 'PREVIRED_TXT' }]);

    const res = await service.findAll('user-1', 'PREVIRED_TXT');
    expect(res.length).toBe(1);
    expect(mockPrismaService.exportLog.findMany).toHaveBeenCalled();
  });
});
