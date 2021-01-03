import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Transform, Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../shared/pagination.dto';
import { TickTypeEnum, TickStyleEnum } from '../tick.entity';

export class TickQueryDto extends PaginationDto {
  constructor() {
    super();
  }

  @ApiProperty()
  @IsOptional()
  @IsEnum(TickStyleEnum)
  style: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(TickTypeEnum)
  @Exclude()
  type: string;

  @ApiProperty()
  @IsOptional()
  @Exclude()
  orderBy = 'tickDate';

  @ApiProperty()
  @Expose()
  @IsOptional()
  @Transform((val, self) => {
    return {
      ...(self.type ? { type: self.type } : null),
      ...(self.style ? { style: self.style } : null),
    };
  })
  where: unknown;

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
