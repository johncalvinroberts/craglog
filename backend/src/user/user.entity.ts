import {
  Entity,
  ObjectIdColumn,
  ObjectID,
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
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  @Index({ unique: true })
  @IsNotEmpty()
  username: string;

  @Column()
  @IsEmail()
  @IsNotEmpty()
  @Index({ unique: true })
  email: string;

  @Column()
  bio = '';

  @Column()
  image = '';

  @Column()
  @IsNotEmpty()
  password: string;

  @Column()
  roles: string[] = ['user'];

  @BeforeInsert()
  setDefaults(): void {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');
  }

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
