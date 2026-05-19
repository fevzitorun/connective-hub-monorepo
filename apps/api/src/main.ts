import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: process.env.NODE_ENV !== 'production' })
  )

  const configService = app.get(ConfigService)

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  // API versioning
  app.enableVersioning({ type: VersioningType.URI })

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://7fil.com.tr',
      'https://www.7fil.com.tr',
    ],
    credentials: true,
  })

  // Global prefix
  app.setGlobalPrefix('api')

  // Swagger (dev only)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('7fil API')
      .setDescription('7fil.com.tr — Powered by FILTERRA.AI')
      .setVersion('1.0')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/docs', app, document)
  }

  const port = configService.get<number>('PORT', 4000)
  await app.listen(port, '0.0.0.0')
  console.log(`🐘 7fil API çalışıyor: http://localhost:${port}/api`)
  console.log(`📖 Swagger: http://localhost:${port}/api/docs`)
}

bootstrap()
