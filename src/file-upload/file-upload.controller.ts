import { Controller, FileTypeValidator, MaxFileSizeValidator, Param, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) { }

  @Post('imgprofile/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImgProfile(@Param('id') id: string, 
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 200000, message: 'Max file size is 200kb' }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/})
        ]
      })
    ) file: Express.Multer.File) {
    return await this.fileUploadService.uploadUserImage(id, file);
  }

}
