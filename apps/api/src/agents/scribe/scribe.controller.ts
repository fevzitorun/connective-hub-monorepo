import {
  Controller,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ScribeService, ContentType } from './scribe.service'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../../auth/decorators/current-user.decorator'

interface JwtPayload { sub: string; agencyId?: string }

// ─── Request DTOs ─────────────────────────────────────────────────────────────

class GenerateContentDto {
  @ApiProperty({ enum: ['blog','social_pack','listing_desc','market_report','press_release'] })
  @IsEnum(['blog','social_pack','listing_desc','market_report','press_release'])
  type: ContentType

  @ApiProperty({ example: 'İstanbul Kadıköy 2026 kira trendleri' })
  @IsString()
  topic: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  context?: string

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  keywords?: string[]

  @ApiPropertyOptional({ enum: ['professional','friendly','urgent'] })
  @IsOptional()
  @IsEnum(['professional','friendly','urgent'])
  tone?: 'professional' | 'friendly' | 'urgent'
}

// ─── Controller ───────────────────────────────────────────────────────────────

@ApiTags('Agents / SCRIBE')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('agents/scribe')
@Throttle({ long: { ttl: 60000, limit: 10 } })
export class ScribeController {
  constructor(private readonly scribeService: ScribeService) {}

  /**
   * POST /agents/scribe/generate
   * Genel içerik üretim endpointi.
   */
  @Post('generate')
  @ApiOperation({ summary: 'SCRIBE — İçerik üret (blog, sosyal medya, rapor vb.)' })
  @ApiResponse({ status: 201, description: 'İçerik üretildi' })
  async generate(
    @Body() dto: GenerateContentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.scribeService.generate({
      ...dto,
      agencyId: user.agencyId,
      requestedByUserId: user.sub,
    })
  }

  /**
   * POST /agents/scribe/blog
   * Hızlı blog üretimi.
   */
  @Post('blog')
  @ApiOperation({ summary: 'SCRIBE — Hızlı blog yazısı üret' })
  async generateBlog(
    @Body() dto: { topic: string; keywords?: string[] },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.scribeService.generateBlog(dto.topic, dto.keywords, user.agencyId)
  }

  /**
   * POST /agents/scribe/social-pack
   * 7-platform sosyal medya paketi.
   */
  @Post('social-pack')
  @ApiOperation({ summary: 'SCRIBE — 7 platform sosyal medya paketi üret' })
  async generateSocialPack(
    @Body() dto: { topic: string; context?: string },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.scribeService.generateSocialPack(dto.topic, dto.context, user.agencyId)
  }

  /**
   * POST /agents/scribe/listings/:id/enrich
   * İlan açıklaması zenginleştir.
   */
  @Post('listings/:id/enrich')
  @ApiOperation({ summary: 'SCRIBE — İlan açıklaması zenginleştir' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async enrichListing(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.scribeService.enrichListingDescription(id, user.agencyId)
  }

  /**
   * POST /agents/scribe/market-report/:city
   * Şehir pazar raporu.
   */
  @Post('market-report/:city')
  @ApiOperation({ summary: 'SCRIBE — Şehir pazar raporu üret' })
  @ApiParam({ name: 'city', type: 'string', example: 'istanbul' })
  async generateMarketReport(
    @Param('city') city: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.scribeService.generateMarketReport(city, user.agencyId)
  }
}
