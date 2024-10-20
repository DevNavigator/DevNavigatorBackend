import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateSubscriptionDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description:
      'Estado de la suscripcion a actualizar. Este campo es opcional y puede ser true o false.',
    example: true,
  })
  status_sub?: boolean;
}
