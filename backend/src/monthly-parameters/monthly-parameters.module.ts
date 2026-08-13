import { Module } from '@nestjs/common';
import { MonthlyParametersService } from './monthly-parameters.service';
import { MonthlyParametersController } from './monthly-parameters.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MonthlyParametersController],
  providers: [MonthlyParametersService],
  exports: [MonthlyParametersService],
})
export class MonthlyParametersModule {}
