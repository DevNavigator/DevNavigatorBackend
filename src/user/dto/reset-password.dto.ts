// dto/reset-password.dto.ts
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @IsEmail()
  @ApiProperty({
    description:
      'Email del usuario que solicita el restablecimiento de contraseña.',
    example: 'usuario@example.com',
  })
  email: string;
}
