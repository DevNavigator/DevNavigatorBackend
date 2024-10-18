import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateSubscriptionDto {
  @IsOptional()
  @IsBoolean()
  status_sub?: boolean;
}
