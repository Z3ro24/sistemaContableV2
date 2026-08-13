import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';
import { LreService } from './lre.service';

@Controller('lre')
@UseGuards(AuthGuard)
export class LreController {
  constructor(private readonly lreService: LreService) {}

  @Get()
  async getLreReport(
    @GetUser('sub') userId: string,
    @Query('periodYyyyMm') periodYyyyMm: string,
    @Query('companyId') companyId?: string
  ) {
    const parsedCompanyId = companyId ? parseInt(companyId, 10) : undefined;
    return this.lreService.getLreReport(userId, periodYyyyMm, parsedCompanyId);
  }

  @Get('export')
  async exportLreCsv(
    @GetUser('sub') userId: string,
    @Query('periodYyyyMm') periodYyyyMm: string,
    @Query('companyId') companyId: string | undefined,
    @Res() res: Response
  ) {
    const parsedCompanyId = companyId ? parseInt(companyId, 10) : undefined;
    const csvData = await this.lreService.exportLreCsv(userId, periodYyyyMm, parsedCompanyId);

    const filename = `LRE_DT_${periodYyyyMm || 'Report'}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(csvData);
  }
}
