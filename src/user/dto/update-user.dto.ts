import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { UserType } from '../enum/UserType.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiProperty({
    description: 'Nombre del usuario a actualizar. Este campo es opcional.',
    example: 'Juan Pérez',
  })
  name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  @ApiProperty({
    description: 'Email del usuario a actualizar. Este campo es opcional.',
    example: 'juan.perez@example.com',
  })
  email?: string;

  @IsOptional()
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minLength: 8,
  })
  @MaxLength(30)
  @ApiProperty({
    description:
      'Contraseña del usuario a actualizar. Debe tener una longitud mínima de 8 caracteres. También es obligatorio que contenga al menos 1 símbolo, 1 número, 1 letra mayúscula y 1 letra minúscula. Este campo es opcional.',
    example: '123Prueba_',
  })
  password?: string;

  @IsOptional()
  @ApiProperty({
    description:
      'Confirmación de la nueva contraseña. Debe coincidir con el campo "password". Este campo es opcional y solo es necesario si se está actualizando la contraseña.',
    example: '123Prueba_',
  })
  confirmPassword?: string;

  @IsOptional()
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minLength: 8,
  })
  @MaxLength(30)
  @ApiProperty({
    description:
      'Contraseña actual del usuario. Este campo es requerido solo si se va a cambiar la contraseña, de lo contrario es opcional.',
    example: '123Actual_',
  })
  currentPassword?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10,15}$/, {
    message: 'El número de teléfono debe tener entre 10 y 15 dígitos.',
  })
  @ApiProperty({
    description:
      'Número de teléfono del usuario a actualizar. Debe ser un número entre 10 y 15 dígitos, sin símbolos. Este campo es opcional.',
    example: '2634123456',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @ApiProperty({
    description:
      'Dirección del usuario a actualizar. Debe tener una longitud mínima de 5 caracteres. Este campo es opcional.',
    example: 'Calle Falsa 123',
  })
  address?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Imagen de perfil del usuario. Este campo es opcional.',
    example: 'url_de_imagen.jpg',
  })
  imgProfile?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description:
      'Cambiar tipo de usuario (Darlo/darse de baja). Este campo es opcional.',
    example: 'false',
  })
  statusUser?: boolean;

  @IsOptional()
  @IsEnum(UserType)
  @ApiProperty({
    description:
      'Cambiar tipo de usuario (Darlo/darse de baja). Este campo es opcional.',
    example: 'ADMIN',
  })
  userType?: UserType;

  @IsOptional()
  resetToken?: string;

  @IsOptional()
  resetTokenExpiration?: Date;
}
