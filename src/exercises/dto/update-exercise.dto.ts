import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateExerciseDto {
  @ApiProperty({
    description:
      'Titulo del ejercicio a actualizar. Debe ser un string. Es un campo opcional.',
    example: 'Sucesión de Fibonacci',
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    description:
      'Tipo del ejercicio a actualizar. Debe ser un string. Es un campo opcional.',
    example: 'Logica de programacion',
  })
  @IsString()
  @IsOptional()
  type: string;

  @ApiProperty({
    description:
      'Descripcion del ejercicio a actualizar. Debe ser un string. Es un campo opcional',
    example:
      'Debes hacer un programa que mediante una funcion que recibe 2 numeros, calcule su suma.',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description:
      'Url de la solucion al ejercicio. Debe ser un string. Es un campo opcional.',
    example: 'http://devnavigator.com/solution/213455',
  })
  @IsString()
  @IsOptional()
  solution_url: string;

  @ApiProperty({
    description:
      'Estado del ejercicio a actualizar, puede ser true o false. Es un campo opcional. ',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  status_exercises: boolean;
}
