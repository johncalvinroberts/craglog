import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from '../database/database.module';
import { UserEntity } from '../user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([UserEntity]),
    DatabaseModule,
    UserModule,
  ],
  providers: [SeederService],
})
export class SeederModule {}
