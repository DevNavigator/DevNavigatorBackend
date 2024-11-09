import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from 'src/user/entities/user.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Request, Response } from 'express';
import { CreateUserGoogleDto } from './dto/createUserGoogle';

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

  // Ruta para iniciar la autenticación con Google
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth(@Req() req: Request) {
    // Inicia la autenticación con Google
    // El guardia redirige automáticamente al usuario a la página de inicio de sesión de Google
  }

  // // Ruta para manejar el callback de Google después de la autenticación
  // @UseGuards(GoogleAuthGuard)
  // @Get('callback/google')
  // async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
  //   console.log(req);
  //   const user = req.user as User;
  //   console.log('auth service', user);
  //   const token = await this.authService.generateJwt(user);
  //   console.log('auth service token', token);
  //   console.log('auth service res', res);
  //   res.redirect(`http://localhost:3000?token=${token}`);
  // }/

  @UseGuards(GoogleAuthGuard)
  @Get('callback/google')
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.body.user as User; // Obtiene el usuario autenticado // .body ?
    const createdUser = await this.authService.validateUser(user); // Crea o valida el usuario
    const token = await this.authService.generateJwt(createdUser); // Genera el token JWT
    res.redirect(`http://localhost:3000?token=${token}`); // Redirige con el token
  }

  @Post('create-user')
  async createUser(@Body() userData: CreateUserGoogleDto): Promise<User> {
    return this.authService.validateUser(userData);
  }
}
