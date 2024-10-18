import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateExerciseDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  solution_url: string;

  @IsBoolean()
  @IsOptional()
  status_exercises: boolean;
}
