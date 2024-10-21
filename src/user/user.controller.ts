import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Query,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/AuthGuard';
import { TypeGuard } from 'src/auth/guards/TypeGuard';
import { UserType } from './enum/UserType.enum';
import { TypeUser } from 'src/decorator/type.decorator';
import { UpdateBySuperAdmin } from './dto/update-bySuperadmin-dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // findAll
  @ApiOperation({
    summary: 'Obtener la lista de usuarios.',
    description:
      'Este endpoint permite obtener la lista de usuario registrados. Puedes agregar Querys de page y limit para paginar los resultados. Necesitas rol de administrador o superAdministrador para ejecutarlo.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios',
    type: () => [User],
  })
  @TypeUser(UserType.Admin, UserType.SuperAdmin)
  @UseGuards(AuthGuard, TypeGuard)
  @HttpCode(200)
  @Get()
  findAll(@Query('limit') limit = 5, @Query('page') page = 1) {
    return this.userService.findAll(Number(limit), Number(page));
  }

  // findOne
  @ApiOperation({
    summary: 'Obtener información de un usuario',
    description:
      'Este endpoint permite obtener información de un usuario buscado por su ID. Es necesario un token valido.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado.',
  })
  @ApiResponse({ status: 404, description: 'El usuario no existe.' })
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  // update
  @ApiOperation({
    summary: 'Actualizar información del usuario',
    description:
      'Este endpoint permite actualizar la información de un usuario buscado por ID. Es necesario un token valido.',
  })
  @ApiBody({
    description:
      'Datos para actualizar el usuario. Deben incluir los mismos campos que el DTO UpdateUserDto',
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario con los datos actualizados.',
  })
  @ApiResponse({ status: 400, description: 'Contraseña actual incorrecta.' })
  @ApiResponse({ status: 400, description: 'Error interno.' })
  @UseGuards(AuthGuard)
  @Patch('/userupdate/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  //updateToAdmin
  @ApiOperation({
    summary:
      'Actualizar informacion de usuario desde un usuario administrador.',
    description:
      'Este endpoint permite actualizar la informacion de un usuario buscado por ID. Esta actualizacion la puede realizar unicamente un usuario de tipo "superAdmin", tambien necesita un token valido.',
  })
  @ApiBody({
    description:
      'Datos para actualizar el usuario. Debe incluir algunos campos del DTO UpdateBySuperAdmin',
    type: UpdateBySuperAdmin,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario con los datos actualizados.',
  })
  @ApiResponse({ status: 404, description: 'El usuario no existe.' })
  @ApiResponse({ status: 400, description: 'Error interno.' })
  @TypeUser(UserType.SuperAdmin)
  @UseGuards(AuthGuard, TypeGuard)
  @Patch('/adminupdate/:id')
  updateToAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateByAdmin: UpdateBySuperAdmin,
  ) {
    return this.userService.updateAdmin(id, updateByAdmin);
  }
}
