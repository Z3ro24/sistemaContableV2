import { Module } from '@nestjs/common';
import { PreviredExporterService } from './previred-exporter.service';
import { PreviredExporterController } from './previred-exporter.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';
import { ExportLogsModule } from '../export-logs/export-logs.module';

@Module({
  imports: [PrismaModule, AuthModule, ExportLogsModule],
  controllers: [PreviredExporterController],
  providers: [PreviredExporterService],
  exports: [PreviredExporterService],
})
export class PreviredExporterModule {}
