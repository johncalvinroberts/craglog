import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ConfigModule, UserModule],
  controllers: [JobController],
})
export class JobModule {}
