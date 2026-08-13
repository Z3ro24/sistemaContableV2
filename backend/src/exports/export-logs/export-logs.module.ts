import { Module } from '@nestjs/common';
import { ExportLogsService } from './export-logs.service';
import { ExportLogsController } from './export-logs.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ExportLogsController],
  providers: [ExportLogsService],
  exports: [ExportLogsService],
})
export class ExportLogsModule {}
