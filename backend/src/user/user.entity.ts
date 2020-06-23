import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import * as crypto from 'crypto';
import { TickEntity } from '../tick/tick.entity';
import { HangboardSequenceEntity } from 'src/hangboard-sequence/hangboard-sequence.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('varchar', { length: 500 })
  @Index({ unique: true })
  @IsNotEmpty()
  username: string;

  @Column('varchar', { length: 500 })
  @IsEmail()
  @IsNotEmpty()
  @Index({ unique: true })
  email: string;

  @Column('text')
  bio = '';

  @Column('varchar', { length: 500 })
  image = '';

  @Column('varchar', { length: 500 })
  @IsNotEmpty()
  password: string;

  @Column('varchar', { array: true })
  roles: string[] = ['user'];

  @OneToMany(() => TickEntity, (tick) => tick.user)
  ticks: TickEntity[];

  @OneToMany(() => TickEntity, (tick) => tick.user)
  hangboardSequences: HangboardSequenceEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  setDefaults(): void {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');
  }
}
