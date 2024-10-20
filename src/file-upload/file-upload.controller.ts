import { Controller, FileTypeValidator, MaxFileSizeValidator, Param, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/guards/AuthGuard';

@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) { }

  @Post('imgprofile/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImgProfile(@Param('id') id: string, 
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000, message: 'Max file size is 500kb' }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/})
        ]
      })
    ) file: Express.Multer.File) {
    return await this.fileUploadService.uploadUserImage(id, file);
  }

  @Post('imgcourse/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImgCourse(@Param('id') id: string, 
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000, message: 'Max file size is 2mb' }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/})
        ]
      })
    ) file: Express.Multer.File) {
    return await this.fileUploadService.uploadCourseImage(id, file);
  }
}