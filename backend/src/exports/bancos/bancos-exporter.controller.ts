import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { GetUser } from '../../auth/decorators/user.decorator';
import {
  BancosExporterService,
  type BankFormatCode,
} from './bancos-exporter.service';

@Controller('exports/bancos')
@UseGuards(AuthGuard)
export class BancosExporterController {
  constructor(private readonly bancosExporterService: BancosExporterService) {}

  @Get()
  async exportBankFile(
    @GetUser('sub') userId: string,
    @Query('format') format: BankFormatCode,
    @Query('periodYyyyMm') periodYyyyMm: string,
    @Query('companyId') companyId?: string,
    @Res() res?: Response,
  ) {
    const compId = companyId ? parseInt(companyId, 10) : undefined;
    const { fileContent, filename } =
      await this.bancosExporterService.generateBankFile(
        userId,
        format || 'UNIVERSAL_TEF',
        periodYyyyMm,
        compId,
      );

    if (res) {
      const isCsv = filename.endsWith('.csv');
      const contentType = isCsv
        ? 'text/csv; charset=utf-8'
        : 'text/plain; charset=utf-8';
      res.setHeader('Content-Type', contentType);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );
      return res.send(fileContent);
    }

    return fileContent;
  }
}
