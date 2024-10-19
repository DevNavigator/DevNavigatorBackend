import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionRepository } from './subscriptions.repository';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async create(
    userId: string,
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    // Cambiar el estado a activo
    createSubscriptionDto.status_sub = true;
    createSubscriptionDto.userId = userId;
    return await this.subscriptionRepository.createSubscription(
      createSubscriptionDto,
    );
  }

  async findAll(limit: number, page: number): Promise<Subscription[]> {
    const start = (page - 1) * limit;
    const end = start + limit;
    const subscriptions = await this.subscriptionRepository.findAll();

    return subscriptions.slice(start, end);
  }

  async findOne(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne(id);
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    return subscription;
  }

  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne(id);
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    if (updateSubscriptionDto.status_sub !== undefined) {
      subscription.status_sub = updateSubscriptionDto.status_sub;
    }

    return await this.subscriptionRepository.update(subscription);
  }

  async remove(id: string): Promise<string> {
    return await this.subscriptionRepository.removeSubscription(id);
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    return await this.subscriptionRepository.findByUserId(userId);
  }

  async findByEmail(email: string): Promise<Subscription[]> {
    return await this.subscriptionRepository.findByEmail(email);
  }
}
