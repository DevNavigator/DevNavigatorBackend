import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from 'src/user/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(200)
  @Post('signIn')
  signIn(@Body() loginUser: LoginUserDto) {
    return this.authService.signIn(loginUser);
  }

  @Post('signUp')
  signUp(@Body() createUser: CreateUserDto): Promise<Partial<User>> {
    return this.authService.signUp(createUser);
  }
}
