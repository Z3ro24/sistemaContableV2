import { Test, TestingModule } from '@nestjs/testing';
import { CatalogsController } from './catalogs.controller';
import { CatalogsService } from './catalogs.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('CatalogsController', () => {
  let controller: CatalogsController;
  let service: CatalogsService;

  const mockCatalogsService = {
    getLiveUf: jest.fn().mockResolvedValue({ valor: 40844.79, fecha: '2026-07-30T04:00:00.000Z' }),
    getAfps: jest.fn().mockResolvedValue([{ id: 1, name: 'Habitat' }]),
    getHealthInstitutions: jest.fn().mockResolvedValue([{ id: 1, name: 'Fonasa' }]),
    getContractTypes: jest.fn().mockResolvedValue([{ id: 1, name: 'Indefinido' }]),
    getBanks: jest.fn().mockResolvedValue([{ id: 1, name: 'Banco Estado' }]),
    getCostCenters: jest.fn().mockResolvedValue([]),
    getJobPositions: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogsController],
      providers: [
        {
          provide: CatalogsService,
          useValue: mockCatalogsService,
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CatalogsController>(CatalogsController);
    service = module.get<CatalogsService>(CatalogsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service getLiveUf', async () => {
    const result = await controller.getLiveUf();
    expect(result.valor).toBe(40844.79);
    expect(service.getLiveUf).toHaveBeenCalled();
  });

  it('should call service getAfps', async () => {
    const result = await controller.getAfps();
    expect(result).toHaveLength(1);
    expect(service.getAfps).toHaveBeenCalled();
  });
});
