import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/user/enum/UserType.enum';

export const TypeUser = (...typeUser: UserType[]) =>
  SetMetadata('types', typeUser);
