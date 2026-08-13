import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('CompaniesService', () => {
  let service: CompaniesService;

  const mockCompany = {
    id: 1,
    name: 'Contabilidad SpA',
    rutCompany: '76.123.456-0',
    address: 'Av. Providencia 1234',
    userId: 'user-123',
    _count: { workers: 5 },
  };

  const mockPrismaService = {
    company: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn().mockResolvedValue([mockCompany]),
      create: jest.fn().mockResolvedValue(mockCompany),
      update: jest.fn().mockResolvedValue(mockCompany),
      delete: jest.fn().mockResolvedValue(mockCompany),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException for invalid RUT Company', async () => {
    const dto: any = { name: 'Test SpA', rutCompany: '76.123.456-9' };
    await expect(service.create('user-123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should create a company with valid RUT and address', async () => {
    (mockPrismaService.company.findUnique as jest.Mock).mockResolvedValue(null);
    const dto = { name: 'Contabilidad SpA', rutCompany: '76.123.456-0', address: 'Av. Providencia 1234' };
    const result = await service.create('user-123', dto);
    expect(result.name).toBe('Contabilidad SpA');
  });

  it('should return all companies for a user', async () => {
    const list = await service.findAll('user-123');
    expect(list).toHaveLength(1);
  });

  it('should remove a company', async () => {
    (mockPrismaService.company.findFirst as jest.Mock).mockResolvedValue(mockCompany);
    const deleted = await service.remove('user-123', 1);
    expect(deleted.id).toBe(1);
  });
});
