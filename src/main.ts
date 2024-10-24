import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Console } from 'console';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Solo permite propiedades en el DTO
      forbidNonWhitelisted: true, // Prohíbe propiedades no permitidas
      transform: true, // Transforma automáticamente los tipos
    }),
  );
  const swaggerConfig = new DocumentBuilder()
    .setTitle('<API> DevNavigator')
    .setDescription(
      'Backend para una aplicación que proporciona una hoja de ruta clara y estructurada para el aprendizaje en desarrollo web.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT;
  await app.listen(PORT);
  logger.log(
    `Server listening in port ${PORT}`,
    'Base de datos DevNavigator OK',
    'DevNavigator',
  );
}

bootstrap();
