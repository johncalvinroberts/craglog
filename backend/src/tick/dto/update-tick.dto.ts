import {
  IsEnum,
  IsNotEmpty,
  ValidateIf,
  IsOptional,
  Max,
} from 'class-validator';
import { TickTypeEnum, TickStyleEnum, routeStyles } from '../tick.entity';

export class UpdateTickDto {
  @IsEnum(TickTypeEnum)
  @IsNotEmpty()
  @Max(500)
  readonly type: string;

  @IsEnum(TickStyleEnum)
  @IsNotEmpty()
  @Max(500)
  readonly style: string;

  @ValidateIf(tick => routeStyles.includes(tick.style))
  @IsOptional()
  routeId: string;

  @IsOptional()
  @Max(2000)
  notes: string;
}
