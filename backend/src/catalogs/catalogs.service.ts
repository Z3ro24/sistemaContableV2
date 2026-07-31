import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAfps() {
    return this.prisma.afp.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getHealthInstitutions() {
    return this.prisma.healthInstitution.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getContractTypes() {
    return this.prisma.contractType.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getBanks() {
    return this.prisma.bank.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getCostCenters() {
    return this.prisma.costCenter.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getJobPositions() {
    return this.prisma.jobPosition.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
