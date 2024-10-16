import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateBySuperAdmin } from './dto/update-bySuperadmin-dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async createUser(user: Partial<User>): Promise<User> {
    return await this.userRepository.save(user);
  }

  async update(id: string, updatedUser: Partial<UpdateUserDto>) {
    return await this.userRepository.update(id, updatedUser);
  }

  async updateToAdmin(id: string, updatedUser: Partial<UpdateBySuperAdmin>) {
    return await this.userRepository.update(id, updatedUser);
  }
}
