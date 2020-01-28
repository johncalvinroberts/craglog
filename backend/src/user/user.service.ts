import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { UserEntity } from './user.entity';
import {
  LoginUserDto,
  UpdateUserDto,
  CreateUserDto,
  AuthenticateUserRo,
  FindUserDto,
} from './dto';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { PaginationDto } from 'src/shared/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  async findAll(query: PaginationDto): Promise<FindUserDto[]> {
    const res = await this.userRepository.find(query);
    return res.map(item => this.buildUserRO(item));
  }

  findOne(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const findOneOptions = {
      email: loginUserDto.email,
      password: crypto
        .createHmac('sha256', loginUserDto.password)
        .digest('hex'),
    };

    return this.userRepository.findOne(findOneOptions);
  }

  async create(dto: CreateUserDto): Promise<AuthenticateUserRo> {
    const { username, email, password } = dto;

    // create new user
    const newUser = new UserEntity();
    newUser.username = username;
    newUser.email = email.toLowerCase();
    newUser.password = password;

    try {
      const savedUser = await this.userRepository.save(newUser);
      return this.buildAuthRO(savedUser);
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException({
          message: 'Username or email is taken',
        });
      } else {
        throw error;
      }
    }
  }

  async update(user: UserEntity, dto: UpdateUserDto): Promise<FindUserDto> {
    const update = Object.assign(user, dto);
    const updated = await this.userRepository.save(update);
    return this.buildUserRO(updated);
  }

  delete(email: string): Promise<DeleteResult> {
    return this.userRepository.delete({ email: email });
  }

  async findById(id: number): Promise<FindUserDto> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      const errors = { User: ' not found' };
      throw new UnauthorizedException({ errors });
    }

    return this.buildUserRO(user);
  }

  async findByEmail(email: string): Promise<FindUserDto> {
    const user = await this.userRepository.findOne({ email: email });
    return this.buildUserRO(user);
  }

  public generateJWT(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        exp: exp.getTime() / 1000,
      },
      this.configService.get('JWT_SECRET'),
    );
  }

  buildAuthRO(user: UserEntity): AuthenticateUserRo {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      token: this.generateJWT(user),
      image: user.image,
      roles: user.roles,
    };
  }

  buildUserRO(user: UserEntity): FindUserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      image: user.image,
      roles: user.roles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
