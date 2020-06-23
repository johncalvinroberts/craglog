import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { RouteEntity } from '../route/route.entity';
import { UserEntity } from '../user/user.entity';
import { TickEntity } from '../tick/tick.entity';
import { HangboardSequenceEntity } from '../hangboard-sequence/hangboard-sequence.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',//eslint-disable-line
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        database: configService.get('POSTGRES_DB'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        entities: [
          RouteEntity,
          UserEntity,
          TickEntity,
          HangboardSequenceEntity,
        ],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
