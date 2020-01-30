import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import * as crypto from 'crypto';

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

  @BeforeInsert()
  setDefaults(): void {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
