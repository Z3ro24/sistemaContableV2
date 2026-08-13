import { Controller, Get, Post, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';
import { MonthlyParametersService } from './monthly-parameters.service';
import { CreateMonthlyParameterDto } from './dto/create-monthly-parameter.dto';

@Controller('monthly-parameters')
@UseGuards(AuthGuard)
export class MonthlyParametersController {
  constructor(private readonly monthlyParametersService: MonthlyParametersService) {}

  @Post()
  create(@GetUser('sub') userId: string, @Body() dto: CreateMonthlyParameterDto) {
    return this.monthlyParametersService.create(userId, dto);
  }

  @Get()
  findAll(@GetUser('sub') userId: string) {
    return this.monthlyParametersService.findAll(userId);
  }

  @Get(':period')
  findByPeriod(@GetUser('sub') userId: string, @Param('period') period: string) {
    return this.monthlyParametersService.findByPeriod(userId, period);
  }

  @Delete(':id')
  delete(@GetUser('sub') userId: string, @Param('id', ParseIntPipe) id: number) {
    return this.monthlyParametersService.delete(userId, id);
  }
}
