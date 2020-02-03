import { IsInt, Max, Min, IsOptional, IsEnum } from 'class-validator';
import { Transform, Exclude, Expose } from 'class-transformer';

enum SortEnum {
  DESC = 'DESC',
  ASC = 'ASC',
}

export class PaginationDto {
  @IsInt()
  @Min(0)
  @IsOptional()
  @Transform(parseInt)
  skip = 0;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Max(100)
  @Transform(parseInt)
  take = 25;

  @IsOptional()
  @Exclude()
  orderBy = 'createdAt';

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
