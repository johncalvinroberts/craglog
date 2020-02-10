import { IsOptional, IsBooleanString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../shared/pagination.dto';

export class HangboardSequenceQueryDto extends PaginationDto {
  constructor() {
    super();
  }

  @ApiProperty()
  @IsBooleanString()
  @IsOptional()
  @Transform(val => val === 'true')
  isPublic = 'false';
}
