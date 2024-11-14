// src/statistics/statistics.service.ts
import { Injectable } from '@nestjs/common';
import { StatisticsRepository } from './statistics.repository';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class StatisticsService {
  constructor(private statisticsRepository: StatisticsRepository) {}

  async initializeStatistics(userId: string) {
    return await this.statisticsRepository.createStatistics(userId);
  }

  async getUserStatistics(userId: string) {
    return await this.statisticsRepository.findByUserId(userId);
  }

  async clearStatistics(user: User) {
    return await this.statisticsRepository.clearStatistics(user);
  }
  async updateUserStatistics(
    userId: string,
    points: number,
    achievements: Array<{ title: string; date: string }>,
  ) {
    return await this.statisticsRepository.updateStatistics(
      userId,
      points,
      achievements,
    );
  }
}
