import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { RouteEntity } from './route.entity';
import { CreateRouteDto } from './dto/create-route.dto';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(RouteEntity)
    private readonly routeRepository: Repository<RouteEntity>,
  ) {}

  findAll(): Promise<RouteEntity[]> {
    return this.routeRepository.find();
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
