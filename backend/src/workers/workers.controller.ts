import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { WorkersService } from './workers.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';

@Controller('workers')
@UseGuards(AuthGuard)
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post()
  create(
    @GetUser('sub') userId: string,
    @Body() createWorkerDto: CreateWorkerDto,
  ) {
    return this.workersService.create(userId, createWorkerDto);
  }

  @Get()
  findAll(@GetUser('sub') userId: string) {
    return this.workersService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @GetUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.workersService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @GetUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkerDto: UpdateWorkerDto,
  ) {
    return this.workersService.update(userId, id, updateWorkerDto);
  }

  @Delete(':id')
  remove(
    @GetUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.workersService.remove(userId, id);
  }
}
