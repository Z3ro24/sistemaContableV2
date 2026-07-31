import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyParametersController } from './monthly-parameters.controller';
import { MonthlyParametersService } from './monthly-parameters.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('MonthlyParametersController', () => {
  let controller: MonthlyParametersController;
  let service: MonthlyParametersService;

  const mockService = {
    create: jest.fn().mockResolvedValue({ id: 1, periodYyyyMm: '2026-07' }),
    findAll: jest.fn().mockResolvedValue([{ id: 1, periodYyyyMm: '2026-07' }]),
    findByPeriod: jest.fn().mockResolvedValue({ id: 1, periodYyyyMm: '2026-07' }),
    delete: jest.fn().mockResolvedValue({ id: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonthlyParametersController],
      providers: [
        {
          provide: MonthlyParametersService,
          useValue: mockService,
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

    controller = module.get<MonthlyParametersController>(MonthlyParametersController);
    service = module.get<MonthlyParametersService>(MonthlyParametersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create monthly parameter', async () => {
    const dto: any = { periodYyyyMm: '2026-07', ufClosingValue: 38500 };
    const res = await controller.create('user-123', dto);
    expect(res.periodYyyyMm).toBe('2026-07');
    expect(service.create).toHaveBeenCalledWith('user-123', dto);
  });

  it('should find all monthly parameters', async () => {
    const res = await controller.findAll('user-123');
    expect(res).toHaveLength(1);
    expect(service.findAll).toHaveBeenCalledWith('user-123');
  });
});
