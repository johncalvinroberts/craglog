import { Module } from '@nestjs/common';
import { HangboardSequenceController } from './hangboard-sequence.controller';
import { HangboardSequenceService } from './hangboard-sequence.service';

@Module({
  controllers: [HangboardSequenceController],
  providers: [HangboardSequenceService],
})
export class HangboardSequenceModule {}
