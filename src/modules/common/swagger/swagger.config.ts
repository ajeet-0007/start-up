// src/swagger/swagger.config.ts

import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Swagger documentation for the API')
    .setVersion('1.0')
    .addBearerAuth() // optional for JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
