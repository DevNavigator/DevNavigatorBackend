import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SubscriptionTypeService } from './subscriptionType.service';
import { CreateSubsTypeDto } from './dto/create-subscriptionType';

@Controller('typeSubs')
export class SubscriptionTypeController {
  constructor(
    private readonly subscriptionTypeService: SubscriptionTypeService,
  ) {}

  @Post()
  async create(@Body() createSub: CreateSubsTypeDto) {
    return this.subscriptionTypeService.create(createSub);
  }

  @Get()
  findAll(@Query('limit') limit = 5, @Query('page') page = 1) {
    return this.subscriptionTypeService.findAll(Number(limit), Number(page));
  }

  @Get('/preLoad')
  seeder() {
    return this.subscriptionTypeService.seeder();
  }

  @Get(':type')
  findOne(@Param('type') type: string) {
    return this.subscriptionTypeService.findOne(type);
  }
}
