import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsBoolean()
  status_sub?: boolean;
}
