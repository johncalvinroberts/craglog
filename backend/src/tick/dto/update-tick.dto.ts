import {
  IsEnum,
  IsNotEmpty,
  ValidateIf,
  IsOptional,
  MaxLength,
  IsDate,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TickTypeEnum, TickStyleEnum, routeStyles } from '../tick.entity';

export class UpdateTickDto {
  @ApiProperty()
  @IsEnum(TickTypeEnum)
  @IsNotEmpty()
  @MaxLength(500)
  readonly type: string;

  @ApiProperty()
  @IsEnum(TickStyleEnum)
  @IsNotEmpty()
  @MaxLength(500)
  readonly style: string;

  @ApiProperty()
  @ValidateIf(tick => routeStyles.includes(tick.style))
  @IsOptional()
  routeId: string;

  @ApiProperty()
  @IsOptional()
  @MaxLength(2000)
  notes: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  tickDate: Date;

  @ApiProperty()
  @Max(10)
  @IsOptional()
  physicalRating: number;
}
