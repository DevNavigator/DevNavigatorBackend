import { Injectable, NotFoundException } from '@nestjs/common';
import { CoursesRepository } from './courses.repository';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { RegistrationDto } from './dto/registration.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CoursesService {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

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
  async linkUserToCourse(registration: RegistrationDto) {
    const { userId, courseId } = registration;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['Courses'],
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const course = await this.coursesRepository.findOne(courseId);
    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }
    if (!user.Courses.some((c) => c.id === courseId)) {
      user.Courses.push(course);
      await this.userRepository.save(user);
    }
    return `Usuario ${userId} vinculado al curso ${courseId}`;
  }
}
