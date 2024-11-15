import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateBySuperAdmin } from './dto/update-bySuperadmin-dto';
import { StatisticsService } from 'src/statistics/statistics.service';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly statisticsService: StatisticsService,
  ) {}

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find();
    return users.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword,
    );
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['Subscription', 'Courses', 'statistics'],
    });
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['Subscription'],
    });
    return user;
  }

  async createUser(user: Partial<User>): Promise<User> {
    // Verificar si el usuario ya existe
    const existingUser = await this.findOneByEmail(user.email);
    console.log('user repo, existingUser', existingUser);
    if (existingUser) {
      throw new BadRequestException(
        'Ya existe una cuenta registrada con este email.',
      );
    }

    // Crear el usuario
    const newUser = this.userRepository.create(user);
    const savedUser = await this.userRepository.save(newUser);

    // Inicializar estadísticas para el nuevo usuario
    await this.statisticsService.initializeStatistics(savedUser.id);

    return savedUser;
  }

  async update(id: string, updatedUser: Partial<UpdateUserDto>) {
    return await this.userRepository.update(id, updatedUser);
  }

  async updateToAdmin(id: string, updatedUser: Partial<UpdateBySuperAdmin>) {
    return await this.userRepository.update(id, updatedUser);
  }

  async findOneByResetToken(token: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { resetToken: token } });
  }
  async save(user: User) {
    await this.userRepository.save(user);
  }
}
