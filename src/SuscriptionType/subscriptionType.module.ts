import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionType } from './entities/subscriptionType.entity';
import { SubscriptionTypeController } from './subscriptionType.controller';
import { SubscriptionTypeRepository } from './subscriptionType.repository';
import { SubscriptionTypeService } from './subscriptionType.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionType])],
  controllers: [SubscriptionTypeController],
  providers: [SubscriptionTypeRepository, SubscriptionTypeService],
  exports: [SubscriptionTypeRepository],
})
export class SubscriptionTypeModule {}
