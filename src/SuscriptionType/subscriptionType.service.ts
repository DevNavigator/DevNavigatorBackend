import { Injectable } from '@nestjs/common';
import { SubscriptionTypeRepository } from './subscriptionType.repository';
import { SubscriptionType } from './entities/subscriptionType.entity';
import { SubsType } from './enum/SubsType.enum';

@Injectable()
export class SubscriptionTypeService {
  constructor(
    private readonly subscriptionTypeRepository: SubscriptionTypeRepository,
  ) {}
  async create(createSub) {
    const typeSub = await this.subscriptionTypeRepository.create(createSub);
    return typeSub;
  }
  async findAll(limit: number, page: number) {
    const start = (page - 1) * limit;
    const end = start + limit;
    const subs = await this.subscriptionTypeRepository.findAll();
    return subs.slice(start, end); // falta
  }
  async findOne(type: string) {
    return this.subscriptionTypeRepository.findOne(type);
  }

  async seeder() {
    const existingSubscription =
      await this.subscriptionTypeRepository.findOneByType();

    if (!existingSubscription) {
      const subcriptionType = new SubscriptionType();
      subcriptionType.name = 'Suscripción Estandar';
      subcriptionType.type = SubsType.Mensual;
      subcriptionType.price = 100;
      await this.subscriptionTypeRepository.save(subcriptionType);
    }
  }
}
