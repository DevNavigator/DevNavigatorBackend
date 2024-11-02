import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RegistrationDto {
  @IsUUID()
  @ApiProperty({
    description: 'ID del usuario',
    example: '6e145d99-22c6-468f-abc5-7d7b8f3ad572',
  })
  userId: string;

  @IsUUID()
  @ApiProperty({
    description: 'ID del curso',
    example: '6e145d99-22c6-468f-abc5-7d7b8f3ad571',
  })
  courseId: string;
}
