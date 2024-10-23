import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserType } from 'src/user/enum/UserType.enum';

export class CreateUserDto {
  @ApiProperty({
    description:
      'Nombre del usuario a crear. Debe ser un string y tener una longitud minima de 3 caracteres y una longitud maxima de 50 caracteres. Es un campo obligatorio',
    example: 'Jonh doe',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @ApiProperty({
    description:
      'Email del usuario a crear. Debe ser un email valido y es un campo obligatorio.',
    example: 'Jonhdoe@mail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Contraseña del usuario. Debe tener una longitud maxima de 30 caracteres. Este campo es obligatorio.',
    example: 'Contraseña!123',
  })
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minLength: 8,
  })
  @MaxLength(30)
  password: string;

  @ApiProperty({
    description:
      'Confirmacion de la contraseña ingresada. Es un campo obligatorio.',
    example: 'Contraseña!123',
  })
  @IsNotEmpty()
  confirmPassword: string;

  @ApiProperty({
    description:
      'Numero de telefono del usuario a crear.Debe ser un numero y tener una longitud minima de 10 caracteres y una longitud maxima de 15 caracteres. Es un campo obligatorio. ',
    example: 2634891234,
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{10,15}$/, {
    message: 'Phone number must be between 10 and 15 digits',
  })
  phone: string;

  /*  @ApiProperty({
    description:
      'Fecha de nacimiento del usuario a crear. Debe ser una fecha valida. Es un campo opcional.',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional() // Pedirlo al front.
  @Transform(({ value }) => new Date(value))
  @IsDate()
  birthdate: Date;
 */
  @ApiProperty({
    description:
      'Direccion del usuario a crear. Debe ser un string y tener una longitud minima de 5 caracteres. Es un campo obligatorio.',
    example: '123 Calle Falsa, Departamento 4B',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  address: string;

  @ApiProperty({
    description:
      'Tipo de usuario a crear. Debe ser uno de los siguientes: user, userSuscribe, admin, superAdmin.',
    enum: UserType,
    default: UserType.User,
  })
  @IsOptional()
  @IsEnum(UserType)
  TypeUser: UserType;
}
