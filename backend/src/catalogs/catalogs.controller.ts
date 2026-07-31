import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CatalogsService } from './catalogs.service';

@Controller('catalogs')
@UseGuards(AuthGuard)
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @Get('uf-live')
  getLiveUf() {
    return this.catalogsService.getLiveUf();
  }

  @Get('afp')
  getAfps() {
    return this.catalogsService.getAfps();
  }

  @Get('health-institutions')
  getHealthInstitutions() {
    return this.catalogsService.getHealthInstitutions();
  }

  @Get('contract-types')
  getContractTypes() {
    return this.catalogsService.getContractTypes();
  }

  @Get('banks')
  getBanks() {
    return this.catalogsService.getBanks();
  }

  @Get('cost-centers')
  getCostCenters() {
    return this.catalogsService.getCostCenters();
  }

  @Get('job-positions')
  getJobPositions() {
    return this.catalogsService.getJobPositions();
  }
}
