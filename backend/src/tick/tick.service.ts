import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { TickEntity } from './tick.entity';
import { CreateTickDto, UpdateTickDto } from './dto';
import { UserEntity } from '../user/user.entity';
import { RouteService } from '../route/route.service';

@Injectable()
export class TickService {
  constructor(
    @InjectRepository(TickEntity)
    private readonly tickRepository: Repository<TickEntity>,
    private readonly routeService: RouteService,
  ) {}

  findAll(query, user) {
    return this.tickRepository.find({
      ...query,
      where: { ...query.where, user },
    });
  }

  findById(id): Promise<TickEntity> {
    return this.tickRepository.findOne({ id });
  }

  /* eslint-disable prefer-const */
  async create(payload: CreateTickDto, user: UserEntity): Promise<TickEntity> {
    let { routeId, ...toSave } = payload;

    let route;

    if (routeId) {
      route = await this.routeService.findById(routeId);
      if (!route) throw new BadRequestException();
    }

    return this.tickRepository.save({ ...toSave, user, route });
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

    if (prev.user.id !== user.id) {
      throw new UnauthorizedException();
    }

    let route;

    if (routeId) {
      const route = await this.routeService.findById(routeId);
      if (!route) throw new BadRequestException();
    }

    return this.tickRepository.update(id, { ...toUpdate, route });
  }

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
}
/* eslint-enable prefer-const */
