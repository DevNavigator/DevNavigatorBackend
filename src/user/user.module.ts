import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { EmailModule } from 'src/email/email.module';
import { cloudinaryConfig } from 'src/config/cloudinary.config';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EmailModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, cloudinaryConfig],
  exports: [UserService, UserRepository, TypeOrmModule],
})
export class UserModule {}
