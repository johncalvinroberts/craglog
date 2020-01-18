import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { RouteService } from './route.service';
import { Route } from './route.entity';

@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Get()
  findAll(): Promise<Route[]> {
    return this.routeService.findAll();
  }

  @Post()
  create(@Body() data): Promise<Route> {
    return this.routeService.create(data);
  }

  @Put(':id')
  update(@Param('id') id, @Body() data): Promise<unknown> {
    return this.routeService.update({ ...data, id });
  }
}
