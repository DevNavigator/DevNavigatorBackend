import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExerciseRepository } from './exercises.repository';
import { CoursesRepository } from 'src/courses/courses.repository';

@Injectable()
export class ExercisesService {
  constructor(
    private readonly exerciseRepository: ExerciseRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}
  async findAll(limit: number, page: number) {
    const start = (page - 1) * limit;
    const end = start + limit;
    const users = await this.exerciseRepository.findAll();
    return users.slice(start, end);
  }

  findOne(id: string) {
    return this.exerciseRepository.findOne(id);
  }

  async create(createExercise: CreateExerciseDto) {
    const course = await this.coursesRepository.findOne(
      createExercise.id_course,
    );

    if (!course) {
      throw new BadRequestException(
        'No puedes asignar un ejercicio porque el curso no existe.',
      );
    }

    const exercise = await this.exerciseRepository.create({
      ...createExercise,
    });
    exercise.Courses = [course];
    return this.exerciseRepository.save(exercise);
  }

  async update(id: string, updateExerciseDto: UpdateExerciseDto) {
    const exercise = this.exerciseRepository.findOne(id);
    if (!exercise) {
      throw new NotFoundException(
        'No puedes actualizar un ejercicio que no existe.',
      );
    }
    await this.exerciseRepository.update(id, updateExerciseDto);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.exerciseRepository.remove(id);
  }
}
