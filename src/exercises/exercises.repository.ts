import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Exercise } from './entities/exercise.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExerciseRepository {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
  ) {}
  async findAll() {
    return await this.exerciseRepository.find({ relations: ['Courses'] });
  }

  async findOne(id: string) {
    return await this.exerciseRepository.findOne({
      where: { id },
      relations: ['Courses'],
    });
  }

  async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const exercise = this.exerciseRepository.create(createExerciseDto);
    return await this.exerciseRepository.save(exercise);
  }

  async save(exercise: Exercise) {
    return await this.exerciseRepository.save(exercise);
  }

  async update(id: string, updateExcercise: UpdateExerciseDto) {
    return await this.exerciseRepository.update(id, updateExcercise);
  }

  async remove(id: string) {
    const result = await this.exerciseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('No se encontro el ejercicio para eliminar');
    }
    return id;
  }
}
