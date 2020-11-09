import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JobController } from './job.controller';
import { JobProcessor } from './job.processor';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'scraper',
    }),
    ConfigModule,
    UserModule,
  ],
  controllers: [JobController],
  providers: [JobProcessor],
})
export class JobModule {}
