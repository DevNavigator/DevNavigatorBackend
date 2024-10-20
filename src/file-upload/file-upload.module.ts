import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { FileUploadRepository } from './file-upload.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  imports: [UserModule, CoursesModule],
  controllers: [FileUploadController],
  providers: [FileUploadService, FileUploadRepository],
})
export class FileUploadModule {}
