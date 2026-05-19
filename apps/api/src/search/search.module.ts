import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SearchService } from './search.service'
import { SavedSearchService } from './saved-search.service'
import { SearchController } from './search.controller'
import { SavedSearch } from './entities/saved-search.entity'
import { Listing } from '../listings/entities/listing.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([SavedSearch, Listing]),
  ],
  controllers: [SearchController],
  providers: [SearchService, SavedSearchService],
  exports: [SearchService, SavedSearchService],
})
export class SearchModule {}
