import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RouteService } from './route.service';
import { RouteEntity } from './route.entity';
import { RouteQueryDto } from './dto/route-query.dto';

@ApiBearerAuth()
@ApiTags('route')
@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Get()
  find(@Query() query: RouteQueryDto): Promise<RouteEntity[]> {
    return this.routeService.findAll(query);
  }

  @Post()
  create(@Body() data): Promise<RouteEntity> {
    return this.routeService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id, @Body() data): Promise<unknown> {
    return this.routeService.update({ ...data, id });
  }

  @Get('stats')
  stats() {
    return this.routeService.getStats();
  }
}
