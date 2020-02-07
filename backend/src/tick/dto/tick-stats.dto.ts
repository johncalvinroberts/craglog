import { Transform } from 'class-transformer';
import { IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TickStatsDto {
  @IsOptional()
  @Transform(decodeURIComponent)
  @IsDateString()
  @ApiProperty()
  startDate: Date;

  @IsOptional()
  @Transform(decodeURIComponent)
  @IsDateString()
  @ApiProperty()
  endDate: Date;
}
