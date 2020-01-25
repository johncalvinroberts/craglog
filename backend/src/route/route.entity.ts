import {
  Column,
  Entity,
  ObjectID,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('route')
export class RouteEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  externalId: string;

  @Column()
  bolts: number;

  @Column()
  height: number;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @Column()
  grade: string;

  @Column()
  name: string;

  @Column()
  style: string;

  @Column()
  region: string;

  @Column()
  area: string;

  @Column()
  cragName: string;

  @Column()
  externalCragId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
