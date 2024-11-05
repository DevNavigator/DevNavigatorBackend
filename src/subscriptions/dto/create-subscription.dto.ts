import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { SubsType } from 'src/SuscriptionType/enum/SubsType.enum';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description:
      'ID del usuario relacionado a la suscripcion. Es de tipo UUID. Este campo es obligatorio.',
    example: '6e145d99-22c6-468f-abc5-7d7b8f3ad576',
  })
  userId: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description:
      'Estado de la suscripcion a ser creada. Puede ser de tipo true o false, determinando si la suscripcion esta activa o falsa. ',
    example: true,
  })
  status_sub?: boolean;

  @ApiProperty({
    description: 'Tipo de suscripción.',
    enum: SubsType,
  })
  @IsEnum(SubsType)
  typeSubscription: SubsType;
}
