import {
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/AuthGuard';
import { TypeGuard } from 'src/auth/guards/TypeGuard';
import { TypeUser } from 'src/decorator/type.decorator';
import { UserType } from 'src/user/enum/UserType.enum';

@ApiTags('File Upload')
@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @ApiOperation({
    summary: 'Subir imagen de perfil de usuario.',
    description:
      'Este endpoint permite actualizar la imagen de perfil de un usuario, la imagen se guardará en la base de datos y en Cloudinary.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Devuelve los datos del usuario actualizado sin la contraseña.',
  })
  @ApiResponse({ status: 404, description: 'El usuario no existe.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Imagen a subir',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @Post('imgprofile/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImgProfile(
    @Param('id', ParseUUIDPipe) id: string,
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
    summary: 'Subir imagen de curso.',
    description:
      'Este endpoint permite actualizar la imagen de un curso, la imagen se guardará en la base de datos y en Cloudinary.',
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve los datos del curso actualizado.',
  })
  @ApiResponse({ status: 404, description: 'El curso no existe.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Imagen a subir',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  /* @TypeUser(UserType.Admin, UserType.SuperAdmin)
  @UseGuards(AuthGuard, TypeGuard) */
  /* @ApiBearerAuth() */
  @HttpCode(200)
  @Post('imgcourse/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImgCourse(
    @Param('id', ParseUUIDPipe) id: string,
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
