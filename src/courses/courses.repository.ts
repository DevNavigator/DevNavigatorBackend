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
import * as data from '../../utils/courses.json';
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
    let addedCoursesCount = 0; //? Contador para cursos agregados de courses en la ruta

    await Promise.all(
      data.map(async (element: any) => {
        // Verificar si el curso ya existe
        const existingCourse = await this.courseRepository.findOne({
          where: { title: element.title },
        });

        if (!existingCourse) {
          const course = this.courseRepository.create({
            title: element.title,
            type: element.type,
            description: element.description,
            image_url: element.image_url,
            difficulty: this.mapDifficulty(element.difficulty),
            duration: element.duration,
            instructor: element.instructor,
            is_free: element.is_free,
            status_courses: element.status_courses,
          });

          await this.courseRepository.save(course);
          addedCoursesCount++; // Incrementar el contador
        }
      }),
    );

    //? Mensaje condicional a la hora de agregar las peliculas con el controlador loadCourses
    if (addedCoursesCount > 0) {
      return `¡${addedCoursesCount} Cursos Agregados Correctamente!`;
    } else {
      return 'No se agregaron nuevos cursos, ya existen con los mismos títulos.';
    }
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
    return await this.courseRepository.findOneBy({ id });
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
