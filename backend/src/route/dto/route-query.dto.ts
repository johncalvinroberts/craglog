import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../shared/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RouteQueryDto extends PaginationDto {
  constructor() {
    super();
  }

  @IsOptional()
  @ApiProperty()
  @Transform((val) => (val ? `%${val}%` : undefined))
  name = '';

  @IsOptional()
  @ApiProperty()
  @Transform((val) => (val ? val.split(',').map(parseFloat) : undefined))
  origin = '';
}
