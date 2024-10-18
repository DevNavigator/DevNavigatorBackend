import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { UpdateBySuperAdmin } from './dto/update-bySuperadmin-dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

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

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      const isPasswordValid = await bcrypt.compare(
        updateUserDto.currentPassword,
        user.password,
      );

      if (!isPasswordValid)
        throw new BadRequestException('Contraseña actual incorrecta.');
      const passwordHashed = await bcrypt.hash(updateUserDto.password, 10);
      if (!passwordHashed) throw new BadRequestException('Error interno.');
      updateUserDto.password = passwordHashed;
    }

    const { currentPassword, confirmPassword, ...resUser } = updateUserDto;
    await this.userRepository.update(id, resUser);

    return await this.findOne(id);
  }

  async updateAdmin(id: string, updateUser: UpdateBySuperAdmin) {
    await this.findOne(id);
    if (updateUser.password) {
      const passwordHashed = await bcrypt.hash(updateUser.password, 10);
      if (!passwordHashed) throw new BadRequestException('Error interno.');
      updateUser.password = passwordHashed;
    }
    const { confirmPassword, ...resUser } = updateUser;
    await this.userRepository.updateToAdmin(id, resUser);
    return await this.findOne(id);
  }
}
