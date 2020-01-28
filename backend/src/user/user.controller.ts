import {
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Controller,
  UseGuards,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  UpdateUserDto,
  LoginUserDto,
  CreateUserDto,
  FindUserDto,
  AuthenticateUserRo,
} from './dto';
import { User } from '../shared/decorators/user.decorator';
import { RolesGuard } from '../shared/guards/roles.guard';
import { AuthGuard } from '../shared/guards/auth.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { PaginationDto } from '../shared/pagination.dto';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  find(@Query() query: PaginationDto) {
    return this.userService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  findMe(@User('email') email: string): Promise<FindUserDto> {
    return this.userService.findByEmail(email);
  }

  @Post()
  create(@Body() payload: CreateUserDto) {
    return this.userService.create(payload);
  }

  @Patch()
  @UseGuards(AuthGuard)
  update(@User() user, @Body() payload: UpdateUserDto): Promise<FindUserDto> {
    return this.userService.update(user, payload);
  }

  @Delete(':slug')
  delete(@Param() params) {
    return this.userService.delete(params.slug);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<AuthenticateUserRo> {
    const maybeUser = await this.userService.findOne(loginUserDto);

    const errors = { User: ' not found' };
    if (!maybeUser) throw new UnauthorizedException({ errors });

    return this.userService.buildAuthRO(maybeUser);
  }
}
