// src/statistics/statistics.controller.ts
import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get(':userId')
  async getUserStatistics(@Param('userId') userId: string) {
    return this.statisticsService.getUserStatistics(userId);
  }

  @Patch(':userId/update')
  async updateUserStatistics(
    @Param('userId') userId: string,
    @Body('points') points: number,
    @Body('achievements') achievements: Array<{ title: string; date: string }>,
  ) {
    return this.statisticsService.updateUserStatistics(
      userId,
      points,
      achievements,
    );
  }
}
