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

  async updateUserInfo(
    id: string,
    updateUserDto: UpdateUserDto,
    requesterId: string,
  ) {
    const user = await this.findOne(id);
    const requester = await this.findOne(requesterId);

    // Verificar permisos
    if ([UserType.User, UserType.UserSubscribe].includes(requester.userType)) {
      if ([UserType.Admin, UserType.SuperAdmin].includes(user.userType)) {
        throw new ForbiddenException(
          'No tienes permisos para modificar este usuario.',
        );
      }
    }

    // Actualizar la información del usuario
    const { currentPassword, confirmPassword, ...resUser } = updateUserDto;
    await this.userRepository.update(id, resUser);

    // Enviar notificación por correo
    const userUpdateCurrently = await this.findOne(id);
    const userUpdate = usersUpdate(
      userUpdateCurrently.name,
      userUpdateCurrently.updated_at,
    );
    await this.emailService.sendEmailSubscriber(
      userUpdateCurrently.email,
      `¡IMPORTANTE!, ${userUpdateCurrently.name} tus datos han sido actualizados en DevNavigator`,
      userUpdate,
    );

    return {
      message: 'El usuario ha sido actualizado.',
      user: userUpdateCurrently,
    };
  }

  async changeUserStatus(id: string, status: boolean, requesterId: string) {
    const requester = await this.findOne(requesterId);

    // Verificar permisos
    if (
      requester.userType === UserType.Admin ||
      requester.userType === UserType.SuperAdmin
    ) {
      await this.userRepository.update(id, { statusUser: status });
      return {
        message: `El usuario ha sido ${status ? 'activado' : 'desactivado'}.`,
        user: await this.findOne(id),
      };
    }

    throw new ForbiddenException(
      'No tienes permisos para cambiar el estado del usuario.',
    );
  }

  async updateUserType(
    id: string,
    updateUserDto: UpdateUserDto,
    requesterId: string,
  ) {
    const requester = await this.findOne(requesterId);

    if (requester.userType !== UserType.SuperAdmin) {
      throw new ForbiddenException(
        'No tienes permisos para realizar esta acción.',
      );
    }

    const { userType } = updateUserDto;

    if (userType === undefined) {
      throw new BadRequestException(
        'El tipo de usuario no se ha proporcionado.',
      );
    }

    await this.userRepository.update(id, { userType });

    return {
      message: 'El tipo de usuario ha sido actualizado.',
      user: await this.findOne(id),
    };
  }

  async updateAdmin(
    id: string,
    updateUser: Partial<UpdateBySuperAdmin>,
    requesterId: string,
  ) {
    const requester = await this.findOne(requesterId);
    const userToUpdate = await this.findOne(id);

    // Verificar si el solicitante es SuperAdmin
    if (requester.userType !== UserType.SuperAdmin) {
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

    // Actualizar el userType si se proporciona y es válido
    if (updateUser.userType) {
      if (!Object.values(UserType).includes(updateUser.userType)) {
        throw new BadRequestException('Tipo de usuario no válido.');
      }
      updateData.userType = updateUser.userType;
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

  async changePassword(
    id: string,
    updateUserDto: UpdateUserDto,
    requesterId: string,
  ) {
    const user = await this.findOne(id);

    // Verifica que se proporcione la contraseña actual y la nueva
    if (!updateUserDto.currentPassword || !updateUserDto.password) {
      throw new BadRequestException(
        'Se requiere la contraseña actual y la nueva contraseña.',
      );
    }

    // Verifica la contraseña actual
    const isMatch = await bcrypt.compare(
      updateUserDto.currentPassword,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('La contraseña actual es incorrecta.');
    }

    // Hashea la nueva contraseña
    const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    if (!hashedPassword) {
      throw new BadRequestException('Error al hashear la nueva contraseña.');
    }

    // Actualiza el usuario con la nueva contraseña
    await this.userRepository.update(id, { password: hashedPassword });

    return {
      message: 'Contraseña cambiada exitosamente.',
    };
  }
}
