import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('imgprofile')
  @UseInterceptors(FileInterceptor('file'))
  uploadImgProfile(@UploadedFile() file: Express.Multer.File){
    return file;
  }

}
