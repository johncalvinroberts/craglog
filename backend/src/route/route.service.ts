import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { RouteEntity } from './route.entity';
import { CreateRouteDto } from './dto/create-route.dto';
import { AuthGuard } from '../shared/guards';
import { RouteQueryDto } from './dto/route-query.dto';

@Injectable()
@UseGuards(AuthGuard)
export class RouteService {
  constructor(
    @InjectRepository(RouteEntity)
    private readonly routeRepository: Repository<RouteEntity>,
  ) {}

  findAll(query: RouteQueryDto): Promise<RouteEntity[]> {
    return this.routeRepository.find(query);
  }

  create(route: CreateRouteDto): Promise<RouteEntity> {
    return this.routeRepository.save(route);
  }

  update(route: RouteEntity): Promise<UpdateResult> {
    return this.routeRepository.update(route.id, route);
  }

  delete(id): Promise<DeleteResult> {
    return this.routeRepository.delete(id);
  }
}
