import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserType } from 'src/user/enum/UserType.enum';

@Injectable()
export class TypeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredType = this.reflector.getAllAndOverride<UserType[]>('types', [
      context.getHandler(),
      context.getClass,
    ]);
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const hasRole = () =>
      requiredType.some((type) => user?.types?.includes(type));
    const valid = user && user.types && hasRole();

    if (!valid) {
      throw new ForbiddenException('No tienes permisos para esta solicitud.');
    }
    return valid;
  }
}
