import { Controller, Get, Param, Query, UseGuards, Res, ParseIntPipe } from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { GetUser } from '../../auth/decorators/user.decorator';
import { ExportLogsService } from './export-logs.service';

@Controller('exports/logs')
@UseGuards(AuthGuard)
export class ExportLogsController {
  constructor(private readonly exportLogsService: ExportLogsService) {}

  @Get()
  async findAll(
    @GetUser('sub') userId: string,
    @Query('type') exportType?: string,
    @Query('periodYyyyMm') periodYyyyMm?: string,
    @Query('companyId') companyId?: string
  ) {
    const compId = companyId ? parseInt(companyId, 10) : undefined;
    return this.exportLogsService.findAll(userId, exportType, periodYyyyMm, compId);
  }

  @Get(':id/redownload')
  async redownload(
    @GetUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response
  ) {
    const log = await this.exportLogsService.findOne(userId, id);

    const isCsv = log.filename.endsWith('.csv');
    const contentType = isCsv ? 'text/csv; charset=utf-8' : 'text/plain; charset=utf-8';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${log.filename}"`);
    return res.send(log.fileData || '');
  }
}
