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
import { User } from '../shared/decorators';
import { AuthGuard } from '../shared/guards/auth.guard';
import {
  HangboardSequenceQueryDto,
  CreateHangboardSequenceDto,
  UpdateHangboardSequenceDto,
} from './dto';
import { HangboardSequenceService } from './hangboard-sequence.service';

@ApiBearerAuth()
@ApiTags('Hangboard Sequence')
@UseGuards(AuthGuard)
@Controller('hangboard-sequence')
export class HangboardSequenceController {
  constructor(
    private readonly hangboardSequenceService: HangboardSequenceService,
  ) {}

  @Get()
  findAll(@Query() query: HangboardSequenceQueryDto, @User('id') userId) {
    return this.hangboardSequenceService.findAll(query, userId);
  }

  @Get(':id')
  findById(@Param('id') id, @User('id') userId) {
    return this.hangboardSequenceService.findById(id, userId);
  }

  @Post()
  create(@Body() payload: CreateHangboardSequenceDto, @User() user) {
    return this.hangboardSequenceService.create(payload, user);
  }

  @Patch(':id')
  update(
    @Param('id') id,
    @Body() payload: UpdateHangboardSequenceDto,
    @User('id') userId,
  ) {
    return this.hangboardSequenceService.update(id, payload, userId);
  }

  @Delete(':id')
  delete(@Param('id') id, @User('id') userId) {
    return this.hangboardSequenceService.delete(id, userId);
  }
}
