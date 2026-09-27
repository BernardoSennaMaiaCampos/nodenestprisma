import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Helmet
  app.use(helmet());

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuração
  const configService = app.get(ConfigService);
  const porta = configService.get<number>('PORT', 3000);

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NodeNestPrisma API')
    .setDescription(
      'CRUD de usuarios, enderecos e contatos com JWT e RBAC.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documento = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );

  SwaggerModule.setup('docs', app, documento, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Inicialização
  await app.listen(porta);

  Logger.log(
    `API no ar em http://localhost:${porta}`,
    'Bootstrap',
  );
}

void bootstrap();

