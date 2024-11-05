import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course } from './entities/course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesRepository } from './courses.repository';
import { cloudinaryConfig } from 'src/config/cloudinary.config';

import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), UserModule],
  controllers: [CoursesController],
  providers: [CoursesService, CoursesRepository, cloudinaryConfig],
  exports: [CoursesRepository],
})
export class CoursesModule {}
