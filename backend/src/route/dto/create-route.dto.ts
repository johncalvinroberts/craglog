import { IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Location } from '../route.entity';

export class CreateRouteDto {
  @ApiProperty()
  @IsNotEmpty()
  externalId: string;

  @ApiProperty()
  @IsNotEmpty()
  externalCragId: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  cragName: string;

  @ApiProperty()
  @IsOptional()
  region: string;

  @ApiProperty()
  @IsOptional()
  area: string;

  @ApiProperty()
  @IsOptional()
  grade: string;

  @ApiProperty()
  @IsOptional()
  @Transform((val = []) => {
    const [latitude, longitude] = val
      .filter(Boolean)
      .map(item => parseFloat(item));
    return {
      type: 'Point',
      coordinates: [latitude || 0, longitude || 0],
    };
  })
  location: Location;

  @ApiProperty()
  @IsOptional()
  height: number;

  @ApiProperty()
  @IsOptional()
  bolts: number;

  @ApiProperty()
  @IsOptional()
  style: string;
}
