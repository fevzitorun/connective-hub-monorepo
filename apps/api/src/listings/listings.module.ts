import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Listing } from './entities/listing.entity'
import { ListingPhoto } from './entities/listing-photo.entity'
import { ListingsService } from './listings.service'
import { ListingsController } from './listings.controller'
import { CsvImportService } from './csv-import.service'
import { WhatsappService } from '../common/services/whatsapp.service'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing, ListingPhoto]),
    UsersModule,
  ],
  controllers: [ListingsController],
  providers: [ListingsService, CsvImportService, WhatsappService],
  exports: [ListingsService],
})
export class ListingsModule {}
