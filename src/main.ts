import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './modules/common/swagger/swagger.config';
import { AllExceptionsFilter } from './modules/common/exceptions/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable CORS (adjust origin as needed)
  app.enableCors({ origin: '*' });

  // 2. Set a global API prefix
  app.setGlobalPrefix('api');

  // 3. Use Helmet to secure HTTP headers
  app.use(helmet());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // 4. Global Validation Pipe
  //    - whitelist: strip properties that don't have any decorators
  //    - forbidNonWhitelisted: throw an error if unknown props are present
  //    - transform: auto-transform payloads to DTO instances
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      validationError: { target: false },
    }),
  );

  // 5. Global Exception Filter
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new AllExceptionsFilter(
      httpAdapterHost,
      app.get(WINSTON_MODULE_NEST_PROVIDER),
    ),
  );

  // 6. Swagger setup at /api/docs
  setupSwagger(app);

  await app.listen(3000);
  console.log(`🚀 Application is running on: http://localhost:3000/api`);
  console.log(`📖 Swagger docs available at: http://localhost:3000/api/docs`);
}

bootstrap();
