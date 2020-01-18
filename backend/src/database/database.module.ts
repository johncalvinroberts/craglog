import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { Route } from '../route/route.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mongodb' as 'mongodb',
        host: configService.get('DATABASE_HOST'),
        database: configService.get('DATABASE_NAME'),
        port: configService.get('DATABASE_PORT'),
        entities: [Route],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
