// src/statistics/statistics.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statistics } from './entities/statistic.entity';
import { User } from 'src/user/entities/user.entity';

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
  async clearStatistics(user: User) {
    if (user.statistics && user.statistics.length > 0) {
      user.statistics[0].totalPoints = 0;
      user.statistics[0].achievements = [];

      await this.statisticsRepository.update(user.statistics[0].id, {
        totalPoints: 0,
        achievements: [],
      });
    } else {
      console.log('No statistics found for the user');
    }
  }

  async updateStatistics(
    userId: string,
    totalPoints: number,
    achievements: Array<{ title: string; date: string }>,
  ) {
    const stats = await this.findByUserId(userId);
    if (!stats) {
      throw new NotFoundException('Estadisticas del usuario no encontradas.');
    }
    const newAchievements = achievements.filter(
      (achievement) =>
        !stats.achievements.some(
          (existingAchievement) =>
            existingAchievement.title === achievement.title,
        ),
    );
    if (newAchievements.length > 0) {
      stats.totalPoints += totalPoints;
      stats.achievements.push(...newAchievements);
      stats.lastUpdated = new Date();
      return await this.statisticsRepository.save(stats);
    } else {
      console.log('No puede sumar', achievements, totalPoints);
    }
    return stats;
  }
}
