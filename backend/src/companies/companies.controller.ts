import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';

@Controller('companies')
@UseGuards(AuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(
    @GetUser('sub') userId: string,
    @Body() createCompanyDto: CreateCompanyDto,
  ) {
    return this.companiesService.create(userId, createCompanyDto);
  }

  @Get()
  findAll(@GetUser('sub') userId: string) {
    return this.companiesService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @GetUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.companiesService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @GetUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(userId, id, updateCompanyDto);
  }

  @Delete(':id')
  remove(
    @GetUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.companiesService.remove(userId, id);
  }
}
