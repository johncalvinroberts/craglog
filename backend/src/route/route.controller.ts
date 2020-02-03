import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiBody } from '@nestjs/swagger';
import { RouteService } from './route.service';
import { RouteEntity } from './route.entity';
import { RouteQueryDto, CreateRouteDto } from './dto';

@ApiBearerAuth()
@ApiTags('route')
@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Get()
  @ApiQuery(RouteQueryDto)
  find(@Query() query: RouteQueryDto): Promise<RouteEntity[]> {
    return this.routeService.findAll(query);
  }

  @Get('stats')
  stats() {
    return this.routeService.getStats();
  }

  @Get(':id')
  findById(@Param('id') id) {
    return this.routeService.findById(id);
  }

  @Post()
  @ApiBody({ type: CreateRouteDto })
  create(@Body() data: CreateRouteDto): Promise<RouteEntity> {
    return this.routeService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id, @Body() data): Promise<unknown> {
    return this.routeService.update({ ...data, id });
  }
}
