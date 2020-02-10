import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { HangboardSequenceEntity } from './hangboard-sequence.entity';
import {
  HangboardSequenceQueryDto,
  CreateHangboardSequenceDto,
  UpdateHangboardSequenceDto,
} from './dto';

@Injectable()
export class HangboardSequenceService {
  constructor(
    @InjectRepository(HangboardSequenceEntity)
    private readonly hangboardSequenceRepository: Repository<
      HangboardSequenceEntity
    >,
  ) {}

  findAll(query: HangboardSequenceQueryDto, userId: number) {
    const { isPublic, ...rest } = query;
    return this.hangboardSequenceRepository.find({
      ...rest,
      ...rest,
      ...(isPublic ? { isPublic: true } : { userId }),
    });
  }

  async findById(id: number, userId: number) {
    const item: HangboardSequenceEntity = await this.hangboardSequenceRepository.findOne(
      { id },
    );
    if (!item) {
      throw new NotFoundException();
    }

    if (item.userId !== userId && !item.isPublic) {
      throw new UnauthorizedException();
    }
  }

  create(
    payload: CreateHangboardSequenceDto,
    user: UserEntity,
  ): Promise<HangboardSequenceEntity> {
    return this.hangboardSequenceRepository.save({ ...payload, user });
  }

  async update(
    id: number,
    payload: UpdateHangboardSequenceDto,
    userId: number,
  ) {
    const prev: HangboardSequenceEntity = await this.hangboardSequenceRepository.findOne(
      { id },
    );

    if (!prev) {
      throw new NotFoundException();
    }

    if (prev.userId !== userId) {
      throw new UnauthorizedException();
    }
    const next = { ...prev, ...payload };
    return this.hangboardSequenceRepository.save(next);
  }

  async delete(id, userId): Promise<DeleteResult> {
    const prev: HangboardSequenceEntity = await this.hangboardSequenceRepository.findOne(
      { id },
    );

    if (!prev) {
      throw new NotFoundException();
    }

    if (prev.userId !== userId) {
      throw new UnauthorizedException();
    }

    return this.hangboardSequenceRepository.delete(id);
  }
}
