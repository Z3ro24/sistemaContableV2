import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { GetUser } from '../../auth/decorators/user.decorator';
import { PreviredExporterService } from './previred-exporter.service';

@Controller('exports/previred')
@UseGuards(AuthGuard)
export class PreviredExporterController {
  constructor(private readonly previredExporterService: PreviredExporterService) {}

  @Get()
  async exportPrevired(
    @GetUser('sub') userId: string,
    @Query('periodYyyyMm') periodYyyyMm: string,
    @Query('companyId') companyId?: string,
    @Res() res?: Response
  ) {
    const compId = companyId ? parseInt(companyId, 10) : undefined;
    const txtContent = await this.previredExporterService.generatePreviredTxt(userId, periodYyyyMm, compId);

    const filename = `PreviRed_${periodYyyyMm || 'Report'}.txt`;

    if (res) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(txtContent);
    }

    return txtContent;
  }
}
