import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from 'src/user/user.repository';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { UserType } from 'src/user/enum/UserType.enum';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { welcome } from 'src/email/templates/welcome.template';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async signIn(
    loginUser: LoginUserDto,
  ): Promise<{ user: User; success: boolean; token: string }> {
    const { email, password } = loginUser;

    const userFound = await this.userRepository.findOneByEmail(email);
    if (!userFound)
      throw new BadRequestException('Usuario y/o contraseña incorrecta.');

    const result = await bcrypt.compare(password, userFound.password);
    if (!result)
      throw new BadRequestException('Usuario y/o contraseña incorrecta.');
    const userType: UserType = userFound.userType;
    const user = {
      id: userFound.id,
      email: userFound.email,
      types: userType,
    };
    const token = this.jwtService.sign(user);
    return {
      user: userFound,
      success: true,
      token,
    };
  }

  async signUp(createUser: CreateUserDto) {
    const foundUser = await this.userRepository.findOneByEmail(
      createUser.email,
    );
    if (foundUser)
      throw new BadRequestException(
        'Ya existe una cuenta registrada con su email.',
      );

    if (createUser.password !== createUser.confirmPassword) {
      throw new BadRequestException('Las contraseñas deben coincidir.');
    }

    const passwordHashed = await bcrypt.hash(createUser.password, 10);

    if (!passwordHashed) throw new BadRequestException('Error interno.');

    await this.userRepository.createUser({
      ...createUser,
      password: passwordHashed,
    });
    const { password, confirmPassword, ...userWithoutPassword } = createUser;
    const welcomeUser = welcome(createUser.name);

    await this.emailService.sendEmailRegister(
      createUser.email,
      '¡Bienvenido a nuestra plataforma de cursos de programación!',
      welcomeUser,
    );

    return userWithoutPassword;
  }

  async generateJwt(user: User): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.userType,
    };
    console.log('auth', payload);
    return this.jwtService.sign(payload, { expiresIn: '3h' });
  }

  async validateUser(profile: Partial<User>): Promise<any> {
    let foundUser = await this.userRepository.findOneByEmail(profile.email);
    console.log(foundUser);
    if (!foundUser) {
      foundUser = await this.userRepository.createUser({
        name: profile.name,
        email: profile.email,
        imgProfile: profile.imgProfile || '',
        userType: UserType.User,
        password: '',
      });
      console.log('Nuevo usuario creado:', foundUser);
    } else {
      console.log('Usuario existente encontrado:', foundUser);
    }

    const userType: UserType = foundUser.userType;
    const user = {
      id: foundUser.id,
      email: foundUser.email,
      types: userType,
    };
    const token = await this.jwtService.sign(user);
    return {
      user,
      success: true,
      token,
    };
  }
}
