import {
  Get,
  Post,
  Body,
  Delete,
  Param,
  Patch,
  Controller,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../shared/guards/auth.guard';
import { User } from '../shared/decorators';
import { TickService } from './tick.service';
import { CreateTickDto, UpdateTickDto, TickQueryDto } from './dto';

@ApiBearerAuth()
@ApiTags('tick')
@Controller('tick')
@UseGuards(AuthGuard)
export class TickController {
  constructor(private readonly tickService: TickService) {}

  @Get()
  findAll(@Query() query: TickQueryDto, @User() user) {
    return this.tickService.findAll(query, user);
  }

  @Post()
  create(@Body() payload: CreateTickDto, @User() user) {
    return this.tickService.create(payload, user);
  }

  @Patch(':id')
  update(@Param('id') id, @Body() payload: UpdateTickDto, @User() user) {
    return this.tickService.update(id, payload, user);
  }

  @Delete(':id')
  delete(@Param('id') id, @User() user) {
    return this.tickService.delete(id, user);
  }
}
