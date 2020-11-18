import { Module } from '@nestjs/common';
import { TickController } from './tick.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TickService } from './tick.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { TickEntity } from './tick.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TickEntity]), UserModule, ConfigModule],
  controllers: [TickController],
  providers: [TickService],
})
export class TickModule {}
