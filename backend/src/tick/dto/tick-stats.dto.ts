import { Transform } from 'class-transformer';
import { IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TickStatsDto {
  @IsOptional()
  @IsDateString()
  @ApiProperty()
  @Transform(val => (val ? new Date(val) : undefined))
  startDate: Date;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  @Transform(val => (val ? new Date(val) : undefined))
  endDate: Date;
}
