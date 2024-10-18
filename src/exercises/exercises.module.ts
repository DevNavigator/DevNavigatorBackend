import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { Exercise } from './entities/exercise.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseRepository } from './exercises.repository';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise]), CoursesModule],
  controllers: [ExercisesController],
  providers: [ExercisesService, ExerciseRepository],
})
export class ExercisesModule {}
