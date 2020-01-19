import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { JobController } from './job.controller';
import { JobService } from './job.service';

@Module({
  imports: [
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
  providers: [JobService],
})
export class JobModule {}
