import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { difficulty } from '../enum/difficulty.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({
    description:
      'Titulo del curso a crear. Debe ser un string y es un campo obligatorio.',
    example: 'Curso de frontend',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description:
      'Tipo del curso a crear. Debe ser un string y es un campo obligatorio.',
    example: 'Frontend',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description:
      'Descripcion del curso a crear. Debe ser un string y es un campo obligatorio.',
    example: 'Curso de programacion web de frontend con Tailwind',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description:
      'Imagen del curso a crear. Debe ser un string y es un campo obligatorio.',
    example: 'http://devnavigator/image/12389172',
  })
  @IsString()
  @IsOptional()
  image_url?: string;

  @ApiProperty({
    description:
      'Dificultad del curso a crear. Debe estar dentro del enum "difficulty". Es un campo obligatorio.',
    example: difficulty.Facil,
    enum: difficulty,
  })
  @IsEnum(difficulty)
  @IsNotEmpty()
  difficulty: difficulty;

  @ApiProperty({
    description:
      'Duracion total del curso a crear. Debe ser un numero. Es un campo obligatorio.',
    example: 15,
  })
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @ApiProperty({
    description:
      'Nombre del instructor que dicta el curso. Debe ser un string y es un campo obligatorio.',
    example: 'Rodrigo Chavez',
  })
  @IsString()
  @IsNotEmpty()
  instructor: string;

  @ApiProperty({
    description:
      'Indica si el curso es gratis o de pago. Debe ser true o falso y es un campo obligatorio.',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  is_free: boolean;

  @ApiProperty({
    description:
      'Indica el estado del curso, true define que el curso esta activo, falso lo contrario. Debe ser true o falso y es un campo opcional.',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  status_courses?: boolean;
}
