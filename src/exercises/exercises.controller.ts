import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/AuthGuard';
import { TypeGuard } from 'src/auth/guards/TypeGuard';
import { TypeUser } from 'src/decorator/type.decorator';
import { UserType } from 'src/user/enum/UserType.enum';

@ApiTags('exercises')
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @ApiOperation({
    summary: 'Obtener una lista de ejercicios.',
    description:
      'Este endpoint permite obtener la lista de ejercicios para cada curso. Puedes paginar los resultados enviando por Querys el limit y page.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ejercicios con sus respectivos cursos.',
  })
  @ApiBearerAuth()
  @TypeUser(UserType.UserSubscribe, UserType.Admin, UserType.SuperAdmin)
  @UseGuards(AuthGuard, TypeGuard)
  @Get()
  findAll(@Query('limit') limit = 5, @Query('page') page = 1) {
    return this.exercisesService.findAll(Number(limit), Number(page));
  }

  @ApiOperation({
    summary: 'Obtener un ejercicio buscado por su ID.',
    description: 'Este endpoint permite obtener un ejercicio buscado por su ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve un ejercicio con su respectivo curso.',
  })
  @ApiBearerAuth()
  @TypeUser(UserType.UserSubscribe, UserType.Admin, UserType.SuperAdmin)
  @UseGuards(AuthGuard, TypeGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.exercisesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Crear un ejercicio',
    description:
      'Este endpoint permite crear un nuevo ejercicio para un curso.',
  })
  @ApiBody({
    description:
      'Datos para crear un nuevo ejercicio. Los datos deben coincidir con el DTO CreateExerciseDTO.',
    type: CreateExerciseDto,
  })
  @ApiResponse({ status: 201, description: 'Devuelve el recurso creado.' })
  @ApiResponse({
    status: 400,
    description: 'No puedes asignar un ejercicio porque el curso no existe.',
  })
  @ApiBearerAuth()
  @TypeUser(UserType.Admin, UserType.SuperAdmin)
  @UseGuards(AuthGuard, TypeGuard)
  @Post()
  create(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exercisesService.create(createExerciseDto);
  }

  @ApiOperation({
    summary: 'Actualizar un ejercicio.',
    description: 'Este endpoint permite actualizar un ejercicio existente.',
  })
  @ApiBody({
    description:
      'Datos para actualizar un ejercicio. Los datos deben coincidir con el DTO UpdateExerciseDTO.',
    type: UpdateExerciseDto,
  })
  @ApiResponse({ status: 201, description: 'Devuelve el recurso creado.' })
  @ApiResponse({
    status: 404,
    description: 'No puedes actualizar un ejercicio que no existe.',
  })
  @ApiBearerAuth()
  @TypeUser(UserType.Admin, UserType.SuperAdmin)
  @UseGuards(AuthGuard, TypeGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.exercisesService.update(id, updateExerciseDto);
  }

  @ApiOperation({
    summary: 'Eliminar un ejercicio existente.',
    description:
      'Este endpoint permite eliminar un ejercicio existente. Para ejecutarlo es necesario indicar un ID de tipo UUID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve el id del recurso elimiando.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontro el ejercicio para eliminar',
  })
  @ApiBearerAuth()
  @TypeUser(UserType.Admin, UserType.SuperAdmin)
  @UseGuards(AuthGuard, TypeGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exercisesService.remove(id);
  }
}
