import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { RouteEntity } from './route.entity';
import { AuthGuard } from '../shared/guards';
import { RouteQueryDto, CreateRouteDto } from './dto';

@Injectable()
@UseGuards(AuthGuard)
export class RouteService {
  constructor(
    @InjectRepository(RouteEntity)
    private readonly routeRepository: Repository<RouteEntity>,
  ) {}

  findAll(query: RouteQueryDto): Promise<RouteEntity[]> {
    if (query.name) {
      return this.routeRepository
        .createQueryBuilder('route')
        .where('route.name ILIKE :name', { name: query.name })
        .skip(query.skip)
        .take(query.take)
        .getMany();
    }

    if (query.origin) {
      const origin = {
        type: 'Point',
        coordinates: query.origin,
      };

      return this.routeRepository
        .createQueryBuilder('route')
        .where('ST_Distance(route.location, ST_GeomFromGeoJSON(:origin)) > 0')
        .orderBy({
          'ST_Distance(route.location, ST_GeomFromGeoJSON(:origin))': {
            order: 'ASC',
            nulls: 'NULLS FIRST',
          },
        })
        .setParameters({ origin })
        .skip(query.skip)
        .take(query.take)
        .getMany();
    }
    return this.routeRepository.find(query);
  }

  findById(id): Promise<RouteEntity> {
    return this.routeRepository.findOne({ id });
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

  async getStats() {
    const totalPromise = this.routeRepository.count();
    const boulderPromise = this.routeRepository.count({
      where: { style: 'boulder' },
    });
    const sportPromise = this.routeRepository.count({
      where: { style: 'sport' },
    });
    const tradPromise = this.routeRepository.count({
      where: { style: 'trad' },
    });

    const [total, boulder, sport, trad] = await Promise.all([
      totalPromise,
      boulderPromise,
      sportPromise,
      tradPromise,
    ]);
    return { total, boulder, sport, trad };
  }
}
