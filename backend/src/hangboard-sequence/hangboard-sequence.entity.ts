import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { HangboardSequenceItemDto } from '../shared/hangboard-sequence-item.dto';

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

  @ManyToOne(
    () => UserEntity,
    user => user.ticks,
    { nullable: false, eager: false },
  )
  user: UserEntity;

  @Column({ nullable: true })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
