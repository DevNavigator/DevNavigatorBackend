import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class SubscriptionRepository {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly userRepository: UserRepository,
  ) {}

  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const user = await this.userRepository.findOne(
      createSubscriptionDto.userId,
    );

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const subscriptionExists = await this.subscriptionRepository.findOne({
      where: { User: { id: user.id }, status_sub: true },
    });

    if (subscriptionExists) {
      throw new ConflictException('User already subscribed.');
    }

    const subscription = this.subscriptionRepository.create(
      createSubscriptionDto,
    );
    subscription.User = user;
    return await this.subscriptionRepository.save(subscription);
  }

  async findAll(): Promise<Subscription[]> {
    return await this.subscriptionRepository.find();
  }

  async findOne(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['User'],
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    return subscription;
  }

  async update(subscription: Subscription): Promise<Subscription> {
    return await this.subscriptionRepository.save(subscription);
  }

  async removeSubscription(id: string): Promise<string> {
    const subscription = await this.findOne(id);

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    await this.subscriptionRepository.delete(id);

    return id;
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    return await this.subscriptionRepository.find({
      where: { User: { id: userId } },
      relations: ['User'],
    });
  }

  async findByEmail(email: string): Promise<Subscription[]> {
    const user = await this.userRepository.findOneByEmail(email);
    if (user) {
      return await this.findByUserId(user.id);
    }
    return [];
  }
}
