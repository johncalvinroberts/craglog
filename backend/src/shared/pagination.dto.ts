import { IsInt, Max, Min, IsOptional, IsEnum } from 'class-validator';
import { Transform, Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

enum SortEnum {
  DESC = 'DESC',
  ASC = 'ASC',
}

export class PaginationDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @IsOptional()
  @Transform(parseInt)
  skip = 0;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @IsOptional()
  @Max(100)
  @Transform(parseInt)
  take = 25;

  @ApiProperty()
  @IsOptional()
  @Exclude()
  orderBy = 'createdAt';

  @ApiProperty()
  @IsOptional()
  @IsEnum(SortEnum)
  @Exclude()
  sort = 'DESC';

  @Expose()
  @IsOptional()
  @Transform((val, obj: PaginationDto) =>
    obj.orderBy ? { [obj.orderBy]: obj.sort } : undefined,
  )
  order: object;
}
