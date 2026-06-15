import {
  Controller, Get, Post, Delete, Body, Query, Param,
  UseGuards, HttpCode, HttpStatus, ParseUUIDPipe,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { IsOptional, IsString, IsEnum, IsNumber, IsBoolean } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { SearchService } from './search.service'
import { SavedSearchService } from './saved-search.service'
import { AlertChannel } from './entities/saved-search.entity'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User } from '../users/entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Listing, ListingStatus } from '../listings/entities/listing.entity'

class SearchQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() q?: string
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string
  @ApiPropertyOptional() @IsOptional() @IsString() district?: string
  @ApiPropertyOptional() @IsOptional() @IsString() propertyType?: string
  @ApiPropertyOptional() @IsOptional() @IsString() listingType?: string
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number) priceMin?: number
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number) priceMax?: number
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number) areaMin?: number
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number) areaMax?: number
  @ApiPropertyOptional() @IsOptional() @IsString() roomCount?: string
  @ApiPropertyOptional() @IsOptional() @Transform(({ value }) => value === 'true') @IsBoolean() hasParking?: boolean
  @ApiPropertyOptional() @IsOptional() @Transform(({ value }) => value === 'true') @IsBoolean() hasElevator?: boolean
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number) page?: number
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number) perPage?: number
  @ApiPropertyOptional() @IsOptional() @IsString() sortBy?: string
}

class CreateAlertDto {
  filters: Record<string, any>
  label?: string
  @IsEnum(AlertChannel) channel: AlertChannel
}

@ApiTags('Search')
@Controller('search')

export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly savedSearchService: SavedSearchService,
    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>,
  ) {}

  // GET /api/v1/search?q=kadıköy+3+1&city=İstanbul
  @Get()
  @ApiOperation({ summary: 'Meilisearch ile ilan ara' })
  search(@Query() query: SearchQueryDto) {
    return this.searchService.search(query)
  }

  // GET /api/v1/search/map?city=İstanbul&listingType=sale
  // Harita için sadece id + koordinat + fiyat döner (hafif)
  @Get('map')
  @ApiOperation({ summary: 'Harita pinleri için hafif koordinat listesi' })
  async mapPins(@Query() query: { city?: string; listingType?: string; propertyType?: string }) {
    const qb = this.listingRepo.createQueryBuilder('l')
      .select([
        'l.id', 'l.title', 'l.price', 'l.currency', 'l.listing_type',
        `ST_X(l.coordinates::geometry) as lng`,
        `ST_Y(l.coordinates::geometry) as lat`,
      ])
      .where('l.status = :status', { status: ListingStatus.ACTIVE })
      .andWhere('l.coordinates IS NOT NULL')
      .limit(2000)

    if (query.city)         qb.andWhere('l.city = :city', { city: query.city })
    if (query.listingType)  qb.andWhere('l.listing_type = :lt', { lt: query.listingType })
    if (query.propertyType) qb.andWhere('l.property_type = :pt', { pt: query.propertyType })

    const rows = await qb.getRawMany()
    return rows.map((r) => ({
      id:          r.l_id,
      title:       r.l_title,
      price:       r.l_price,
      currency:    r.l_currency,
      listingType: r.l_listing_type,
      lat:         parseFloat(r.lat),
      lng:         parseFloat(r.lng),
    }))
  }

  // GET /api/v1/search/autocomplete?q=kad
  @Get('autocomplete')
  @ApiOperation({ summary: 'Şehir/ilçe otomatik tamamlama' })
  async autocomplete(@Query('q') q: string) {
    if (!q || q.length < 2) return []
    return this.searchService.search({ q, perPage: 5 })
  }

  // ─── Kayıtlı Aramalar ─────────────────────────────────────────────────────

  @Get('alerts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kayıtlı aramalarımı listele' })
  getAlerts(@CurrentUser() user: User) {
    return this.savedSearchService.findByUser(user.id)
  }

  @Post('alerts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Arama alarmı oluştur' })
  createAlert(@Body() dto: CreateAlertDto, @CurrentUser() user: User) {
    return this.savedSearchService.create(user.id, dto.filters, dto.channel, dto.label)
  }

  @Delete('alerts/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Arama alarmını sil' })
  deleteAlert(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.savedSearchService.remove(id, user.id)
  }
}
