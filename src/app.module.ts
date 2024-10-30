import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { CoursesModule } from './courses/courses.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ExercisesModule } from './exercises/exercises.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailModule } from './email/email.module';
import { NotificationsService } from './notifications/notifications.service';
import { NotificationsModule } from './notifications/notifications.module';
import { CoursesService } from './courses/courses.service';
import { log } from 'console';
import { SubscriptionTypeModule } from './SuscriptionType/subscriptionType.module';
import { SubscriptionTypeService } from './SuscriptionType/subscriptionType.service';
import { SubscriptionTypeRepository } from './SuscriptionType/subscriptionType.repository';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '3h' },
      secret: process.env.JWT_SECRET,
    }),
    EmailModule,
    ScheduleModule.forRoot(),
    UserModule,
    CoursesModule,
    SubscriptionsModule,
    ExercisesModule,
    AuthModule,
    FileUploadModule,
    NotificationsModule,
    SubscriptionTypeModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    NotificationsService,
    CoursesService,
    SubscriptionTypeService,
  ],
})
export class AppModule {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly subscriptionType: SubscriptionTypeService,
  ) {}
  async onModuleInit() {
    await this.coursesService.addCourses();
    await this.subscriptionType.seeder();
  }
}
