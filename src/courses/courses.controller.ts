import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TypeUser } from 'src/decorator/type.decorator';
import { UserType } from 'src/user/enum/UserType.enum';
import { AuthGuard } from 'src/auth/guards/AuthGuard';
import { TypeGuard } from 'src/auth/guards/TypeGuard';
import { RegistrationDto } from './dto/registration.dto';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiOperation({
    summary: 'Crear un curso.',
    description: 'Este endpoint permite crear un nuevo curso.',
  })
  @ApiBody({
    description:
      'Para crear un curso es necesario que los datos cumplan con las propiedades del DTO CreateCourseDTO.',
    type: CreateCourseDto,
  })
  @ApiResponse({ status: 201, description: 'Devuelve el recurso creado.' })
  @ApiResponse({
    status: 409,
    description: 'El curso con el título "example" ya existe.',
  })
  @ApiBearerAuth()
  @TypeUser(UserType.Admin, UserType.SuperAdmin)
  @UseGuards(AuthGuard, TypeGuard)
  @Post()
  async create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.coursesService.create(createCourseDto);
  }

  @ApiOperation({
    summary: 'Cargar los cursos. (Seeder)',
    description: 'Este endpoint permite cargar los cursos en la base de datos.',
  })
  @ApiResponse({ status: 200, description: 'Cursos Agregados Correctamente!' })
  @ApiResponse({
    status: 200,
    description:
      'No se agregaron nuevos cursos, ya existen con los mismos títulos.',
  })
  @ApiResponse({
    status: 400,
    description: 'Ya existe un curso con el mismo titulo.',
  })
  @Get('loadCourses')
  @HttpCode(HttpStatus.OK)
  async addCourses() {
    return this.coursesService.addCourses();
  }

  @ApiOperation({
    summary: 'Obtener una lista de cursos.',
    description:
      'Este endpoint permite obtener una lista con los cursos existentes.',
  })
  @ApiResponse({ status: 200, description: 'Una lista con los cursos.' })
  @Get()
  async findAll(): Promise<Course[]> {
    return this.coursesService.findAll();
  }

  @ApiOperation({
    summary: 'Obtener un curso por su ID.',
    description:
      'Este endpoint permite obtener un curso buscado por su ID de tipo UUID',
  })
  @ApiResponse({ status: 200, description: 'Devuelve el curso encontrado.' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Course> {
    return this.coursesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Actualizar un curso existente.',
    description: 'Este endpoint permite actualizar un curso buscado por su ID.',
  })
  @ApiBody({
    description:
      'Para actualizar un curso en necesario que los datos con las propiedades del DTO UpdateCourseDTO.',
    type: UpdateCourseDto,
  })
  @ApiResponse({ status: 201, description: 'Devuelve el recurso actualizado.' })
  @ApiResponse({
    status: 404,
    description: 'No puedes actualizar un curso que no existe.',
  })
  @ApiBearerAuth()
  @TypeUser(UserType.Admin, UserType.SuperAdmin)
  @UseGuards(AuthGuard, TypeGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    return this.coursesService.update(id, updateCourseDto);
  }

  @ApiOperation({
    summary: 'Dar de baja un curso.',
    description: 'Este endpoint permite dar de baja un curso',
  })
  @ApiBody({
    description:
      'Para dar de baja un curso es necesario ingresar las propiedades que tiene el DTO UpdateCourseDTO.',
  })
  @ApiResponse({ status: 201, description: 'Devuelve el recurso actualizado.' })
  @ApiResponse({
    status: 404,
    description: 'No puedes actualizar un curso que no existe.',
  })
  @ApiBearerAuth()
  @TypeUser(UserType.Admin, UserType.SuperAdmin)
  @UseGuards(AuthGuard, TypeGuard)
  @Patch(':id')
  async remove(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    return this.coursesService.update(id, updateCourseDto);
  }

  @UseGuards(AuthGuard)
  @Post('link-user')
  async linkUsertoCourse(@Body() registration: RegistrationDto) {
    return this.coursesService.linkUserToCourse(registration);
  }
}
