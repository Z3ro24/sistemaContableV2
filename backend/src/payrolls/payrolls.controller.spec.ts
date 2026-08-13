import { Test, TestingModule } from '@nestjs/testing';
import { PayrollsController } from './payrolls.controller';
import { PayrollsService } from './payrolls.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('PayrollsController', () => {
  let controller: PayrollsController;
  let service: PayrollsService;

  const mockService = {
    calculateAndSave: jest.fn().mockResolvedValue({ id: 1, netPayable: 500000 }),
    findAll: jest.fn().mockResolvedValue([{ id: 1, netPayable: 500000 }]),
    findOne: jest.fn().mockResolvedValue({ id: 1, netPayable: 500000 }),
    delete: jest.fn().mockResolvedValue({ id: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayrollsController],
      providers: [
        {
          provide: PayrollsService,
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

    controller = module.get<PayrollsController>(PayrollsController);
    service = module.get<PayrollsService>(PayrollsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should calculate and save payroll', async () => {
    const dto: any = { workerId: 1, periodYyyyMm: '2026-07' };
    const res = await controller.calculateAndSave('user-123', dto);
    expect(res.netPayable).toBe(500000);
    expect(service.calculateAndSave).toHaveBeenCalledWith('user-123', dto);
  });

  it('should find all payrolls', async () => {
    const res = await controller.findAll('user-123', '2026-07', '1');
    expect(res).toHaveLength(1);
    expect(service.findAll).toHaveBeenCalledWith('user-123', '2026-07', 1);
  });

  it('should delete payroll', async () => {
    const res = await controller.delete('user-123', 1);
    expect(res.id).toBe(1);
    expect(service.delete).toHaveBeenCalledWith('user-123', 1);
  });
});
