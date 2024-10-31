import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import * as data from '../../utils/course.json';
import { difficulty } from './enum/difficulty.enum';

@Injectable()
export class CoursesRepository {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    //? Verificar si el curso ya existe
    const existingCourse = await this.courseRepository.findOne({
      where: { title: createCourseDto.title },
    });

    if (existingCourse) {
      throw new ConflictException(
        `El curso con el título "${createCourseDto.title}" ya existe.`,
      );
    }

    const course = this.courseRepository.create(createCourseDto);
    return await this.courseRepository.save(course);
  }

  async addCourses(): Promise<string> {
    let addedCoursesCount = 0;

    await Promise.all(
      data.map(async (element: any) => {
        try {
          const existingCourse = await this.courseRepository.findOne({
            where: { title: element.title },
          });

          if (existingCourse) {
            return; // Salir de este curso, pasar al siguiente
          }

          const course = this.courseRepository.create({
            title: element.title,
            type: element.type,
            description: element.description,
            difficulty: this.mapDifficulty(element.difficulty),
            requirements: element.requirements,
            format: element.format,
            includes_exercises: element.includes_exercises,
            objetives: element.objetives,
            learn: element.learn,
            content: element.content,
            questions: element.questions,
            image_url: element.image_url,
            duration: element.duration,
            instructor: element.instructor,
            is_free: element.is_free,
            status_courses: element.status_courses,
          });

          await this.courseRepository.save(course);
          addedCoursesCount++;
        } catch (error) {
          console.error(`Error al agregar el curso "${element.title}":`, error);
        }
      }),
    );

    return addedCoursesCount > 0
      ? `¡${addedCoursesCount} Cursos Agregados Correctamente!`
      : 'No se agregaron nuevos cursos, ya existen con los mismos títulos.';
  }

  private mapDifficulty(difficultyString: string): difficulty {
    switch (difficultyString) {
      case 'facil':
        return difficulty.Facil;
      case 'intermedio':
        return difficulty.Intermedio;
      case 'dificil':
        return difficulty.Dificil;
      default:
        throw new Error(`Dificultad no válida: ${difficultyString}`);
    }
  }

  async findAll(): Promise<Course[]> {
    return await this.courseRepository.find();
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepository.findOneBy({ id });

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException(
        'No puedes actualizar un curso que no existe.',
      );
    }
    await this.courseRepository.update(id, updateCourseDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.courseRepository.delete(id);
  }
}
