import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { DatabaseModule } from './database/database.module'
import { StorageModule } from './storage/storage.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { ListingsModule } from './listings/listings.module'
import { SearchModule } from './search/search.module'
import { AgencyModule } from './agency/agency.module'
import { FavoritesModule } from './favorites/favorites.module'

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

    StorageModule,
    AuthModule,
    UsersModule,
    ListingsModule,
    SearchModule,
    AgencyModule,
    FavoritesModule,
  ],
})
export class AppModule {}
