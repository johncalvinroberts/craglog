import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const frontendUrl = process.env.FRONTEND_URL;
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [
        frontendUrl,
        `http://${frontendUrl}`,
        `http://www.${frontendUrl}`,
      ],
    },
  });
  app.setGlobalPrefix('api');

  // only same origin requests in production
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors();
  }
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Craglog API')
    .setDescription('Craglog REST API specifications')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);
  await app.listen(3000);
}
bootstrap();
