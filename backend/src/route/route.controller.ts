import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RouteService } from './route.service';
import { RouteEntity } from './route.entity';

@ApiBearerAuth()
@ApiTags('route')
@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Get()
  findAll(): Promise<RouteEntity[]> {
    return this.routeService.findAll();
  }

  @Post()
  create(@Body() data): Promise<RouteEntity> {
    return this.routeService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id, @Body() data): Promise<unknown> {
    return this.routeService.update({ ...data, id });
  }
}
