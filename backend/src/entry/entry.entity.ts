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

enum EntryTypeEnum {
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

enum StyleEnum {
  hangboard,
  gym,
  solo,
  boulder,
  aid,
  toprope,
  sport,
  trad,
}

@Entity('entry')
export class EntryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('text')
  notes = '';

  @Column('varchar', { length: 500 })
  @IsEnum(EntryTypeEnum)
  type = '';

  @Column('varchar', { length: 500 })
  @IsEnum(StyleEnum)
  style = '';

  @ManyToOne(
    type => UserEntity,
    user => user.entries,
  )
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
