import { Test, TestingModule } from '@nestjs/testing';
import { CatalogsService } from './catalogs.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CatalogsService', () => {
  let service: CatalogsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    afp: {
      findMany: jest.fn().mockResolvedValue([{ id: 1, name: 'Habitat', commissionRate: 1.27 }]),
    },
    healthInstitution: {
      findMany: jest.fn().mockResolvedValue([{ id: 1, name: 'Fonasa', isIsapre: false }]),
    },
    contractType: {
      findMany: jest.fn().mockResolvedValue([{ id: 1, name: 'Indefinido', afcWorkerDiscount: true }]),
    },
    bank: {
      findMany: jest.fn().mockResolvedValue([{ id: 1, name: 'Banco Estado' }]),
    },
    costCenter: {
      findMany: jest.fn().mockResolvedValue([{ id: 1, name: 'Administración' }]),
    },
    jobPosition: {
      findMany: jest.fn().mockResolvedValue([{ id: 1, name: 'Contador General' }]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CatalogsService>(CatalogsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return AFPs sorted by name', async () => {
    const afps = await service.getAfps();
    expect(afps).toHaveLength(1);
    expect(afps[0].name).toBe('Habitat');
    expect(prisma.afp.findMany).toHaveBeenCalledWith({ orderBy: { name: 'asc' } });
  });

  it('should return health institutions', async () => {
    const health = await service.getHealthInstitutions();
    expect(health).toHaveLength(1);
    expect(health[0].name).toBe('Fonasa');
  });

  it('should return contract types', async () => {
    const contracts = await service.getContractTypes();
    expect(contracts).toHaveLength(1);
    expect(contracts[0].name).toBe('Indefinido');
  });

  it('should return banks', async () => {
    const banks = await service.getBanks();
    expect(banks).toHaveLength(1);
    expect(banks[0].name).toBe('Banco Estado');
  });

  it('should return live UF value and date structure', async () => {
    const uf = await service.getLiveUf();
    expect(uf).toHaveProperty('valor');
    expect(uf).toHaveProperty('fecha');
    expect(typeof uf.valor).toBe('number');
  });
});
