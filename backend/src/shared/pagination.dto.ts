import { IsInt, Max, Min, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
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
  where: any;
}
