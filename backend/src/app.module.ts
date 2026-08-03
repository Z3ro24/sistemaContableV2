import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { WorkersModule } from './workers/workers.module';
import { CompaniesModule } from './companies/companies.module';
import { CatalogsModule } from './catalogs/catalogs.module';
import { MonthlyParametersModule } from './monthly-parameters/monthly-parameters.module';
import { PayrollsModule } from './payrolls/payrolls.module';
import { LreModule } from './lre/lre.module';
import { ExportLogsModule } from './exports/export-logs/export-logs.module';
import { PreviredExporterModule } from './exports/previred/previred-exporter.module';
import { LreDtExporterModule } from './exports/lre-dt/lre-dt-exporter.module';
import { BancosExporterModule } from './exports/bancos/bancos-exporter.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    AuthModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    WorkersModule,
    CompaniesModule,
    CatalogsModule,
    MonthlyParametersModule,
    PayrollsModule,
    LreModule,
    ExportLogsModule,
    PreviredExporterModule,
    LreDtExporterModule,
    BancosExporterModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
