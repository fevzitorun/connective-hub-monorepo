import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ThrottlerModule } from '@nestjs/throttler'
import { DatabaseModule } from './database/database.module'

@Module({
  imports: [
    // Config — load .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting — brute force koruması
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 10000, limit: 50 },
      { name: 'long', ttl: 60000, limit: 200 },
    ]),

    // Database
    DatabaseModule,

    // Feature modules (Modül 2'de eklenecek)
    // AuthModule,
    // UsersModule,
    // ListingsModule,
  ],
})
export class AppModule {}
