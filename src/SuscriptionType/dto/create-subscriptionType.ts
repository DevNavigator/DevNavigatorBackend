import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SubsType } from '../enum/SubsType.enum';

export class CreateSubsTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(SubsType)
  type: SubsType;
}
