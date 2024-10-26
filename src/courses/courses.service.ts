import { Injectable } from '@nestjs/common';
import { CoursesRepository } from './courses.repository';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    // Utiliza el repositorio para crear un nuevo curso
    return await this.coursesRepository.create(createCourseDto);
  }

  async addCourses(): Promise<string> {
    return this.coursesRepository.addCourses();
  }

  async findAll(page, limit): Promise<Course[]> {
    // Utiliza el repositorio para obtener todos los cursos
    const start = (page - 1) * limit;
    const end = start + limit;
    const courses = await this.coursesRepository.findAll();
    return courses.slice(start, end);
  }

  async findOne(id: string): Promise<Course> {
    // Utiliza el repositorio para encontrar un curso por su ID
    return await this.coursesRepository.findOne(id);
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    // Utiliza el repositorio para actualizar un curso
    return await this.coursesRepository.update(id, updateCourseDto);
  }

  async remove(id: string): Promise<void> {
    // Utiliza el repositorio para eliminar un curso
    return await this.coursesRepository.remove(id);
  }
}
