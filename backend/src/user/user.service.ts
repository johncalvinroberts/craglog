import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, MoreThan } from 'typeorm';
import { randomBytes as randomBytesCallback } from 'crypto';
import { promisify } from 'util';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from './user.entity';
import {
  LoginUserDto,
  UpdateUserDto,
  CreateUserDto,
  AuthenticateUserRo,
  FindUserDto,
  ForgottenPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto';
import { MailService } from '../mail/mail.service';
import { PaginationDto } from '../shared/pagination.dto';
import {
  UserNotFoundException,
  EmailAlreadyUsedException,
  PasswordResetTokenInvalidException,
  PasswordMismatchException,
} from '../shared/exceptions';
import { throws } from 'assert';

const randomBytes = promisify(randomBytesCallback);

// TODO: seperate the user vs. auth stuff

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async findAll(query: PaginationDto): Promise<FindUserDto[]> {
    const res = await this.userRepository.find(query);
    return res.map((item) => this.buildUserResponse(item));
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

  async create(body: CreateUserDto): Promise<AuthenticateUserRo> {
    const { username, email, password } = body;

    // create new user
    const newUser = new UserEntity();
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;

    try {
      const savedUser = await this.userRepository.save(newUser);
      process.nextTick(() => this.sendWelcomeEmail(email, username));
      return this.buildAuthResponse(savedUser);
    } catch (error) {
      if (parseInt(error.code) === 23505) {
        throw EmailAlreadyUsedException();
      } else {
        throw error;
      }
    }
  }

  async update(user: UserEntity, payload: UpdateUserDto): Promise<FindUserDto> {
    const update = { ...user, ...payload };
    const updated = await this.userRepository.save(update);
    return this.buildUserResponse(updated);
  }

  delete(targetUserId: number, userId: number): Promise<DeleteResult> {
    if (targetUserId !== userId) {
      throw new UnauthorizedException();
    }
    return this.userRepository.delete({ id: targetUserId });
  }

  async findById(id: number): Promise<FindUserDto> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw UserNotFoundException();
    }

    return this.buildUserResponse(user);
  }

  async findByEmail(email: string): Promise<FindUserDto> {
    const user = await this.userRepository.findOne({ email: email });
    return this.buildUserResponse(user);
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

  buildAuthResponse(user: UserEntity): AuthenticateUserRo {
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

  buildUserResponse(user: UserEntity): FindUserDto {
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

  async getStats() {
    const now: Date = new Date();
    const oneWeekAgo: Date = new Date(new Date().setDate(now.getDate() - 7));
    const oneMonthAgo: Date = new Date(new Date().setMonth(now.getMonth() - 7));

    const totalPromise = this.userRepository.count();
    const weekPromise = this.userRepository.count({
      where: { createdAt: MoreThan(oneWeekAgo) },
    });
    const monthPromise = this.userRepository.count({
      where: { createdAt: MoreThan(oneMonthAgo) },
    });
    const [total, week, month] = await Promise.all([
      totalPromise,
      weekPromise,
      monthPromise,
    ]);
    return { total, week, month };
  }

  async sendForgottenPasswordEmail(
    payload: ForgottenPasswordDto,
  ): Promise<{ success: boolean }> {
    const { email } = payload;
    const user = await this.userRepository.findOne({ email: email });
    if (!user) {
      // bail here if no user, don't expose to client if not found
      return { success: true };
    }
    const resetToken = (await randomBytes(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await this.userRepository.save(user);
    // reference: https://github.com/wesbos/Advanced-React/blob/fc2b4ef305ccafc6a5cc7aa15446b7f10650fd0e/finished-application/backend/src/resolvers/Mutation.js#L133-L141
    const frontendUrl = this.configService.get('FRONTEND_URL');
    await this.mailService.sendANiceEmail({
      subject: 'Your password reset',
      to: user.email,
      text: `Your Password Reset is Here!
      \n\n
      <a href="${frontendUrl}/reset?resetToken=${resetToken}&email=${user.email}">Click Here to Reset</a>`,
    });
    return { success: true };
  }

  async resetPassword(payload: ResetPasswordDto): Promise<AuthenticateUserRo> {
    const { resetToken, password } = payload;
    const user = await this.userRepository.findOne({
      where: {
        resetToken,
        resetTokenExpiry: MoreThan(Date.now() - 3600000),
      },
    });

    if (!user) {
      throw PasswordResetTokenInvalidException();
    }
    user.resetTokenExpiry = null;
    user.resetToken = null;
    user.password = password; // this will get encrypted by the user model/entity
    await this.userRepository.save(user);
    return this.buildAuthResponse(user);
  }

  async sendWelcomeEmail(email: string, username) {
    return this.mailService.sendANiceEmail({
      subject: 'Welcome to Craglog',
      to: email,
      text: `Hi, ${username}!
      \n\n
      <p>
        We just wanted to send a welcome email to say thanks for trying out Craglog.
      </p
      \n\n
      <p>
        If you have any questions, feedback, or just want to get in contact, just respond to this email, or send an email to <a href="mailto:emails@craglog.cc">emails@craglog.cc</a>
      </p>`,
    });
  }

  async changePassword(
    body: ChangePasswordDto,
    user: FindUserDto,
  ): Promise<{ success: boolean }> {
    const previousUser = await this.userRepository.findOneOrFail(user.id);
    const previousPasswordDigest = previousUser.password;
    const previousPasswordDigestGivenByUser = crypto
      .createHmac('sha256', body.oldPassword)
      .digest('hex');
    if (previousPasswordDigest !== previousPasswordDigestGivenByUser) {
      throw PasswordMismatchException();
    }
    previousUser.password = body.newPassword;
    await this.userRepository.save(previousUser);
    return { success: true };
  }
}
