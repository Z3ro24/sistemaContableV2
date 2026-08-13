import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { GetUser } from '../../auth/decorators/user.decorator';
import { LreDtExporterService } from './lre-dt-exporter.service';

@Controller('exports/lre')
@UseGuards(AuthGuard)
export class LreDtExporterController {
  constructor(private readonly lreDtExporterService: LreDtExporterService) {}

  @Get()
  async exportLreCsv(
    @GetUser('sub') userId: string,
    @Query('periodYyyyMm') periodYyyyMm: string,
    @Query('companyId') companyId?: string,
    @Res() res?: Response
  ) {
    const compId = companyId ? parseInt(companyId, 10) : undefined;
    const csvContent = await this.lreDtExporterService.generateLreCsv(userId, periodYyyyMm, compId);

    const filename = `LRE_DT_${periodYyyyMm || 'Report'}.csv`;

    if (res) {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(csvContent);
    }

    return csvContent;
  }
}
