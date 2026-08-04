import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';
import { NoveltiesService } from './novelties.service';
import { UpsertNoveltyDto } from './dto/upsert-novelty.dto';

@Controller('novelties')
@UseGuards(AuthGuard)
export class NoveltiesController {
  constructor(private readonly noveltiesService: NoveltiesService) {}

  @Get('list')
  findAll(
    @GetUser('sub') userId: string,
    @Query('periodYyyyMm') periodYyyyMm?: string,
    @Query('companyId') companyId?: string
  ) {
    const compId = companyId ? parseInt(companyId, 10) : undefined;
    return this.noveltiesService.findAll(userId, periodYyyyMm, compId);
  }

  @Get()
  findByWorkerAndPeriod(
    @GetUser('sub') userId: string,
    @Query('workerId', ParseIntPipe) workerId: number,
    @Query('periodYyyyMm') periodYyyyMm: string
  ) {
    return this.noveltiesService.findByWorkerAndPeriod(userId, workerId, periodYyyyMm);
  }

  @Post()
  create(@GetUser('sub') userId: string, @Body() dto: UpsertNoveltyDto) {
    return this.noveltiesService.create(userId, dto);
  }

  @Put(':id')
  update(
    @GetUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpsertNoveltyDto
  ) {
    return this.noveltiesService.update(userId, id, dto);
  }

  @Delete(':id')
  delete(@GetUser('sub') userId: string, @Param('id', ParseIntPipe) id: number) {
    return this.noveltiesService.delete(userId, id);
  }
}
