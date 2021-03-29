import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { JobModule } from './job/job.module';
import { TickModule } from './tick/tick.module';
import { HangboardSequenceModule } from './hangboard-sequence/hangboard-sequence.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    JobModule,
    TickModule,
    HangboardSequenceModule,
    MailModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
