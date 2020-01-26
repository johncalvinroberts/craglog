import {
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Controller,
  UsePipes,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserData } from './user.interface';
import { UpdateUserDto, LoginUserDto } from './dto';
import { User } from './user.decorator';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { UserEntity } from './user.entity';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async findMe(@User('email') email: string): Promise<UserData> {
    return await this.userService.findByEmail(email);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() userData: UserEntity) {
    return this.userService.create(userData);
  }

  @Put()
  async update(@User('id') userId: number, @Body() userData: UpdateUserDto) {
    return await this.userService.update(userId, userData);
  }

  @Delete(':slug')
  async delete(@Param() params) {
    return await this.userService.delete(params.slug);
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserData> {
    const maybeUser = await this.userService.findOne(loginUserDto);

    const errors = { User: ' not found' };
    if (!maybeUser) throw new HttpException({ errors }, 401);

    const token = await this.userService.generateJWT(maybeUser);
    const { email, username, bio, image } = maybeUser;
    return { email, token, username, bio, image };
  }
}
