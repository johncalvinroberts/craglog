import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { MaxLength } from 'class-validator';
import { UserEntity } from '../user/user.entity';
import { HangboardSequenceItemDto } from './dto';

@Entity('hangboardSequence')
export class HangboardSequenceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    type: 'jsonb',
    array: false,
    nullable: false,
  })
  sequence: HangboardSequenceItemDto[];

  @Column('varchar', { length: 500 })
  boardName = '';

  @Column('varchar', { length: 500 })
  name = '';

  @Column('text')
  @MaxLength(2000)
  description = '';

  @ManyToOne(() => UserEntity, (user) => user.hangboardSequences, {
    nullable: false,
    eager: false,
  })
  user: UserEntity;

  @Column({ nullable: true })
  userId: number;

  @Column('boolean')
  isPublic = false;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
