import { Test, TestingModule } from '@nestjs/testing';
import { LreController } from './lre.controller';
import { LreService } from './lre.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('LreController', () => {
  let controller: LreController;
  let service: LreService;

  const mockLreService = {
    getLreReport: jest.fn(),
    exportLreCsv: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LreController],
      providers: [
        { provide: LreService, useValue: mockLreService },
        { provide: JwtService, useValue: {} },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<LreController>(LreController);
    service = module.get<LreService>(LreService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLreReport', () => {
    it('should call service.getLreReport', async () => {
      const mockResult = { totalWorkers: 2, records: [] } as any;
      mockLreService.getLreReport.mockResolvedValue(mockResult);

      const res = await controller.getLreReport('user-1', '2026-07', '1');
      expect(service.getLreReport).toHaveBeenCalledWith('user-1', '2026-07', 1);
      expect(res).toEqual(mockResult);
    });
  });

  describe('exportLreCsv', () => {
    it('should set headers and return CSV stream data', async () => {
      mockLreService.exportLreCsv.mockResolvedValue('HEADER;DATA');

      const res = {
        setHeader: jest.fn(),
        send: jest.fn().mockImplementation((data) => data),
      } as any;

      await controller.exportLreCsv('user-1', '2026-07', '1', res);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv; charset=utf-8');
      expect(res.send).toHaveBeenCalledWith('HEADER;DATA');
    });
  });
});
