import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FilterraReport } from './entities/filterra-report.entity'
import { FilterraService } from './filterra.service'
import { FilterraController } from './filterra.controller'
import { ListingWriterAgent } from './agents/listing-writer.agent'
import { TitleOptimizerAgent } from './agents/title-optimizer.agent'
import { ValuationAgent } from './agents/valuation.agent'
import { LegalPreCheckAgent } from './agents/legal-precheck.agent'
import { NeighborhoodAgent } from './agents/neighborhood.agent'
import { MarketTrendAgent } from './agents/market-trend.agent'
import { PhotoDescriptionAgent } from './agents/photo-description.agent'
import { TranslationAgent } from './agents/translation.agent'

@Module({
  imports: [TypeOrmModule.forFeature([FilterraReport])],
  controllers: [FilterraController],
  providers: [
    FilterraService,
    ListingWriterAgent,
    TitleOptimizerAgent,
    ValuationAgent,
    LegalPreCheckAgent,
    NeighborhoodAgent,
    MarketTrendAgent,
    PhotoDescriptionAgent,
    TranslationAgent,
  ],
  exports: [FilterraService],
})
export class FilterraModule {}
