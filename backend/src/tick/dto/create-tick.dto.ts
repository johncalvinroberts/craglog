import {
  IsEnum,
  IsNotEmpty,
  ValidateIf,
  IsOptional,
  MaxLength,
  IsDateString,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TickTypeEnum, TickStyleEnum, routeStyles } from '../tick.entity';

export class CreateTickDto {
  @IsEnum(TickTypeEnum)
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(500)
  readonly type: string;

  @IsEnum(TickStyleEnum)
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(500)
  readonly style: string;

  @ValidateIf(tick => routeStyles.includes(tick.style))
  @IsOptional()
  @ApiProperty()
  routeId: string;

  @IsOptional()
  @MaxLength(2000)
  @ApiProperty()
  notes = '';

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  tickDate: Date;

  @Max(10)
  @IsOptional()
  @ApiProperty()
  physicalRating: number;
}
