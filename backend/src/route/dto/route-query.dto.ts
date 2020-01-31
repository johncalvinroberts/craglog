import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../shared/pagination.dto';

export class RouteQueryDto extends PaginationDto {
  constructor() {
    super();
  }

  @IsOptional()
  @Transform(val => (val ? `%${val}%` : undefined))
  name = '';
}
