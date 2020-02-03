import { IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  location: string;

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
