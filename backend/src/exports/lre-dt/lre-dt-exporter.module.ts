import { Module } from '@nestjs/common';
import { LreDtExporterService } from './lre-dt-exporter.service';
import { LreDtExporterController } from './lre-dt-exporter.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';
import { ExportLogsModule } from '../export-logs/export-logs.module';

@Module({
  imports: [PrismaModule, AuthModule, ExportLogsModule],
  controllers: [LreDtExporterController],
  providers: [LreDtExporterService],
  exports: [LreDtExporterService],
})
export class LreDtExporterModule {}
