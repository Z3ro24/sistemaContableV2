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

  async getLiveUf() {
    try {
      const response = await fetch('https://mindicador.cl/api/uf');
      if (response.ok) {
        const data = await response.json();
        if (data.serie && data.serie.length > 0) {
          return {
            valor: data.serie[0].valor,
            fecha: data.serie[0].fecha,
          };
        }
        if (data.uf && data.uf.valor) {
          return {
            valor: data.uf.valor,
            fecha: data.uf.fecha,
          };
        }
      }
    } catch (e) {
      // Fallback
    }

    try {
      const mainResponse = await fetch('https://mindicador.cl/api');
      if (mainResponse.ok) {
        const mainData = await mainResponse.json();
        if (mainData.uf && mainData.uf.valor) {
          return {
            valor: mainData.uf.valor,
            fecha: mainData.uf.fecha,
          };
        }
      }
    } catch (e) {
      // Fallback
    }

    // Default fallback if mindicador is offline
    return {
      valor: 40844.79,
      fecha: new Date().toISOString(),
    };
  }
}
