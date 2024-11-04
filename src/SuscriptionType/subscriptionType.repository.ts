import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionType } from './entities/subscriptionType.entity';
import { Repository } from 'typeorm';
import { SubsType } from './enum/SubsType.enum';

@Injectable()
export class SubscriptionTypeRepository {
  constructor(
    @InjectRepository(SubscriptionType)
    private readonly subscriptionTypeRepository: Repository<SubscriptionType>,
  ) {}
  async create(createSubscription) {
    const newSub = this.subscriptionTypeRepository.create(createSubscription);
    return await this.subscriptionTypeRepository.save(newSub);
  }

  async findAll() {
    return await this.subscriptionTypeRepository.find();
  }

  async findOne(type: string) {
    if (type !== 'MENSUAL') {
      return new BadRequestException('Error en el tipo de suscripcion.');
    }
    const typeSub = await this.subscriptionTypeRepository.findOne({
      where: { type: SubsType.Mensual },
    });
    return typeSub;
  }

  async save(subscription) {
    return this.subscriptionTypeRepository.save(subscription);
  }

  async findOneByType() {
    const typeSub = await this.subscriptionTypeRepository.findOne({
      where: { type: SubsType.Mensual },
    });
    return typeSub;
  }
}
