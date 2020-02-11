import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json } from 'body-parser';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.setGlobalPrefix('api');
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
    .setBasePath('api')
    .addBearerAuth()
    .build();
  const jsonParseMiddleware = json();
  app.use((req: Request, res: Response, next: NextFunction) => {
    // do not parse json bodies if we are proxying
    if (req.path.indexOf('/job') !== -1) {
      next();
    } else {
      jsonParseMiddleware(req, res, next);
    }
  });
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);
  await app.listen(3000);
}
bootstrap();
