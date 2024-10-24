import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepository } from './file-upload.repository';
import { UserRepository } from 'src/user/user.repository';
import { CoursesRepository } from 'src/courses/courses.repository';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly fileUploadRepository: FileUploadRepository,
    private readonly userRepository: UserRepository,
    private readonly courseRepository: CoursesRepository,
  ) {}

    async uploadUserImage(userId: string, file: Express.Multer.File){
        const user = await this.userRepository.findOne(userId);
        if(!user) throw new NotFoundException('User not found');
        const uploadImg = await this.fileUploadRepository.uploadImage(file);
        await this.userRepository.update(userId, {
            imgProfile: uploadImg.secure_url
        });
        const userUpdated = await this.userRepository.findOne(userId);
        const { password, ...userWithoutPassword } = userUpdated
        return userWithoutPassword;
    }

    async uploadCourseImage(courseId: string, file: Express.Multer.File){
        const course = await this.courseRepository.findOne(courseId);
        if(!course) throw new NotFoundException('Course not found');
        const uploadImg = await this.fileUploadRepository.uploadImage(file);
        const courseUpdated = await this.courseRepository.update(courseId, {
            image_url: uploadImg.secure_url
        })
        return courseUpdated;
    }
}
