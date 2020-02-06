import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';

/*
ADMIN_PASS
ADMIN_EMAIL
ADMIN_USER
USER_ONE_PASS
USER_ONE_EMAIL
USER_ONE_USER
*/
@Injectable()
export class SeederService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async seed() {
    const admin = new UserEntity();
    admin.username = this.configService.get('ADMIN_USER');
    admin.email = this.configService.get('ADMIN_EMAIL');
    admin.password = this.configService.get('ADMIN_PASS');
    admin.roles = ['user', 'admin'];
    const adminUser = await this.userRepository.save(admin);
    console.log({ adminUser });
  }
}
