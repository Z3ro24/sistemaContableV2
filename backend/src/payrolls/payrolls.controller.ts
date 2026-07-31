import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';
import { PayrollsService } from './payrolls.service';
import { CalculatePayrollDto } from './dto/calculate-payroll.dto';

@Controller('payrolls')
@UseGuards(AuthGuard)
export class PayrollsController {
  constructor(private readonly payrollsService: PayrollsService) {}

  @Post('calculate')
  calculateAndSave(@GetUser('sub') userId: string, @Body() dto: CalculatePayrollDto) {
    return this.payrollsService.calculateAndSave(userId, dto);
  }

  @Get()
  findAll(
    @GetUser('sub') userId: string,
    @Query('period') period?: string,
    @Query('companyId') companyId?: string
  ) {
    const compId = companyId ? parseInt(companyId, 10) : undefined;
    return this.payrollsService.findAll(userId, period, compId);
  }

  @Get(':id')
  findOne(@GetUser('sub') userId: string, @Param('id', ParseIntPipe) id: number) {
    return this.payrollsService.findOne(userId, id);
  }

  @Delete(':id')
  delete(@GetUser('sub') userId: string, @Param('id', ParseIntPipe) id: number) {
    return this.payrollsService.delete(userId, id);
  }
}
