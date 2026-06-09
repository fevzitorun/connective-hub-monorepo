import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FastifyReply } from 'fastify'
import { FilterraReport } from './entities/filterra-report.entity'
import { ListingWriterAgent, ListingWriterInput } from './agents/listing-writer.agent'
import { TitleOptimizerAgent, TitleOptimizerInput } from './agents/title-optimizer.agent'
import { ValuationAgent, ValuationInput } from './agents/valuation.agent'
import { LegalPreCheckAgent, LegalPreCheckInput } from './agents/legal-precheck.agent'
import { NeighborhoodAgent, NeighborhoodInput } from './agents/neighborhood.agent'
import { MarketTrendAgent, MarketTrendInput } from './agents/market-trend.agent'
import { PhotoDescriptionAgent, PhotoDescriptionInput } from './agents/photo-description.agent'
import { TranslationAgent, TranslationInput } from './agents/translation.agent'

@Injectable()
export class FilterraService {
  private readonly logger = new Logger(FilterraService.name)

  constructor(
    @InjectRepository(FilterraReport)
    private reportRepo: Repository<FilterraReport>,
    private listingWriter: ListingWriterAgent,
    private titleOptimizer: TitleOptimizerAgent,
    private valuation: ValuationAgent,
    private legalPreCheck: LegalPreCheckAgent,
    private neighborhood: NeighborhoodAgent,
    private marketTrend: MarketTrendAgent,
    private photoDescription: PhotoDescriptionAgent,
    private translation: TranslationAgent,
  ) {}

  async streamListingDescription(
    input: ListingWriterInput,
    res: FastifyReply,
    listingId?: string,
    userId?: string,
  ): Promise<void> {
    const start = Date.now()
    try {
      const { text, tokensUsed } = await this.listingWriter.streamTo(input, res)
      await this.saveReport({
        agent: 'listing_writer',
        modelId: 'claude-sonnet-4-6',
        listingId,
        userId,
        inputData: input as unknown as Record<string, unknown>,
        outputData: { text },
        tokensUsed,
        durationMs: Date.now() - start,
      })
    } catch (err) {
      this.logger.error('ListingWriter stream error', err)
      if (!res.raw.headersSent) {
        res.raw.write(`data: ${JSON.stringify({ error: 'AI servisi geçici olarak kullanılamıyor.' })}\n\n`)
        res.raw.end()
      }
      await this.saveReport({
        agent: 'listing_writer',
        modelId: 'claude-sonnet-4-6',
        listingId,
        userId,
        inputData: input as unknown as Record<string, unknown>,
        durationMs: Date.now() - start,
        error: String(err),
      })
    }
  }



  async optimizeTitles(input: TitleOptimizerInput, listingId?: string, userId?: string) {
    const start = Date.now()
    try {
      const result = await this.titleOptimizer.optimize(input)
      await this.saveReport({
        agent: 'title_optimizer',
        modelId: 'claude-haiku-4-5-20251001',
        listingId,
        userId,
        inputData: input as unknown as Record<string, unknown>,
        outputData: result as unknown as Record<string, unknown>,
        tokensUsed: result.tokensUsed,
        durationMs: Date.now() - start,
      })
      return result
    } catch (err) {
      this.logger.error('TitleOptimizer error', err)
      throw err
    }
  }

  async valuateListing(input: ValuationInput, listingId?: string, userId?: string) {
    const start = Date.now()
    try {
      const result = await this.valuation.valuate(input)
      await this.saveReport({
        agent: 'valuation',
        modelId: 'claude-sonnet-4-6',
        listingId,
        userId,
        inputData: input as unknown as Record<string, unknown>,
        outputData: result as unknown as Record<string, unknown>,
        tokensUsed: result.tokensUsed,
        durationMs: Date.now() - start,
      })
      return result
    } catch (err) {
      this.logger.error('Valuation error', err)
      throw err
    }
  }

  async legalCheck(input: LegalPreCheckInput, listingId?: string, userId?: string) {
    const start = Date.now()
    try {
      const result = await this.legalPreCheck.check(input)
      await this.saveReport({
        agent: 'legal_precheck',
        modelId: 'claude-opus-4-7',
        listingId,
        userId,
        inputData: input as unknown as Record<string, unknown>,
        outputData: result as unknown as Record<string, unknown>,
        tokensUsed: result.tokensUsed,
        durationMs: Date.now() - start,
      })
      return result
    } catch (err) {
      this.logger.error('LegalPreCheck error', err)
      throw err
    }
  }

  async analyzeNeighborhood(input: NeighborhoodInput, listingId?: string, userId?: string) {
    const start = Date.now()
    try {
      const result = await this.neighborhood.analyze(input)
      await this.saveReport({
        agent: 'neighborhood',
        modelId: 'claude-sonnet-4-6',
        listingId,
        userId,
        inputData: input as unknown as Record<string, unknown>,
        outputData: result as unknown as Record<string, unknown>,
        tokensUsed: result.tokensUsed,
        durationMs: Date.now() - start,
      })
      return result
    } catch (err) {
      this.logger.error('Neighborhood error', err)
      throw err
    }
  }

  async analyzeMarketTrend(input: MarketTrendInput, userId?: string) {
    const start = Date.now()
    try {
      const result = await this.marketTrend.analyze(input)
      await this.saveReport({
        agent: 'market_trend',
        modelId: 'claude-sonnet-4-6',
        userId,
        inputData: input as unknown as Record<string, unknown>,
        outputData: result as unknown as Record<string, unknown>,
        tokensUsed: result.tokensUsed,
        durationMs: Date.now() - start,
      })
      return result
    } catch (err) {
      this.logger.error('MarketTrend error', err)
      throw err
    }
  }

  async describePhoto(input: PhotoDescriptionInput, listingId?: string, userId?: string) {
    const start = Date.now()
    try {
      const result = await this.photoDescription.describe(input)
      await this.saveReport({
        agent: 'photo_description',
        modelId: 'claude-haiku-4-5-20251001',
        listingId,
        userId,
        inputData: { imageUrl: input.imageUrl, propertyType: input.propertyType },
        outputData: result as unknown as Record<string, unknown>,
        tokensUsed: result.tokensUsed,
        durationMs: Date.now() - start,
      })
      return result
    } catch (err) {
      this.logger.error('PhotoDescription error', err)
      throw err
    }
  }

  async translateListing(input: TranslationInput, listingId?: string, userId?: string) {
    const start = Date.now()
    try {
      const result = await this.translation.translate(input)
      await this.saveReport({
        agent: 'translation',
        modelId: 'claude-haiku-4-5-20251001',
        listingId,
        userId,
        inputData: { ...input, description: input.description.slice(0, 100) },
        outputData: { targetLanguage: result.targetLanguage },
        tokensUsed: result.tokensUsed,
        durationMs: Date.now() - start,
      })
      return result
    } catch (err) {
      this.logger.error('Translation error', err)
      throw err
    }
  }

  // Full analysis for listing detail page — runs valuation + legal + neighborhood in parallel
  async fullListingAnalysis(
    listing: ValuationInput & LegalPreCheckInput & NeighborhoodInput & { title: string },
    listingId: string,
    userId?: string,
  ) {
    const [valuationResult, legalResult, neighborhoodResult] = await Promise.allSettled([
      this.valuateListing(listing, listingId, userId),
      this.legalCheck(listing, listingId, userId),
      this.analyzeNeighborhood(listing, listingId, userId),
    ])

    return {
      valuation: valuationResult.status === 'fulfilled' ? valuationResult.value : null,
      legal: legalResult.status === 'fulfilled' ? legalResult.value : null,
      neighborhood: neighborhoodResult.status === 'fulfilled' ? neighborhoodResult.value : null,
    }
  }

  private async saveReport(data: {
    agent: FilterraReport['agent']
    modelId: string
    listingId?: string
    userId?: string
    inputData?: Record<string, unknown>
    outputData?: Record<string, unknown>
    tokensUsed?: number
    durationMs?: number
    error?: string
  }) {
    try {
      await this.reportRepo.save(
        this.reportRepo.create({
          agent: data.agent,
          modelId: data.modelId,
          listingId: data.listingId,
          userId: data.userId,
          inputData: data.inputData,
          outputData: data.outputData,
          tokensUsed: data.tokensUsed,
          durationMs: data.durationMs,
          error: data.error,
        }),
      )
    } catch (err) {
      this.logger.warn('Failed to save filterra report', err)
    }
  }
}
