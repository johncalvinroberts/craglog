import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  UpdateResult,
  DeleteResult,
  MoreThan,
  LessThan,
} from 'typeorm';
import { TickEntity } from './tick.entity';
import { CreateTickDto, UpdateTickDto, TickStatsDto } from './dto';
import { UserEntity } from '../user/user.entity';
import { RouteService } from '../route/route.service';

@Injectable()
export class TickService {
  constructor(
    @InjectRepository(TickEntity)
    private readonly tickRepository: Repository<TickEntity>,
    private readonly routeService: RouteService,
  ) {}

  findAll(query, userId) {
    const { startDate, endDate, orderBy, sort } = query;

    const order = { [orderBy]: sort };

    const where = {
      userId,
      ...(startDate ? { tickDate: MoreThan(startDate) } : null),
      ...(endDate ? { tickDate: LessThan(endDate) } : null),
    };

    return this.tickRepository.find({
      ...query,
      order,
      where,
    });
  }

  async findById(id, user: UserEntity): Promise<TickEntity> {
    const item: TickEntity = await this.tickRepository.findOne({ id });

    if (!item) {
      throw new NotFoundException('Tick not found');
    }

    if (item.userId !== user.id) {
      throw new UnauthorizedException();
    }

    return item;
  }

  /* eslint-disable prefer-const */
  async create(payload: CreateTickDto, user: UserEntity): Promise<TickEntity> {
    let { routeId, ...toSave } = payload;

    let route;

    if (routeId) {
      route = await this.routeService.findById(routeId);
      if (!route) throw new BadRequestException('Route not found');
    }

    return this.tickRepository.save({
      ...toSave,
      user,
      route,
    });
  }

  async update(
    id,
    payload: UpdateTickDto,
    user: UserEntity,
  ): Promise<UpdateResult> {
    let { routeId, ...toUpdate } = payload;

    const prev: TickEntity = await this.tickRepository.findOne({ id });

    if (!TickEntity) {
      throw new NotFoundException();
    }

    if (prev.userId !== user.id) {
      throw new UnauthorizedException();
    }

    let route;

    if (routeId) {
      const route = await this.routeService.findById(routeId);
      if (!route) throw new BadRequestException();
    }

    return this.tickRepository.update(id, { ...toUpdate, route });
  }
  /* eslint-enable prefer-const */

  async delete(id, user: UserEntity): Promise<DeleteResult> {
    const prev: TickEntity = await this.tickRepository.findOne({ id });

    if (!TickEntity) {
      throw new NotFoundException();
    }

    if (prev.user.id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.tickRepository.delete(id);
  }

  async getStats(userId, query: TickStatsDto) {
    const { startDate, endDate } = query;

    const where = {
      userId,
      ...(startDate ? { tickDate: MoreThan(startDate) } : null),
      ...(endDate ? { tickDate: LessThan(endDate) } : null),
    };

    const res = await this.tickRepository
      .createQueryBuilder('tick')
      .where(where)
      .select('tick.style AS style')
      .addSelect('COUNT(*) AS count')
      .groupBy('tick.style')
      .getRawMany();

    return res.reduce(
      (memo, current) => {
        const count = parseInt(current.count);
        return {
          ...memo,
          [current.style]: parseInt(current.count),
          total: memo.total + count,
        };
      },
      {
        boulder: 0,
        sport: 0,
        trad: 0,
        gym: 0,
        hangboard: 0,
        toprope: 0,
        total: 0,
      },
    );
  }
}
