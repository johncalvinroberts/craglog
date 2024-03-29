import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { JobModule } from './job/job.module';
import { TickModule } from './tick/tick.module';
import { HangboardSequenceModule } from './hangboard-sequence/hangboard-sequence.module';
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
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          redis: {
            port: configService.get('REDIS_PORT'),
            host: configService.get('REDIS_HOST'),
          },
        };
      },
    }),
  ],
  controllers: [AppController, AuthController],
})
export class AppModule {}
