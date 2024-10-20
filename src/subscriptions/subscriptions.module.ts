import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { Subscription } from './entities/subscription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionRepository } from './subscriptions.repository';
import { UserModule } from 'src/user/user.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription]), UserModule, EmailModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, SubscriptionRepository],
})
export class SubscriptionsModule {}
