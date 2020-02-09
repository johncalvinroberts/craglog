import { Module } from '@nestjs/common';
import { HangboardController } from './hangboard.controller';
import { HangboardService } from './hangboard.service';

@Module({
  controllers: [HangboardController],
  providers: [HangboardService]
})
export class HangboardModule {}
