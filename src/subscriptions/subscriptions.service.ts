import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionRepository } from './subscriptions.repository';
import { Subscription } from './entities/subscription.entity';
import { EmailService } from 'src/email/email.service';
import { userSubscriber } from 'src/email/templates/userSubscribe.template';
import { SubsType } from 'src/SuscriptionType/enum/SubsType.enum';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly emailService: EmailService,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    // Cambiar el estado a activo
    createSubscriptionDto.status_sub = true;
    const subs = await this.subscriptionRepository.createSubscription(
      createSubscriptionDto,
    );
    const userSubscribe = userSubscriber(subs.User.name);

    await this.emailService.sendEmailSubscriber(
      subs.User.email,
      '¡Felicitaciones ahora eres un subscriptor de DevNavigator!',
      userSubscribe,
    );
    return subs;
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
