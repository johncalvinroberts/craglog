import { IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
export class PaginationDto {
  @IsInt()
  @Transform(parseInt)
  offset = 0;

  @IsInt()
  @Transform(parseInt)
  limit = 25;

  where: any;
}
