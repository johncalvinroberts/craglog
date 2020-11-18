import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsEnum, MaxLength, Max } from 'class-validator';
import { UserEntity } from '../user/user.entity';

export enum TickTypeEnum {
  lead,
  flash,
  onsight,
  redpoint,
  pinkpoint,
  ropedog,
  firstFreeAscent,
  allFreeWithRest,
  topRopeFreeAscent,
  topRopeWithRest,
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
  other,
}

export type RouteSnapshot = {
  externalUrl: string;
  name: string;
  cragName: string;
  region: string;
  area: string;
  grade: string;
  bolts: number;
};

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
  @MaxLength(2000)
  notes = '';

  @Column('varchar', { length: 500, nullable: true })
  @MaxLength(500)
  @IsEnum(TickTypeEnum)
  type = '';

  @Column('varchar', { length: 500 })
  @MaxLength(500)
  @IsEnum(TickStyleEnum)
  style = '';

  @ManyToOne(() => UserEntity, (user) => user.ticks, {
    nullable: false,
    eager: false,
  })
  user: UserEntity;

  @Column({ nullable: true })
  userId: number;

  @Column({
    type: 'jsonb',
    array: false,
    nullable: true,
  })
  route: RouteSnapshot[];

  @Column('int', { nullable: true })
  @Max(100)
  physicalRating: number;

  @Column('varchar', { length: 500, nullable: true })
  gymName = '';

  @Column('timestamp without time zone')
  tickDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
