import { Module } from '@nestjs/common';
import { NoveltiesService } from './novelties.service';
import { NoveltiesController } from './novelties.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [NoveltiesController],
  providers: [NoveltiesService],
  exports: [NoveltiesService],
})
export class NoveltiesModule {}
