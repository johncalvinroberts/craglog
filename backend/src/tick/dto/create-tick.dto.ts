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
import { LocationDto } from '../../shared/location.dto';
import { RouteSnapshot } from '../tick.entity';

export class CreateTickDto {
  @IsEnum(TickTypeEnum)
  @ApiProperty()
  @IsOptional()
  @MaxLength(500)
  type: string;

  @IsEnum(TickStyleEnum)
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(500)
  style: string;

  @ValidateIf((tick) => routeStyles.includes(tick.style))
  @IsOptional()
  @ApiProperty()
  routeSnapshot: RouteSnapshot;

  @IsOptional()
  @MaxLength(2000)
  @ApiProperty()
  notes = '';

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  tickDate: Date;

  @Max(100)
  @IsOptional()
  @ApiProperty()
  physicalRating: number;

  @IsOptional()
  @MaxLength(500)
  gymName = '';

  @IsOptional()
  location: LocationDto;
}
