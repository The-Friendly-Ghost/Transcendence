import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Debug } from './utils';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';
import * as session from 'express-session';
import * as passport from 'passport';
import * as coockieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

dotenv.config(); // Load .env file to the `process` variable
if (Debug.ENABLED) {
  console.log('Debug mode enabled');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('Transcendence API')
    .setDescription('Transcendence API description')
    .setVersion('1.0')
    .addCookieAuth('JWT Token', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const origins: string[] = [
    '*',
    'https://api.intra.42.fr',
    'http://localhost:' + process.env.FRONTEND_PORT,
    'http://127.0.0.1:' + process.env.FRONTEND_PORT,
  ];
  // Add all possible codam dns's
  for (let f = 0; f < 2; f++) {
    for (let r = 1; r < 7; r++) {
      for (let s = 1; s < 30; s++) {
        origins.push('http://f' + f + 'r' + r + 's' + s + '.codam.nl:' + process.env.FRONTEND_PORT);
      }
    }
  }

  app.enableCors({
    origin: origins,
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    // credentials: true,
  });

  app.use(
    session({
      // 3600 * 24 * 1000 = 86400000 ms = 24 hours
      cookie: { maxAge: 86400000, httpOnly: false, secure: false },
      name: 'transcendence',
      secret: process.env.FORTYTWO_CLIENT_SECRET + process.env.JWT_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(coockieParser());

  // Start listening
  await app.listen(process.env.BACKEND_PORT || 3000);
}

bootstrap();
