import {
  Controller, Post, Get, Body, Param, Query, Res,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { FilterraService } from './filterra.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User } from '../users/entities/user.entity'
import { ListingWriterInput } from './agents/listing-writer.agent'
import { TitleOptimizerInput } from './agents/title-optimizer.agent'
import { ValuationInput } from './agents/valuation.agent'
import { LegalPreCheckInput } from './agents/legal-precheck.agent'
import { NeighborhoodInput } from './agents/neighborhood.agent'
import { MarketTrendInput } from './agents/market-trend.agent'
import { PhotoDescriptionInput } from './agents/photo-description.agent'
import { TranslationInput } from './agents/translation.agent'

@ApiTags('filterra')
@ApiBearerAuth()
@Controller('filterra')
@Throttle({ long: { ttl: 60000, limit: 20 } })
export class FilterraController {
  constructor(private readonly filterra: FilterraService) {}

  // ── Listing Writer (SSE streaming) ───────────────────────────────────────────

  @Post('write')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'AI ile ilan açıklaması oluştur (SSE stream)' })
  async streamWrite(
    @Body() body: { input: ListingWriterInput; listingId?: string },
    @CurrentUser() user: User,
    @Res() res: FastifyReply,
  ) {
    await this.filterra.streamListingDescription(body.input, res, body.listingId, user.id)
  }

  // ── Title Optimizer ──────────────────────────────────────────────────────────

  @Post('titles')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '3 alternatif SEO başlığı öner' })
  async optimizeTitles(
    @Body() body: { input: TitleOptimizerInput; listingId?: string },
    @CurrentUser() user: User,
  ) {
    const result = await this.filterra.optimizeTitles(body.input, body.listingId, user.id)
    return { success: true, data: result }
  }

  // ── Valuation ────────────────────────────────────────────────────────────────

  @Post('valuate')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mülk ekspertiz değeri hesapla' })
  async valuate(
    @Body() body: { input: ValuationInput; listingId?: string },
    @CurrentUser() user: User,
  ) {
    const result = await this.filterra.valuateListing(body.input, body.listingId, user.id)
    return { success: true, data: result }
  }

  // ── Legal Pre-Check ──────────────────────────────────────────────────────────

  @Post('legal')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hukuki ön kontrol yap (Opus)' })
  async legalCheck(
    @Body() body: { input: LegalPreCheckInput; listingId?: string },
    @CurrentUser() user: User,
  ) {
    const result = await this.filterra.legalCheck(body.input, body.listingId, user.id)
    return { success: true, data: result }
  }

  // ── Neighborhood Analysis — public (no auth required) ────────────────────────

  @Post('neighborhood')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mahalle skoru ve analizi' })
  async neighborhood(
    @Body() body: { input: NeighborhoodInput; listingId?: string },
  ) {
    const result = await this.filterra.analyzeNeighborhood(body.input, body.listingId)
    return { success: true, data: result }
  }

  // ── Market Trend — public ────────────────────────────────────────────────────

  @Get('market-trend')
  @ApiOperation({ summary: 'Bölge piyasa trendi analizi' })
  async marketTrend(
    @Query('city') city: string,
    @Query('district') district: string,
    @Query('propertyType') propertyType: string,
    @Query('listingType') listingType: string,
  ) {
    const input: MarketTrendInput = {
      city,
      district: district || undefined,
      propertyType: propertyType ?? 'residential',
      listingType: listingType ?? 'sale',
    }
    const result = await this.filterra.analyzeMarketTrend(input)
    return { success: true, data: result }
  }

  // ── Photo Description ────────────────────────────────────────────────────────

  @Post('photo-describe')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fotoğrafı AI ile analiz et (multimodal Haiku)' })
  async describePhoto(
    @Body() body: { input: PhotoDescriptionInput; listingId?: string },
    @CurrentUser() user: User,
  ) {
    const result = await this.filterra.describePhoto(body.input, body.listingId, user.id)
    return { success: true, data: result }
  }

  // ── Translation — public ─────────────────────────────────────────────────────

  @Post('translate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'İlanı yabancı dile çevir (EN/AR/RU/DE/FR)' })
  async translate(
    @Body() body: { input: TranslationInput; listingId?: string },
  ) {
    const result = await this.filterra.translateListing(body.input, body.listingId)
    return { success: true, data: result }
  }

  // ── Full Analysis — public (listing detail page) ─────────────────────────────

  @Post('full/:listingId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'İlan detay sayfası için tam analiz (ekspertiz + hukuki + mahalle)' })
  async fullAnalysis(
    @Param('listingId') listingId: string,
    @Body() body: {
      input: ValuationInput & LegalPreCheckInput & NeighborhoodInput & { title: string }
    },
  ) {
    const result = await this.filterra.fullListingAnalysis(body.input, listingId)
    return { success: true, data: result }
  }
}
