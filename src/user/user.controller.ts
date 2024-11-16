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
  Request,
  UsePipes,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/AuthGuard';
import { TypeGuard } from 'src/auth/guards/TypeGuard';
import { UserType } from './enum/UserType.enum';
import { TypeUser } from 'src/decorator/type.decorator';
import { UpdateBySuperAdmin } from './dto/update-bySuperadmin-dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { ValidateNonEmptyFieldsPipe } from 'src/pipes/validateNonEmptyFieldsPipe';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Obtener la lista de usuarios.',
    description:
      'Este endpoint permite obtener la lista de usuario registrados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios',
    type: () => [User],
  })
  @TypeUser(UserType.Admin, UserType.SuperAdmin)
  @UseGuards(AuthGuard, TypeGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @Get()
  findAll(@Query('limit') limit = 5, @Query('page') page = 1) {
    return this.userService.findAll(Number(limit), Number(page));
  }

  @ApiOperation({
    summary: 'Obtener información de un usuario',
    description:
      'Este endpoint permite obtener información de un usuario buscado por su ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado.',
  })
  @ApiResponse({ status: 404, description: 'El usuario no existe.' })
  @ApiBearerAuth()
  @HttpCode(200)
  /* @UseGuards(AuthGuard) */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({
    summary: 'Actualizar información del usuario',
    description:
      'Este endpoint permite actualizar la información de un usuario buscado por ID.',
  })
  @ApiBody({
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario con los datos actualizados.',
  })
  @ApiBearerAuth()
  @UsePipes(ValidateNonEmptyFieldsPipe)
  @UseGuards(AuthGuard)
  @Patch('/update/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return this.userService.updateUserInfo(id, updateUserDto, req.user.id);
  }

  @ApiOperation({
    summary: 'Cambiar estado del usuario',
    description: 'Este endpoint permite activar o desactivar un usuario.',
  })
  @ApiBody({
    description:
      'Estado del usuario (true para activar, false para desactivar).',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del usuario actualizado.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('/changeStatus/:id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('statusUser') status: boolean,
    @Request() req,
  ) {
    return this.userService.changeUserStatus(id, status, req.user.id);
  }

  @ApiOperation({
    summary: 'Actualizar tipo de usuario',
    description:
      'Este endpoint permite actualizar el tipo de usuario de un usuario.',
  })
  @ApiBody({
    description: 'Nuevo tipo de usuario.',
    type: 'USER',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de usuario actualizado.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('/userType/:id')
  updateType(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return this.userService.updateUserType(id, updateUserDto, req.user.id);
  }

  @ApiOperation({
    summary: 'Actualizar contraseña de usuario',
    description:
      'Este endpoint permite actualizar la contraseña de un usuario.',
  })
  @ApiBody({
    description: 'Nuevo contraseña de usuario.',
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de usuario actualizado.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('/changePassword/:id')
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return this.userService.changePassword(id, updateUserDto, req.user.id);
  }

  @ApiOperation({
    summary:
      'Actualizar información de usuario desde un usuario administrador.',
    description:
      'Este endpoint permite actualizar la información de un usuario buscado por ID.',
  })
  @ApiBody({
    type: UpdateBySuperAdmin,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario con los datos actualizados.',
  })
  @ApiResponse({ status: 404, description: 'El usuario no existe.' })
  @ApiResponse({ status: 400, description: 'Error interno.' })
  @ApiBearerAuth()
  @TypeUser(UserType.SuperAdmin)
  @UseGuards(AuthGuard, TypeGuard)
  @Patch('/adminupdate/:id')
  updateToAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateByAdmin: UpdateBySuperAdmin,
    @Request() req,
  ) {
    return this.userService.updateAdmin(id, updateByAdmin, req.user.id);
  }

  @ApiOperation({
    summary: 'Solicitar restablecimiento de contraseña',
  })
  @HttpCode(200)
  @Post('/request-password-reset')
  async requestPasswordReset(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.requestPasswordReset(resetPasswordDto);
  }

  @ApiOperation({
    summary: 'Restablecer contraseña',
  })
  @HttpCode(200)
  @Post('/reset-password')
  async resetPassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.userService.resetPassword(updatePasswordDto);
  }
}
