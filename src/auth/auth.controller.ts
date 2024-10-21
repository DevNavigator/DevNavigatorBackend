import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from 'src/user/entities/user.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({
    summary: 'Inicio de sesion',
    description: 'Este endpoint permite el inicio de sesion al usuario.',
  })
  @ApiBody({
    description:
      'Para ejecutarlo correctamente los datos deben coincidir con el DTO LoginUserDto',
    type: LoginUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Mensaje de inicio de sesion y token jwt.',
  })
  @ApiResponse({
    status: 400,
    description: 'Usuario y/o contraseña incorrecta.',
  })
  @HttpCode(200)
  @Post('signIn')
  signIn(@Body() loginUser: LoginUserDto) {
    return this.authService.signIn(loginUser);
  }

  @ApiOperation({
    summary: 'Register',
    description:
      'Este endpoint permite el registro del usuario a la aplicacion. Y envia una notificacion al mail del usuario registrado.',
  })
  @ApiBody({
    description:
      'Para registrarse es necesario ingresar los datos definidos en el DTO CreateUserDto',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 201,
    description:
      'Devuelve el usuario creado. Ocultando la informacion sensible',
  })
  @ApiResponse({ status: 400, description: 'Las contraseñas deben coincidir.' })
  @ApiResponse({ status: 400, description: 'Error interno.' })
  @Post('signUp')
  signUp(@Body() createUser: CreateUserDto): Promise<Partial<User>> {
    return this.authService.signUp(createUser);
  }
}
