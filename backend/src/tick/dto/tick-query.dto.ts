import { IsOptional, IsEnum } from 'class-validator';
import { Transform, Exclude, Expose } from 'class-transformer';
import { PaginationDto } from '../../shared/pagination.dto';
import { TickTypeEnum, TickStyleEnum } from '../tick.entity';

export class TickQueryDto extends PaginationDto {
  constructor() {
    super();
  }

  @IsOptional()
  @IsEnum(TickStyleEnum)
  @Exclude()
  style: string;

  @IsOptional()
  @IsEnum(TickTypeEnum)
  @Exclude()
  type: string;

  @Expose()
  @IsOptional()
  @Transform((val, self) => {
    return {
      ...(self.type ? { type: self.type } : null),
      ...(self.style ? { style: self.style } : null),
    };
  })
  where: object;
}
