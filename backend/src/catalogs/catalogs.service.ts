import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface IndicatorValue {
  valor: number;
  fecha: string;
}

export interface LiveIndicatorsResponse {
  uf: IndicatorValue;
  utm: IndicatorValue;
  dolar?: IndicatorValue;
  ipc?: IndicatorValue;
}

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
    const indicators = await this.getLiveIndicators();
    return indicators.uf;
  }

  async getLiveIndicators(): Promise<LiveIndicatorsResponse> {
    const defaultUf = { valor: 40844.79, fecha: new Date().toISOString() };
    const defaultUtm = { valor: 67500.0, fecha: new Date().toISOString() };
    const defaultDolar = { valor: 950.5, fecha: new Date().toISOString() };
    const defaultIpc = { valor: 0.3, fecha: new Date().toISOString() };

    try {
      const response = await fetch('https://mindicador.cl/api');
      if (response.ok) {
        const data = await response.json();
        return {
          uf: data.uf ? { valor: data.uf.valor, fecha: data.uf.fecha } : defaultUf,
          utm: data.utm ? { valor: data.utm.valor, fecha: data.utm.fecha } : defaultUtm,
          dolar: data.dolar ? { valor: data.dolar.valor, fecha: data.dolar.fecha } : defaultDolar,
          ipc: data.ipc ? { valor: data.ipc.valor, fecha: data.ipc.fecha } : defaultIpc,
        };
      }
    } catch (e) {
      // Fallback to individual calls
    }

    // Individual fallback for UF & UTM
    let ufVal = defaultUf;
    let utmVal = defaultUtm;

    try {
      const ufRes = await fetch('https://mindicador.cl/api/uf');
      if (ufRes.ok) {
        const ufData = await ufRes.json();
        if (ufData.serie?.[0]) {
          ufVal = { valor: ufData.serie[0].valor, fecha: ufData.serie[0].fecha };
        }
      }
    } catch (e) {}

    try {
      const utmRes = await fetch('https://mindicador.cl/api/utm');
      if (utmRes.ok) {
        const utmData = await utmRes.json();
        if (utmData.serie?.[0]) {
          utmVal = { valor: utmData.serie[0].valor, fecha: utmData.serie[0].fecha };
        }
      }
    } catch (e) {}

    return {
      uf: ufVal,
      utm: utmVal,
      dolar: defaultDolar,
      ipc: defaultIpc,
    };
  }
}
