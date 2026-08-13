import { Test, TestingModule } from '@nestjs/testing';
import { NoveltiesController } from './novelties.controller';
import { NoveltiesService } from './novelties.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('NoveltiesController', () => {
  let controller: NoveltiesController;
  let service: NoveltiesService;

  const mockService = {
    findAll: jest.fn().mockResolvedValue([{ id: 1, workedDays: 30 }]),
    findByWorkerAndPeriod: jest.fn().mockResolvedValue({ workedDays: 30 }),
    create: jest.fn().mockResolvedValue({ id: 1, workedDays: 28 }),
    update: jest.fn().mockResolvedValue({ id: 1, workedDays: 25 }),
    delete: jest.fn().mockResolvedValue({ id: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoveltiesController],
      providers: [
        { provide: NoveltiesService, useValue: mockService },
        { provide: JwtService, useValue: {} },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<NoveltiesController>(NoveltiesController);
    service = module.get<NoveltiesService>(NoveltiesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should list all novelties', async () => {
    const res = await controller.findAll('user-1', '2026-07');
    expect(res).toHaveLength(1);
    expect(service.findAll).toHaveBeenCalledWith('user-1', '2026-07', undefined);
  });

  it('should create a novelty', async () => {
    const dto = { workerId: 1, periodYyyyMm: '2026-07', workedDays: 28 };
    const res = await controller.create('user-1', dto);
    expect(res.id).toBe(1);
    expect(service.create).toHaveBeenCalledWith('user-1', dto);
  });

  it('should delete a novelty', async () => {
    const res = await controller.delete('user-1', 1);
    expect(res.id).toBe(1);
    expect(service.delete).toHaveBeenCalledWith('user-1', 1);
  });
});
