import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/AuthGuard';
import { TypeGuard } from 'src/auth/guards/TypeGuard';
import { UserType } from 'src/user/enum/UserType.enum';
import { TypeUser } from 'src/decorator/type.decorator';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @ApiOperation({
    summary: 'Crear una suscripcion para un usuario dado.',
    description:
      'Este endpoint permite crear una suscripcion para un usuario especifico identificado por su ID.',
  })
  @ApiResponse({
    status: 201,
    description: 'Devuelve la suscripcion actualizada.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 409, description: 'User already subscribed.' })
  @ApiBearerAuth()
  /* @UseGuards(AuthGuard) */
  @Post(':userId')
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @ApiOperation({
    summary: 'Obtener la lista de suscripciones.',
    description:
      'Este endpoint permite obtener la lista de suscripciones con sus respectivos usuarios. Para ejecutarlo se necesita tener un token valido y esta restringido para usuarios administradores. ',
  })
  @ApiResponse({ status: 200, description: 'Lista de suscripciones' })
  @ApiBearerAuth()
  @TypeUser(UserType.SuperAdmin)
  @UseGuards(AuthGuard, TypeGuard)
  @Get()
  findAll(@Query('limit') limit = 5, @Query('page') page = 1) {
    return this.subscriptionsService.findAll(Number(limit), Number(page));
  }

  @ApiOperation({
    summary: 'Obtener una suscripcion.',
    description:
      'Este endpoint permite obtener una suscripcion y su respectivo usuario. Para ejecutarlo se necesita un token valido. ',
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve la suscripcion con su usuario.',
  })
  @ApiResponse({ status: 404, description: 'Subscription with ID not found' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Actualizar la suscripcion.',
    description:
      'Este endpoint permite dar de baja o alta una suscripcion. Para ejecutarlo se necesita un token valido.',
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve la suscripcion actualizada.',
  })
  @ApiResponse({ status: 404, description: `Subscription with ID not found.` })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(id, updateSubscriptionDto);
  }

  @ApiOperation({
    summary: 'Dar de baja una suscripcion.',
    description:
      'Este endpoint permite dar de baja una suscripcion. Esta funcion actua como un soft delete.',
  })
  @ApiResponse({ status: 200, description: 'ID del recurso eliminado.' })
  @ApiResponse({
    status: 404,
    description: `Subscription with ID not found`,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionsService.remove(id);
  }

  @ApiOperation({
    summary: 'Obtiene una suscripcion por el ID',
    description:
      'Este endpoint permite obtener una suscripcion con su respectivo usuario.',
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve la suscripcion con su usuario.',
  })
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.subscriptionsService.findByUserId(userId);
  }

  @ApiOperation({
    summary: 'Obtiene una suscripcion por el email.',
    description:
      'Este endpoint permite obtener una suscripcion con su respectivo usuario.',
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve la suscripcion de un usuario buscada por su ID.',
  })
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.subscriptionsService.findByEmail(email);
  }
}
