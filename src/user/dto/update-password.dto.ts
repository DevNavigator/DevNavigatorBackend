// dto/update-password.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'El token de restablecimiento de contraseña.',
    example: 'token-generado',
  })
  token: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'La nueva contraseña del usuario.',
    example: 'NuevaContraseña123!',
  })
  newPassword: string;
}
