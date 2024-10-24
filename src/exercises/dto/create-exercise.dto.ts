import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateExerciseDto {
  @ApiProperty({
    description:
      'Titulo del ejercicio a crear. Debe ser un string y es un campo obligatorio.',
    example: 'Ejercicio de FIZZ BUZZ.',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description:
      'Tipo de ejercicio a crear. Debe ser un string y es un campo obligatorio.',
    example: 'Logica de programacion',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description:
      'Descripcion del ejercicio a crear. Es donde se define el ejercicio a resolver. Debe ser un string y es un campo obligatorio. ',
    example:
      'Escribe un programa que muestre por consola todos los numeros pares del 1 al 100.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description:
      'ID del curso relacionado al ejercicio a crear. Debe ser de tipo UUID y es un campo obligatorio.',
    example: '6e145d99-22c6-468f-abc5-7d7b8f3ad576',
  })
  @IsUUID()
  @IsNotEmpty()
  id_course: string;

  @ApiProperty({
    description:
      'URL de la solucion al ejercicio a crear. Debe ser un string y es un campo obligatorio.',
    example: 'http://devnavigator.com/solution/213451',
  })
  @IsString()
  @IsNotEmpty()
  solution_url: string;
}
