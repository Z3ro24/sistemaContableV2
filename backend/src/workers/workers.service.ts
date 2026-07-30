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
        rut: formattedRut,
        companyId: createWorkerDto.companyId || null,
        userId,
      },
      include: {
        company: true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.worker.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        company: true,
      },
    });
  }

  async findOne(userId: string, id: number) {
    const worker = await this.prisma.worker.findFirst({
      where: { id, userId },
      include: { company: true },
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
