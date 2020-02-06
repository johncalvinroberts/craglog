import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LocationDto } from '../shared/location.dto';

@Entity('route')
export class RouteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('varchar', { nullable: true })
  externalId = '';

  @Column('varchar', { nullable: true })
  bolts = 0;

  @Column('geography', { nullable: true })
  location: LocationDto;

  @Column('varchar', { nullable: true })
  grade = '';

  @Column('varchar', { nullable: true })
  name = '';

  @Column('varchar', { nullable: true })
  style = '';

  @Column('varchar', { nullable: true })
  region = '';

  @Column('varchar', { nullable: true })
  area = '';

  @Column('varchar', { nullable: true })
  cragName = '';

  @Column('varchar', { nullable: true })
  externalCragId = '';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
