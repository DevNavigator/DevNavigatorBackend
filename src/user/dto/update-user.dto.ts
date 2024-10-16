import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minLength: 8,
  })
  @MaxLength(30)
  password: string;

  @IsOptional()
  confirmPassword: string;

  @IsOptional()
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minLength: 8,
  })
  @MaxLength(30)
  currentPassword: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10,15}$/, {
    message: 'Phone number must be between 10 and 15 digits',
  })
  phone: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  address: string;

  @IsOptional()
  @IsString()
  city: string;
}
