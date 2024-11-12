import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/user.repository';
import { EmailModule } from 'src/email/email.module';
import { StatisticsModule } from 'src/statistics/statistics.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EmailModule, StatisticsModule],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
