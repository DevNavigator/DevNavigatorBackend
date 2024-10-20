import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [UserModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
