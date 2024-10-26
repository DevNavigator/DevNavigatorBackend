import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { UpdateBySuperAdmin } from './dto/update-bySuperadmin-dto';
import { EmailService } from 'src/email/email.service';
import { usersUpdate } from 'src/email/templates/userUpdate.template';
import { UserType } from './enum/UserType.enum';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  async findAll(
    limit: number,
    page: number,
  ): Promise<Omit<User, 'password'>[]> {
    const start = (page - 1) * limit;
    const end = start + limit;
    const users = await this.userRepository.findAll();
    return users.slice(start, end);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(
        `${id}. No corresponde a un usuario existente.`,
      );
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, requesterId: string) {
    const user = await this.findOne(id);
    const requester = await this.findOne(requesterId);

    // Verificar si el solicitante es un usuario normal o suscrito
    if ([UserType.User, UserType.UserSubscribe].includes(requester.typeUser)) {
      // No pueden modificar a admins o superadmins
      if ([UserType.Admin, UserType.SuperAdmin].includes(user.typeUser)) {
        throw new ForbiddenException(
          'No tienes permisos para modificar este usuario.',
        );
      }

      // Permitir que los usuarios normales se den de baja a sí mismos
      if (requesterId === id && updateUserDto.statusUser === false) {
        await this.userRepository.update(id, { statusUser: false });
        return {
          message: 'Tu cuenta ha sido desactivada.',
          user: await this.findOne(id),
        };
      }
    }

    // Verificar si el solicitante es admin
    if (requester.typeUser === UserType.Admin) {
      // No pueden modificar a superadmins
      if (user.typeUser === UserType.SuperAdmin) {
        throw new ForbiddenException('No puedes modificar a un superAdmin.');
      }

      // Permitir que el admin dé de baja o active a usuarios normales
      if ([UserType.User, UserType.UserSubscribe].includes(user.typeUser)) {
        if (updateUserDto.statusUser !== undefined) {
          await this.userRepository.update(id, {
            statusUser: updateUserDto.statusUser,
          });
          const action = updateUserDto.statusUser ? 'activado' : 'desactivado';
          return {
            message: `El usuario ha sido ${action}.`,
            user: await this.findOne(id),
          };
        }
      }

      // El admin no puede darse de baja a sí mismo
      if (requesterId === id) {
        throw new ForbiddenException('No puedes darte de baja a ti mismo.');
      }
    }

    // Verificar si el solicitante es superadmin
    if (requester.typeUser === UserType.SuperAdmin) {
      // El superadmin puede dar de baja o activar a cualquier usuario
      if (updateUserDto.statusUser !== undefined) {
        // El superadmin no puede darse de baja a sí mismo
        if (requesterId === id && updateUserDto.statusUser === false) {
          throw new ForbiddenException('No puedes darte de baja a ti mismo.');
        }
        await this.userRepository.update(id, {
          statusUser: updateUserDto.statusUser,
        });
        const action = updateUserDto.statusUser ? 'activado' : 'desactivado';
        return {
          message: `El usuario ha sido ${action}.`,
          user: await this.findOne(id),
        };
      }

      // El superadmin no puede darse de baja a sí mismo
      if (requesterId === id) {
        throw new ForbiddenException('No puedes darte de baja a ti mismo.');
      }
    }

    // Manejo de la actualización de contraseña
    if (updateUserDto.password) {
      const isPasswordValid = await bcrypt.compare(
        updateUserDto.currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException('Contraseña actual incorrecta.');
      }
      const passwordHashed = await bcrypt.hash(updateUserDto.password, 10);
      if (!passwordHashed) throw new BadRequestException('Error interno.');
      updateUserDto.password = passwordHashed;
    }

    const { currentPassword, confirmPassword, ...resUser } = updateUserDto;
    await this.userRepository.update(id, resUser);
    const userUpdateCurrently = await this.findOne(id);
    const userUpdate = usersUpdate(user.name, userUpdateCurrently.updated_at);
    await this.emailService.sendEmailSubscriber(
      userUpdateCurrently.email,
      `¡IMPORTANTE!, ${user.name} tus datos y/o contraseña han sido actualizados en DevNavigator`,
      userUpdate,
    );

    return {
      message: 'El usuario ha sido actualizado.',
      user: userUpdateCurrently,
    };
  }

  async updateAdmin(
    id: string,
    updateUser: Partial<UpdateBySuperAdmin>, // Cambiamos a Partial para permitir campos opcionales
    requesterId: string,
  ) {
    const requester = await this.findOne(requesterId);
    const userToUpdate = await this.findOne(id);

    // Verificar si el solicitante es SuperAdmin
    if (requester.typeUser !== UserType.SuperAdmin) {
      throw new ForbiddenException(
        'No tienes permisos para realizar esta acción.',
      );
    }

    // Verificar que el SuperAdmin no intente cambiar su propio tipo de usuario o darse de baja
    if (requesterId === id) {
      throw new ForbiddenException('No puedes modificar tu propio usuario.');
    }

    const updateData: Partial<UpdateBySuperAdmin> = {};

    // Actualizar el statusUser si se proporciona
    if (updateUser.statusUser !== undefined) {
      updateData.statusUser = updateUser.statusUser;
    }

    // Actualizar el typeUser si se proporciona y es válido
    if (updateUser.typeUser) {
      if (!Object.values(UserType).includes(updateUser.typeUser)) {
        throw new BadRequestException('Tipo de usuario no válido.');
      }
      updateData.typeUser = updateUser.typeUser;
    }

    // Manejo de la actualización de contraseña
    if (updateUser.password) {
      const passwordHashed = await bcrypt.hash(updateUser.password, 10);
      if (!passwordHashed) throw new BadRequestException('Error interno.');
      updateData.password = passwordHashed;
    }

    // Actualizar el usuario con los datos proporcionados
    await this.userRepository.update(id, updateData);

    // Retornar el usuario actualizado
    return await this.findOne(id);
  }
}
