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
import { ApiTags, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../shared/guards/auth.guard';
import { User } from '../shared/decorators';
import { TickService } from './tick.service';
import {
  CreateTickDto,
  UpdateTickDto,
  TickQueryDto,
  TickStatsDto,
} from './dto';

@ApiBearerAuth()
@ApiTags('tick')
@Controller('tick')
@UseGuards(AuthGuard)
export class TickController {
  constructor(private readonly tickService: TickService) {}

  @Get()
  @ApiQuery(TickQueryDto)
  findAll(@Query() query: TickQueryDto, @User('id') userId) {
    return this.tickService.findAll(query, userId);
  }

  @Get('stats')
  getStats(@User('id') userId, @Query() query: TickStatsDto) {
    return this.tickService.getStats(userId, query);
  }

  @Get(':id')
  findById(@Param('id') id, @User() user) {
    return this.tickService.findById(id, user);
  }

  @Post()
  @ApiBody({ type: CreateTickDto })
  create(@Body() payload: CreateTickDto, @User() user) {
    return this.tickService.create(payload, user);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateTickDto })
  update(@Param('id') id, @Body() payload: UpdateTickDto, @User() user) {
    return this.tickService.update(id, payload, user);
  }

  @Delete(':id')
  delete(@Param('id') id, @User('id') userId) {
    return this.tickService.delete(id, userId);
  }
}
