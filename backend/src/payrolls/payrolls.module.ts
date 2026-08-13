import { Module } from '@nestjs/common';
import { PayrollsService } from './payrolls.service';
import { PayrollsController } from './payrolls.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PayrollsController],
  providers: [PayrollsService],
  exports: [PayrollsService],
})
export class PayrollsModule {}
