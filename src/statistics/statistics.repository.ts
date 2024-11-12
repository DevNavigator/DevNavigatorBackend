// src/statistics/statistics.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statistics } from './entities/statistic.entity';

@Injectable()
export class StatisticsRepository {
  constructor(
    @InjectRepository(Statistics)
    private readonly statisticsRepository: Repository<Statistics>,
  ) {}

  async createStatistics(userId: string): Promise<Statistics> {
    const stats = this.statisticsRepository.create({
      user: { id: userId },
      totalPoints: 0,
      achievements: [],
    });
    return await this.statisticsRepository.save(stats);
  }

  async findByUserId(userId: string): Promise<Statistics> {
    return await this.statisticsRepository.findOne({
      where: { user: { id: userId } },
    });
  }

  async updateStatistics(
    userId: string,
    totalPoints: number,
    achievements: Array<{ title: string; date: string }>,
  ) {
    const stats = await this.findByUserId(userId);
    if (stats) {
      stats.totalPoints += totalPoints;
      stats.achievements.push(...achievements);
      stats.lastUpdated = new Date();
      return await this.statisticsRepository.save(stats);
    }
    return null;
  }
}
