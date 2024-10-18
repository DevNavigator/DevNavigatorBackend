import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Query,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/AuthGuard';
import { TypeGuard } from 'src/auth/guards/TypeGuard';
import { UserType } from './enum/UserType.enum';
import { TypeUser } from 'src/decorator/type.decorator';
import { UpdateBySuperAdmin } from './dto/update-bySuperadmin-dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @TypeUser(UserType.Admin, UserType.SuperAdmin)
  @UseGuards(AuthGuard, TypeGuard)
  @HttpCode(200)
  @Get()
  findAll(@Query('limit') limit = 5, @Query('page') page = 1) {
    return this.userService.findAll(Number(limit), Number(page));
  }
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch('/userupdate/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @TypeUser(UserType.SuperAdmin)
  @UseGuards(AuthGuard, TypeGuard)
  @Patch('/adminupdate/:id')
  updateToAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateByAdmin: UpdateBySuperAdmin,
  ) {
    return this.userService.updateAdmin(id, updateByAdmin);
  }
}
