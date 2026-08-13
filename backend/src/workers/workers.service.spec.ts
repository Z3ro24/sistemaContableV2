import { Test, TestingModule } from '@nestjs/testing';
import { WorkersService } from './workers.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('WorkersService', () => {
  let service: WorkersService;

  const mockWorker = {
    id: 1,
    name: 'Carlos',
    paternalLastName: 'González',
    maternalLastName: 'López',
    rut: '12.345.678-5',
    entryDate: new Date('2024-01-15'),
    baseSalary: 750000,
    companyId: 1,
    afpId: 1,
    healthInstitutionId: 1,
    healthAgreedUf: 2.5,
    contractTypeId: 1,
    bankId: 1,
    bankAccountType: 'Cuenta Corriente',
    bankAccountNumber: '12345678',
    userId: 'user-123',
    company: { id: 1, name: 'Empresa Test' },
    afp: { id: 1, name: 'Habitat' },
    healthInstitution: { id: 1, name: 'Fonasa' },
    contractType: { id: 1, name: 'Indefinido' },
    bank: { id: 1, name: 'Banco Estado' },
  };

  const mockPrismaService = {
    worker: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn().mockResolvedValue([mockWorker]),
      create: jest.fn().mockResolvedValue(mockWorker),
      update: jest.fn().mockResolvedValue(mockWorker),
      delete: jest.fn().mockResolvedValue(mockWorker),
    },
    company: {
      findFirst: jest.fn().mockResolvedValue({ id: 1, name: 'Empresa Test' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<WorkersService>(WorkersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if RUT is invalid', async () => {
    const dto: any = { name: 'Carlos', rut: '12.345.678-K' }; // Invalid RUT checksum
    await expect(service.create('user-123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if RUT already registered for user', async () => {
    (mockPrismaService.worker.findUnique as jest.Mock).mockResolvedValue(mockWorker);
    const dto: any = { name: 'Carlos', rut: '12.345.678-5' };
    await expect(service.create('user-123', dto)).rejects.toThrow(BadRequestException);
  });

  it('should create a new worker with full attributes', async () => {
    (mockPrismaService.worker.findUnique as jest.Mock).mockResolvedValue(null);
    const dto = {
      name: 'Carlos',
      paternalLastName: 'González',
      rut: '12.345.678-5',
      baseSalary: 750000,
      companyId: 1,
    };

    const result = await service.create('user-123', dto);
    expect(result).toBeDefined();
    expect(result.name).toBe('Carlos');
  });

  it('should return all workers for a user', async () => {
    const workers = await service.findAll('user-123');
    expect(workers).toHaveLength(1);
    expect(workers[0].name).toBe('Carlos');
  });

  it('should find a worker by id', async () => {
    (mockPrismaService.worker.findFirst as jest.Mock).mockResolvedValue(mockWorker);
    const worker = await service.findOne('user-123', 1);
    expect(worker.id).toBe(1);
  });

  it('should throw NotFoundException if worker not found', async () => {
    (mockPrismaService.worker.findFirst as jest.Mock).mockResolvedValue(null);
    await expect(service.findOne('user-123', 99)).rejects.toThrow(NotFoundException);
  });

  it('should remove a worker', async () => {
    (mockPrismaService.worker.findFirst as jest.Mock).mockResolvedValue(mockWorker);
    const removed = await service.remove('user-123', 1);
    expect(removed.id).toBe(1);
  });
});
