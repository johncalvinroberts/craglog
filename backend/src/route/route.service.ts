import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Route } from './route.entity';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
  ) {}

  findAll(): Promise<Route[]> {
    return this.routeRepository.find();
  }

  create(route: Route): Promise<Route> {
    return this.routeRepository.save(route);
  }

  update(route: Route): Promise<UpdateResult> {
    return this.routeRepository.update(route.id, route);
  }

  delete(id): Promise<DeleteResult> {
    return this.routeRepository.delete(id);
  }
}
