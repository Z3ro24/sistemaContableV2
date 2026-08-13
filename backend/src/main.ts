import 'dotenv/config';

// Suppress pg driver adapter deprecation warning on concurrent query execution
process.on('warning', (warning) => {
  if (warning.name === 'DeprecationWarning' && warning.message.includes('client.query()')) {
    return;
  }
  console.warn(warning);
});

import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './prisma/prisma-client-exception.filter';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { doubleCsrfProtection } from './csrf.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api/v1');

  // Trust proxy (enables rate limiters to read X-Forwarded-For headers correctly)
  app.set('trust proxy', 1);

  // Global secure headers
  app.use(helmet());

  // Global CORS configuration
  app.enableCors({
    origin: process.env.CORS_ALLOWED_ORIGINS
      ? process.env.CORS_ALLOWED_ORIGINS.split(',')
      : true,
    credentials: true,
  });

  // Cookie parser requires COOKIE_SECRET environment variable
  const cookieSecret = process.env.COOKIE_SECRET;
  if (!cookieSecret) {
    throw new Error('COOKIE_SECRET environment variable is missing in .env');
  }
  app.use(cookieParser(cookieSecret));

  // Enable Double Submit Cookie CSRF Protection
  app.use(doubleCsrfProtection);

  // Enable global validation pipe for request DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Enable global Prisma client exception filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const port = process.env.PORT ?? 3000;
  console.log(`Server is running on port ${port}`);
  await app.listen(port);
}
bootstrap();
