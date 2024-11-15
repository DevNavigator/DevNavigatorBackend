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
import { v4 as uuidv4 } from 'uuid';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { resetPasswordTemplate } from 'src/email/templates/resetPasswordTemplate';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { StatisticsService } from 'src/statistics/statistics.service';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private readonly emailService: EmailService,
    private readonly suscriptionService: SubscriptionsService,
    private readonly statisticsService: StatisticsService,
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

  async changeUserStatus(id: string, status: boolean, adminId: string) {
    const requester = await this.findOne(id);

    if (requester.Subscription && status === false) {
      await this.suscriptionService.remove(requester.Subscription.id);
      requester.Subscription = null;
      await this.statisticsService.clearStatistics(requester);
      requester.Courses = [];
      await this.userRepository.save(requester);
    }
    await this.userRepository.update(id, { statusUser: status });
    return {
      message: `El usuario ha sido ${status ? 'activado' : 'desactivado'}.`,
      user: await this.findOne(id),
    };
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

  async createSuperAdminIfNotExists() {
    const superAdminEmail = 'superadmin@devnavigator.com'; // Cambia esto a un email adecuado
    const existingSuperAdmin =
      await this.userRepository.findOneByEmail(superAdminEmail);

    if (!existingSuperAdmin) {
      const superAdminData = {
        name: 'Super Admin DevNavigator',
        email: superAdminEmail,
        password: await bcrypt.hash('Superadmin123*.', 10),
        userType: UserType.SuperAdmin,
        phone: '1234567890',
        address: '123 Super Admin St DevNavigator',
      };

      await this.userRepository.createUser(superAdminData);
      console.log('Usuario SUPER_ADMIN creado.');
    } else {
      console.log('El usuario SUPER_ADMIN ya existe.');
    }
  }

  async requestPasswordReset(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userRepository.findOneByEmail(
      resetPasswordDto.email,
    );
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const resetToken = uuidv4();
    const resetTokenExpiration = new Date(Date.now() + 3600000); // 1 hora

    await this.userRepository.update(user.id, {
      resetToken,
      resetTokenExpiration,
    });

    const url = 'https://dev-navigator.vercel.app';
    const resetLink = `${url}/reset-password?token=${resetToken}`;
    const emailTemplate = resetPasswordTemplate(user.name, resetLink);
    await this.emailService.sendEmailUpdateUser(
      user.email,
      'Solicitud de restablecimiento de contraseña',
      emailTemplate,
    );

    return {
      message:
        'Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico.',
    };
  }

  async resetPassword(updatePasswordDto: UpdatePasswordDto) {
    const { token, newPassword } = updatePasswordDto;

    const user = await this.userRepository.findOneByResetToken(token);
    if (!user || user.resetTokenExpiration < new Date()) {
      throw new BadRequestException(
        'Token de restablecimiento inválido o expirado.',
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiration: null,
    });

    return { message: 'La contraseña ha sido restablecida exitosamente.' };
  }
}
