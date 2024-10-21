import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepository } from './file-upload.repository';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly fileUploadRepository: FileUploadRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async uploadUserImage(userId: string, file: Express.Multer.File) {
    const user = await this.userRepository.findOne(userId);
    if (!user) throw new NotFoundException('User not found');
    const uploadImg = await this.fileUploadRepository.uploadImage(file);
    await this.userRepository.update(userId, {
      imgProfile: uploadImg.secure_url,
    });
    const userUpdated = await this.userRepository.findOne(userId);
    const { password, ...userWithoutPassword } = userUpdated;
    return userWithoutPassword;
  }
}
