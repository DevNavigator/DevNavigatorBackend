import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SubsType } from '../enum/SubsType.enum';

export class UpdateSubsTypeDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsEnum(SubsType)
  type: SubsType;
}
