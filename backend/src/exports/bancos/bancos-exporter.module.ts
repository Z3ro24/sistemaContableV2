import { Module } from '@nestjs/common';
import { BancosExporterService } from './bancos-exporter.service';
import { BancosExporterController } from './bancos-exporter.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';
import { ExportLogsModule } from '../export-logs/export-logs.module';

@Module({
  imports: [PrismaModule, AuthModule, ExportLogsModule],
  controllers: [BancosExporterController],
  providers: [BancosExporterService],
  exports: [BancosExporterService],
})
export class BancosExporterModule {}
