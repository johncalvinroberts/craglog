import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { Like } from 'typeorm';
import { PaginationDto } from '../../shared/pagination.dto';

export class RouteQueryDto extends PaginationDto {
  constructor() {
    super();
  }

  @IsOptional()
  @Transform(val => (val ? Like(`%${val}#%`) : undefined))
  name = 25;
}
