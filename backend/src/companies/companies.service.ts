import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { formatRut, validateRut } from '../common/rutUtils';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createCompanyDto: CreateCompanyDto) {
    const formattedRut = formatRut(createCompanyDto.rutCompany);

    if (!validateRut(formattedRut)) {
      throw new BadRequestException('El RUT de la empresa ingresado no es válido (Módulo 11)');
    }

    const existingCompany = await this.prisma.company.findUnique({
      where: {
        rutCompany_userId: {
          rutCompany: formattedRut,
          userId,
        },
      },
    });

    if (existingCompany) {
      throw new BadRequestException('Ya has registrado una empresa con este RUT');
    }

    return this.prisma.company.create({
      data: {
        name: createCompanyDto.name.trim(),
        rutCompany: formattedRut,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.company.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { workers: true },
        },
      },
    });
  }

  async findOne(userId: string, id: number) {
    const company = await this.prisma.company.findFirst({
      where: { id, userId },
      include: { workers: true },
    });

    if (!company) {
      throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
    }

    return company;
  }

  async update(userId: string, id: number, updateCompanyDto: UpdateCompanyDto) {
    await this.findOne(userId, id);

    const dataToUpdate: Record<string, any> = {};

    if (updateCompanyDto.name !== undefined) {
      dataToUpdate.name = updateCompanyDto.name.trim();
    }

    if (updateCompanyDto.rutCompany !== undefined) {
      const formattedRut = formatRut(updateCompanyDto.rutCompany);

      if (!validateRut(formattedRut)) {
        throw new BadRequestException('El RUT de la empresa ingresado no es válido (Módulo 11)');
      }

      const existingCompany = await this.prisma.company.findUnique({
        where: {
          rutCompany_userId: {
            rutCompany: formattedRut,
            userId,
          },
        },
      });

      if (existingCompany && existingCompany.id !== id) {
        throw new BadRequestException('Ya has registrado otra empresa con este RUT');
      }

      dataToUpdate.rutCompany = formattedRut;
    }

    return this.prisma.company.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(userId: string, id: number) {
    await this.findOne(userId, id);

    return this.prisma.company.delete({
      where: { id },
    });
  }
}
