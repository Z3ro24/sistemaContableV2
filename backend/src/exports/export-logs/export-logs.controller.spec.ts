import { Test, TestingModule } from '@nestjs/testing';
import { ExportLogsController } from './export-logs.controller';
import { ExportLogsService } from './export-logs.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('ExportLogsController', () => {
  let controller: ExportLogsController;
  let service: ExportLogsService;

  const mockService = {
    findAll: jest.fn().mockResolvedValue([{ id: 1, exportType: 'PREVIRED_TXT' }]),
    findOne: jest.fn().mockResolvedValue({ id: 1, filename: 'file.txt', fileData: 'CONTENT' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExportLogsController],
      providers: [
        { provide: ExportLogsService, useValue: mockService },
        { provide: JwtService, useValue: {} },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ExportLogsController>(ExportLogsController);
    service = module.get<ExportLogsService>(ExportLogsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all export logs', async () => {
    const res = await controller.findAll('user-1', 'PREVIRED_TXT', '2026-07');
    expect(res).toHaveLength(1);
    expect(service.findAll).toHaveBeenCalledWith('user-1', 'PREVIRED_TXT', '2026-07', undefined);
  });

  it('should redownload archived file', async () => {
    const res = {
      setHeader: jest.fn(),
      send: jest.fn().mockImplementation((data) => data),
    } as any;

    await controller.redownload('user-1', 1, res);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain; charset=utf-8');
    expect(res.send).toHaveBeenCalledWith('CONTENT');
  });
});
