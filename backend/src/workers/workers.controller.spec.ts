import { Test, TestingModule } from '@nestjs/testing';
import { WorkersController } from './workers.controller';
import { WorkersService } from './workers.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('WorkersController', () => {
  let controller: WorkersController;
  let service: WorkersService;

  const mockWorker = { id: 1, name: 'Carlos', rut: '12.345.678-5' };

  const mockWorkersService = {
    create: jest.fn().mockResolvedValue(mockWorker),
    findAll: jest.fn().mockResolvedValue([mockWorker]),
    findOne: jest.fn().mockResolvedValue(mockWorker),
    update: jest.fn().mockResolvedValue(mockWorker),
    remove: jest.fn().mockResolvedValue(mockWorker),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkersController],
      providers: [
        {
          provide: WorkersService,
          useValue: mockWorkersService,
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

    controller = module.get<WorkersController>(WorkersController);
    service = module.get<WorkersService>(WorkersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a worker', async () => {
    const dto: any = { name: 'Carlos', rut: '12.345.678-5' };
    const res = await controller.create('user-123', dto);
    expect(res.name).toBe('Carlos');
    expect(service.create).toHaveBeenCalledWith('user-123', dto);
  });

  it('should find all workers', async () => {
    const res = await controller.findAll('user-123');
    expect(res).toHaveLength(1);
    expect(service.findAll).toHaveBeenCalledWith('user-123');
  });

  it('should find one worker', async () => {
    const res = await controller.findOne('user-123', 1);
    expect(res.id).toBe(1);
    expect(service.findOne).toHaveBeenCalledWith('user-123', 1);
  });

  it('should remove a worker', async () => {
    const res = await controller.remove('user-123', 1);
    expect(res.id).toBe(1);
    expect(service.remove).toHaveBeenCalledWith('user-123', 1);
  });
});
