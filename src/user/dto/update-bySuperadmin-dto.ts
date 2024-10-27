import {
  IsBoolean,
  isBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserType } from '../enum/UserType.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBySuperAdmin {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description:
      'Nombre del usuario a ser actualizado. Este campo es opcional y debe ser un string.',
    example: 'Alex',
  })
  name?: string;

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
      'Contraseña del usuario a ser actualizada. Debe tener una longitud mínima de 8 caracteres y debe incluir al menos 1 símbolo, 1 número, 1 letra mayúscula y 1 letra minúscula.',
    example: '123Prueba_',
  })
  password?: string;

  @IsOptional()
  @ApiProperty({
    description:
      'Confirmación de contraseña. Debe ser igual a la nueva contraseña. Este campo es opcional.',
    example: '123Prueba_',
  })
  confirmPassword?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10,15}$/, {
    message: 'El número de teléfono debe tener entre 10 y 15 dígitos.',
  })
  @ApiProperty({
    description:
      'Número de teléfono del usuario a actualizar. Este campo debe contener solo números y no permite el uso de símbolos. Es opcional y debe ser un string.',
    example: '2634123456',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @ApiProperty({
    description:
      'Dirección del usuario a actualizar. Este campo es opcional y debe ser un string con una longitud mínima de 5 caracteres.',
    example: 'Calle Falsa 123',
  })
  address?: string;

  @IsOptional()
  @IsEnum(UserType)
  @ApiProperty({
    enum: UserType,
    description: 'El tipo de usuario que define su rol en la plataforma.',
    default: UserType.User,
    example: UserType.Admin,
    enumName: 'UserType',
  })
  userType?: UserType;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Estado del usuario (activo/inactivo).',
    example: true,
  })
  statusUser?: boolean;
}
