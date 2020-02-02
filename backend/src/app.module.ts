import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { RouteModule } from './route/route.module';
import { UserModule } from './user/user.module';
import { JobModule } from './job/job.module';
import { TickModule } from './tick/tick.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    RouteModule,
    UserModule,
    JobModule,
    TickModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
