import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsEnum, Max } from 'class-validator';
import { UserEntity } from '../user/user.entity';
import { RouteEntity } from '../route/route.entity';

export enum TickTypeEnum {
  lead,
  flash,
  onsight,
  redpoint,
  pinkpoint,
  ropedog,
  firstAscent,
  firstFreeAscent,
  allFreeWithRest,
  send,
  dab,
  repeatSend,
  retreat,
  attempt,
  utterFailure,
}

export enum TickStyleEnum {
  hangboard,
  gym,
  solo,
  boulder,
  aid,
  toprope,
  sport,
  trad,
}

export const routeStyles: string[] = [
  'solo',
  'boulder',
  'sport',
  'trad',
  'aid',
  'toprope',
];

@Entity('tick')
export class TickEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('text')
  notes = '';

  @Column('varchar', { length: 500 })
  @Max(2000)
  @IsEnum(TickTypeEnum)
  type = '';

  @Column('varchar', { length: 500 })
  @IsEnum(TickStyleEnum)
  style = '';

  @ManyToOne(
    type => UserEntity,
    user => user.ticks,
    { nullable: false },
  )
  user: UserEntity;

  @ManyToOne(type => RouteEntity, { nullable: true })
  route: RouteEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
