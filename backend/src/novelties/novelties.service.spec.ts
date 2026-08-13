import { Test, TestingModule } from '@nestjs/testing';
import { NoveltiesService } from './novelties.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('NoveltiesService', () => {
  let service: NoveltiesService;

  const mockPrismaService = {
    worker: {
      findFirst: jest.fn(),
    },
    monthlyNovelty: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoveltiesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<NoveltiesService>(NoveltiesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw NotFoundException if worker not found on findByWorkerAndPeriod', async () => {
    mockPrismaService.worker.findFirst.mockResolvedValue(null);
    await expect(service.findByWorkerAndPeriod('user-1', 99, '2026-07')).rejects.toThrow(NotFoundException);
  });

  it('should return default novelty if not saved yet', async () => {
    mockPrismaService.worker.findFirst.mockResolvedValue({ id: 1 });
    mockPrismaService.monthlyNovelty.findUnique.mockResolvedValue(null);

    const res = await service.findByWorkerAndPeriod('user-1', 1, '2026-07');
    expect(res.workedDays).toBe(30);
    expect(res.overtime50Hrs).toBe(0);
  });

  it('should throw BadRequestException if creating duplicate novelty', async () => {
    mockPrismaService.worker.findFirst.mockResolvedValue({ id: 1, name: 'Juan' });
    mockPrismaService.monthlyNovelty.findUnique.mockResolvedValue({ id: 10, workerId: 1, periodYyyyMm: '2026-07' });

    const dto = { workerId: 1, periodYyyyMm: '2026-07', workedDays: 28 };
    await expect(service.create('user-1', dto)).rejects.toThrow(BadRequestException);
  });

  it('should create new novelty when not existing', async () => {
    mockPrismaService.worker.findFirst.mockResolvedValue({ id: 1, name: 'Juan' });
    mockPrismaService.monthlyNovelty.findUnique.mockResolvedValue(null);
    mockPrismaService.monthlyNovelty.create.mockResolvedValue({ id: 15, workedDays: 28 });

    const dto = { workerId: 1, periodYyyyMm: '2026-07', workedDays: 28 };
    const res = await service.create('user-1', dto);

    expect(res.id).toBe(15);
    expect(mockPrismaService.monthlyNovelty.create).toHaveBeenCalled();
  });

  it('should delete novelty', async () => {
    mockPrismaService.monthlyNovelty.findFirst.mockResolvedValue({ id: 10 });
    mockPrismaService.monthlyNovelty.delete.mockResolvedValue({ id: 10 });

    const res = await service.delete('user-1', 10);
    expect(res.id).toBe(10);
    expect(mockPrismaService.monthlyNovelty.delete).toHaveBeenCalled();
  });
});
