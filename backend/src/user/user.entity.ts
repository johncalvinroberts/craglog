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
import { IsEmail } from 'class-validator';
import * as crypto from 'crypto';

@Entity('user')
export class UserEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  @Index({ unique: true })
  username: string;

  @Column()
  @IsEmail()
  @Index({ unique: true })
  email: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  image: string;

  @Column()
  password: string;

  @Column({ default: ['user'] })
  roles: string[];

  @BeforeInsert()
  setDefaults(): void {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');
    if (!this.roles) this.roles = ['user'];
  }

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
