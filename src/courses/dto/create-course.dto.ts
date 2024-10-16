import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { difficulty } from '../enum/difficulty.enum';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  image_url: string;

  @IsEnum(difficulty)
  @IsNotEmpty()
  difficulty: difficulty;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsNotEmpty()
  instructor: string;

  @IsBoolean()
  @IsNotEmpty()
  is_free: boolean;

  @IsBoolean()
  @IsOptional()
  status_courses?: boolean;
}
