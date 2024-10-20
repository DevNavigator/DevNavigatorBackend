import { Injectable } from '@nestjs/common';
import { FileUploadRepository } from './file-upload.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileUploadService {
    constructor(
        private readonly fileUploadRepository: FileUploadRepository,
        @InjectRepository(User)
        private readonly userReposiroty: Repository<User>,
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>
    ) {}

    async uploadUserImage(userId: string, file: Express.Multer.File){
        const user = await this.userReposiroty.findOneBy({id: userId});
    }
}
