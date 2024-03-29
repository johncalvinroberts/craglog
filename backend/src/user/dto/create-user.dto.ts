import { IsNotEmpty, MinLength, MaxLength, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(250)
  readonly username: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  @Transform((val) => val.toLowerCase())
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(250)
  readonly password: string;
}

export class AuthenticateUserRo {
  username: string;
  email: string;
  token: string;
  bio?: string;
  image?: string;
  roles: string[];
  readonly id: number;
}
