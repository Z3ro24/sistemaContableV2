import { Module } from '@nestjs/common';
import { LreService } from './lre.service';
import { LreController } from './lre.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [LreController],
  providers: [LreService],
  exports: [LreService],
})
export class LreModule {}
