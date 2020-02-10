import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HangboardSequenceController } from './hangboard-sequence.controller';
import { HangboardSequenceService } from './hangboard-sequence.service';
import { HangboardSequenceEntity } from './hangboard-sequence.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HangboardSequenceEntity]),
    ConfigModule,
    UserModule,
  ],
  controllers: [HangboardSequenceController],
  providers: [HangboardSequenceService],
})
export class HangboardSequenceModule {}
