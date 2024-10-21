import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description:
      'Email de inicio de sesion. Debe ser un email valido y es un campo obligatorio.',
    example: 'jhondoe@mail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Contraseña de inicio de sesion. Debe tener una longitud minima de 8 caracteres y es un campo obligatorio.',
    example: 'Password!123',
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
