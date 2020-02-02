import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import { UserEntity } from '../user/user.entity';

enum TickTypeEnum {
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

enum TickStyleEnum {
  hangboard,
  gym,
  solo,
  boulder,
  aid,
  toprope,
  sport,
  trad,
}

@Entity('tick')
export class TickEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('text')
  notes = '';

  @Column('varchar', { length: 500 })
  @IsEnum(TickTypeEnum)
  type = '';

  @Column('varchar', { length: 500 })
  @IsEnum(TickStyleEnum)
  style = '';

  @ManyToOne(
    type => UserEntity,
    user => user.ticks,
  )
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
