import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserGoogleDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email?: string;

  @IsOptional()
  imgProfile?: string; // Este campo es opcional
}
