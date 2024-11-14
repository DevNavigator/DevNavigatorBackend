import { Module, forwardRef } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Statistics } from './entities/statistic.entity';
import { StatisticsRepository } from './statistics.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Statistics]),
    forwardRef(() => UserModule),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService, StatisticsRepository],
  exports: [StatisticsService],
})
export class StatisticsModule {}
