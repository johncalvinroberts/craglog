import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { RouteModule } from '../route/route.module';
import { ListProcessor } from './processors/list.processor';
import { RouteProcessor } from './processors/route.processor';

@Module({
  imports: [
    RouteModule,
    BullModule.registerQueueAsync(
      {
        name: 'route',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          redis: {
            host: configService.get('QUEUE_HOST'),
            port: configService.get('QUEUE_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'list',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          redis: {
            host: configService.get('QUEUE_HOST'),
            port: configService.get('QUEUE_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ),
  ],
  controllers: [JobController],
  providers: [JobService, ListProcessor, RouteProcessor],
})
export class JobModule {}
