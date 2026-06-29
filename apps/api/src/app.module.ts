import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { ScheduleModule } from '@nestjs/schedule'
import { DatabaseModule } from './database/database.module'
import { StorageModule } from './storage/storage.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { ListingsModule } from './listings/listings.module'
import { SearchModule } from './search/search.module'
import { AgencyModule } from './agency/agency.module'
import { FavoritesModule } from './favorites/favorites.module'
import { FilterraModule } from './filterra/filterra.module'
import { LegalModule } from './legal/legal.module'
import { FinanceModule } from './finance/finance.module'
import { TicariModule } from './ticari/ticari.module'
import { WhitelabelModule } from './whitelabel/whitelabel.module'
import { AnalyticsModule } from './analytics/analytics.module'
import { MailModule } from './mail/mail.module'
import { AuctionModule } from './auction/auction.module'
import { AtlasModule } from './atlas/atlas.module'
import { AdminModule } from './admin/admin.module'
import { PartnerModule } from './partner/partner.module'
import { MlsModule }     from './mls/mls.module'
import { CrmModule }     from './crm/crm.module'
import { ScribeModule }  from './agents/scribe/scribe.module'
import { PublicModule }  from './public/public.module'

@Module({
  imports: [
    // Config — load .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Zamanlanmış görevler (listing expire, token temizliği)
    ScheduleModule.forRoot(),

    // Rate limiting — brute force koruması
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 10000, limit: 50 },
      { name: 'long', ttl: 60000, limit: 200 },
    ]),

    // Database
    DatabaseModule,
    MailModule,

    StorageModule,
    AuthModule,
    UsersModule,
    ListingsModule,
    SearchModule,
    AgencyModule,
    FavoritesModule,
    FilterraModule,
    LegalModule,
    FinanceModule,
    TicariModule,
    WhitelabelModule,
    AnalyticsModule,
    AuctionModule,
    AtlasModule,
    AdminModule,
    PartnerModule,
    MlsModule,      // Modül B — Emlakçılar Arası MLS Portföy Paylaşımı
    CrmModule,      // M-01  — CRM & Lead Yönetimi
    ScribeModule,   // M-04  — SCRIBE AI İçerik Ajansı
    PublicModule,   // Public — Landing page lead capture (auth yok)
  ],
})
export class AppModule {}
