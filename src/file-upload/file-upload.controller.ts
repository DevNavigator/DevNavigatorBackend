import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('file-upload')
@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @ApiOperation({
    summary: 'Cambiar imagen de perfil del usuario.',
    description:
      'Este endpoint permite cambiar la imagen de perfil del usuario. Esta imagen debe tener un tamaño máximo de 500kb y un formato de tipo jpg, jpeg o png.',
  })
  @ApiResponse({ status: 200, description: 'Devuelve el usuario actualizado.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Post('imgprofile/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImgProfile(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 500000, // Cambié el tamaño máximo a 500kb
            message: 'Max file size is 500kb',
          }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.fileUploadService.uploadUserImage(id, file);
  }

  @ApiOperation({
    summary: 'Cambiar imagen del curso.',
    description:
      'Este endpoint permite cambiar la imagen del curso. Esta imagen debe tener un tamaño máximo de 2mb y un formato de tipo jpg, jpeg o png.',
  })
  @ApiResponse({ status: 201, description: 'Devuelve el curso actualizado.' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @Post('imgcourse/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImgCourse(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 2000000,
            message: 'Max file size is 2mb',
          }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.fileUploadService.uploadCourseImage(id, file);
  }
}
