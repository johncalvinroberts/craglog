import { MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @ApiProperty({ example: 'password', minLength: 8 })
  readonly oldPassword: string;

  @ApiProperty({ example: 'password', minLength: 8 })
  @MinLength(8)
  readonly newPassword: string;
}
