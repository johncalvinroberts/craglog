import {
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Controller,
  UseGuards,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserData } from './user.interface';
import { UpdateUserDto, LoginUserDto } from './dto';
import { User } from '../shared/decorators/user.decorator';
import { UserEntity } from './user.entity';
import { RolesGuard } from '../shared/guards/roles.guard';
import { AuthGuard } from '../shared/guards/auth.guard';
import { Roles } from '../shared/decorators/roles.decorator';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async find() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('me')
  findMe(@User('email') email: string): Promise<UserData> {
    return this.userService.findByEmail(email);
  }

  @Post()
  create(@Body() userData: UserEntity) {
    return this.userService.create(userData);
  }

  @Put()
  update(@User('id') userId: number, @Body() userData: UpdateUserDto) {
    return this.userService.update(userId, userData);
  }

  @Delete(':slug')
  delete(@Param() params) {
    return this.userService.delete(params.slug);
  }

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
