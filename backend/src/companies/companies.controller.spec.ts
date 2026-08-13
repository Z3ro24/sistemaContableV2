import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let service: CompaniesService;

  const mockCompany = { id: 1, name: 'Contabilidad SpA', rutCompany: '76.123.456-7' };

  const mockCompaniesService = {
    create: jest.fn().mockResolvedValue(mockCompany),
    findAll: jest.fn().mockResolvedValue([mockCompany]),
    findOne: jest.fn().mockResolvedValue(mockCompany),
    update: jest.fn().mockResolvedValue(mockCompany),
    remove: jest.fn().mockResolvedValue(mockCompany),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        {
          provide: CompaniesService,
          useValue: mockCompaniesService,
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

    controller = module.get<CompaniesController>(CompaniesController);
    service = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a company', async () => {
    const dto: any = { name: 'Contabilidad SpA', rutCompany: '76.123.456-7' };
    const res = await controller.create('user-123', dto);
    expect(res.name).toBe('Contabilidad SpA');
  });

  it('should find all companies', async () => {
    const res = await controller.findAll('user-123');
    expect(res).toHaveLength(1);
  });
});
