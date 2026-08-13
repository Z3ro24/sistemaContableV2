import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { formatRut, validateRut } from '../common/rutUtils';

@Injectable()
export class WorkersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createWorkerDto: CreateWorkerDto) {
    const formattedRut = formatRut(createWorkerDto.rut);

    if (!validateRut(formattedRut)) {
      throw new BadRequestException('El RUT de la persona ingresado no es válido (Módulo 11)');
    }

    const existingWorker = await this.prisma.worker.findUnique({
      where: {
        rut_userId: {
          rut: formattedRut,
          userId,
        },
      },
    });

    if (existingWorker) {
      throw new BadRequestException('Ya has registrado a una persona con este RUT');
    }

    if (createWorkerDto.companyId) {
      const company = await this.prisma.company.findFirst({
        where: { id: createWorkerDto.companyId, userId },
      });
      if (!company) {
        throw new BadRequestException('La empresa seleccionada no existe o no te pertenece');
      }
    }

    return this.prisma.worker.create({
      data: {
        name: createWorkerDto.name.trim(),
        paternalLastName: createWorkerDto.paternalLastName ? createWorkerDto.paternalLastName.trim() : null,
        maternalLastName: createWorkerDto.maternalLastName ? createWorkerDto.maternalLastName.trim() : null,
        rut: formattedRut,
        entryDate: createWorkerDto.entryDate ? new Date(createWorkerDto.entryDate) : null,
        baseSalary: createWorkerDto.baseSalary !== undefined ? createWorkerDto.baseSalary : 0.0,
        companyId: createWorkerDto.companyId || null,
        afpId: createWorkerDto.afpId || null,
        healthInstitutionId: createWorkerDto.healthInstitutionId || null,
        healthAgreedUf: createWorkerDto.healthAgreedUf !== undefined ? createWorkerDto.healthAgreedUf : 0.0,
        contractTypeId: createWorkerDto.contractTypeId || null,
        bankId: createWorkerDto.bankId || null,
        bankAccountType: createWorkerDto.bankAccountType || null,
        bankAccountNumber: createWorkerDto.bankAccountNumber || null,
        costCenterId: createWorkerDto.costCenterId || null,
        jobPositionId: createWorkerDto.jobPositionId || null,
        userId,
      },
      include: {
        company: true,
        afp: true,
        healthInstitution: true,
        contractType: true,
        bank: true,
        costCenter: true,
        jobPosition: true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.worker.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        company: true,
        afp: true,
        healthInstitution: true,
        contractType: true,
        bank: true,
        costCenter: true,
        jobPosition: true,
      },
    });
  }

  async findOne(userId: string, id: number) {
    const worker = await this.prisma.worker.findFirst({
      where: { id, userId },
      include: {
        company: true,
        afp: true,
        healthInstitution: true,
        contractType: true,
        bank: true,
        costCenter: true,
        jobPosition: true,
      },
    });

    if (!worker) {
      throw new NotFoundException(`Persona con ID ${id} no encontrada`);
    }

    return worker;
  }

  async update(userId: string, id: number, updateWorkerDto: UpdateWorkerDto) {
    await this.findOne(userId, id);

    const dataToUpdate: Record<string, any> = {};

    if (updateWorkerDto.name !== undefined) {
      dataToUpdate.name = updateWorkerDto.name.trim();
    }
    if (updateWorkerDto.paternalLastName !== undefined) {
      dataToUpdate.paternalLastName = updateWorkerDto.paternalLastName ? updateWorkerDto.paternalLastName.trim() : null;
    }
    if (updateWorkerDto.maternalLastName !== undefined) {
      dataToUpdate.maternalLastName = updateWorkerDto.maternalLastName ? updateWorkerDto.maternalLastName.trim() : null;
    }
    if (updateWorkerDto.entryDate !== undefined) {
      dataToUpdate.entryDate = updateWorkerDto.entryDate ? new Date(updateWorkerDto.entryDate) : null;
    }
    if (updateWorkerDto.baseSalary !== undefined) {
      dataToUpdate.baseSalary = updateWorkerDto.baseSalary;
    }
    if (updateWorkerDto.afpId !== undefined) {
      dataToUpdate.afpId = updateWorkerDto.afpId;
    }
    if (updateWorkerDto.healthInstitutionId !== undefined) {
      dataToUpdate.healthInstitutionId = updateWorkerDto.healthInstitutionId;
    }
    if (updateWorkerDto.healthAgreedUf !== undefined) {
      dataToUpdate.healthAgreedUf = updateWorkerDto.healthAgreedUf;
    }
    if (updateWorkerDto.contractTypeId !== undefined) {
      dataToUpdate.contractTypeId = updateWorkerDto.contractTypeId;
    }
    if (updateWorkerDto.bankId !== undefined) {
      dataToUpdate.bankId = updateWorkerDto.bankId;
    }
    if (updateWorkerDto.bankAccountType !== undefined) {
      dataToUpdate.bankAccountType = updateWorkerDto.bankAccountType;
    }
    if (updateWorkerDto.bankAccountNumber !== undefined) {
      dataToUpdate.bankAccountNumber = updateWorkerDto.bankAccountNumber;
    }
    if (updateWorkerDto.costCenterId !== undefined) {
      dataToUpdate.costCenterId = updateWorkerDto.costCenterId;
    }
    if (updateWorkerDto.jobPositionId !== undefined) {
      dataToUpdate.jobPositionId = updateWorkerDto.jobPositionId;
    }

    if (updateWorkerDto.companyId !== undefined) {
      if (updateWorkerDto.companyId !== null) {
        const company = await this.prisma.company.findFirst({
          where: { id: updateWorkerDto.companyId, userId },
        });
        if (!company) {
          throw new BadRequestException('La empresa seleccionada no existe o no te pertenece');
        }
      }
      dataToUpdate.companyId = updateWorkerDto.companyId;
    }

    if (updateWorkerDto.rut !== undefined) {
      const formattedRut = formatRut(updateWorkerDto.rut);

      if (!validateRut(formattedRut)) {
        throw new BadRequestException('El RUT de la persona ingresado no es válido (Módulo 11)');
      }

      const existingWorker = await this.prisma.worker.findUnique({
        where: {
          rut_userId: {
            rut: formattedRut,
            userId,
          },
        },
      });

      if (existingWorker && existingWorker.id !== id) {
        throw new BadRequestException('Ya has registrado a otra persona con este RUT');
      }

      dataToUpdate.rut = formattedRut;
    }

    return this.prisma.worker.update({
      where: { id },
      data: dataToUpdate,
      include: {
        company: true,
        afp: true,
        healthInstitution: true,
        contractType: true,
        bank: true,
        costCenter: true,
        jobPosition: true,
      },
    });
  }

  async remove(userId: string, id: number) {
    await this.findOne(userId, id);

    return this.prisma.worker.delete({
      where: { id },
    });
  }
}
