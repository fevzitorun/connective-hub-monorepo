import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  UseGuards, Res, HttpCode, HttpStatus, ParseUUIDPipe, Version, Req,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { FastifyRequest, FastifyReply } from 'fastify'
import { ListingsService } from './listings.service'
import { CsvImportService } from './csv-import.service'
import { CreateListingDto } from './dto/create-listing.dto'
import { ListingFiltersDto } from './dto/listing-filters.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { Roles } from '../auth/decorators/roles.decorator'
import { User, UserRole } from '../users/entities/user.entity'

@ApiTags('Listings')
@Controller('listings')
@Version('1')
export class ListingsController {
  constructor(
    private readonly listingsService: ListingsService,
    private readonly csvImportService: CsvImportService,
  ) {}

  // ─── Public ──────────────────────────────────────────────────────────────

  // GET /api/v1/listings/sitemap — sitemap.xml için aktif ilan ID listesi
  @Get('sitemap')
  @ApiOperation({ summary: 'Sitemap için aktif ilan ID listesi' })
  getSitemapIds() {
    return this.listingsService.getSitemapIds()
  }

  // GET /api/v1/listings?city=İstanbul&district=Kadıköy&...
  @Get()
  @ApiOperation({ summary: 'İlanları filtrele ve listele' })
  findAll(@Query() filters: ListingFiltersDto) {
    return this.listingsService.findAll(filters)
  }

  // GET /api/v1/listings/:id
  @Get(':id')
  @ApiOperation({ summary: 'İlan detayı' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const listing = await this.listingsService.findById(id)
    // Görüntülenme sayısını arka planda artır (cevabı bekletme)
    this.listingsService.incrementView(id).catch(() => null)
    return listing
  }

  // POST /api/v1/listings/:id/whatsapp-click
  @Post(':id/whatsapp-click')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'WhatsApp tıklamasını kaydet' })
  trackWhatsapp(@Param('id', ParseUUIDPipe) id: string) {
    return this.listingsService.incrementWhatsappClick(id)
  }

  // ─── Korumalı ────────────────────────────────────────────────────────────

  // POST /api/v1/listings
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENCY, UserRole.AGENT_PERSON, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yeni ilan oluştur' })
  create(@Body() dto: CreateListingDto, @CurrentUser() user: User) {
    return this.listingsService.create(dto, user.id)
  }

  // PATCH /api/v1/listings/:id
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'İlanı güncelle' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Partial<CreateListingDto>,
    @CurrentUser() user: User,
  ) {
    return this.listingsService.update(id, dto, user.id)
  }

  // POST /api/v1/listings/:id/publish
  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'İlanı yayınla (draft → active)' })
  publish(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.listingsService.publish(id, user.id)
  }

  // DELETE /api/v1/listings/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'İlanı sil' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.listingsService.remove(id, user.id)
  }

  // ─── Fotoğraf ────────────────────────────────────────────────────────────

  // POST /api/v1/listings/:id/photos/reorder
  @Post(':id/photos/reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fotoğraf sırasını güncelle' })
  reorderPhotos(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { orderedIds: string[] },
    @CurrentUser() user: User,
  ) {
    return this.listingsService.reorderPhotos(id, user.id, body.orderedIds)
  }

  // POST /api/v1/listings/:id/photos  (multipart/form-data, field: file)
  @Post(':id/photos')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'İlana fotoğraf yükle (maks 10MB, maks 20 adet)' })
  async uploadPhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Req() req: FastifyRequest,
  ) {
    const file = await (req as any).file()
    if (!file) throw new Error('Dosya bulunamadı')

    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.mimetype)) {
      throw new Error('Sadece JPEG, PNG ve WebP formatları kabul edilir')
    }

    const buffer = await file.toBuffer()
    return this.listingsService.uploadPhoto(id, user.id, buffer, file.mimetype)
  }

  // DELETE /api/v1/listings/photos/:photoId
  @Delete('photos/:photoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fotoğraf sil' })
  deletePhoto(@Param('photoId', ParseUUIDPipe) photoId: string, @CurrentUser() user: User) {
    return this.listingsService.deletePhoto(photoId, user.id)
  }

  // ─── CSV Import (Pilot) ──────────────────────────────────────────────────

  // GET /api/v1/listings/csv/template
  @Get('csv/template')
  @ApiOperation({ summary: 'CSV şablonu indir (pilot ajanslar için)' })
  downloadTemplate(@Res() res: Response) {
    const csv = CsvImportService.templateCsv()
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="7fil-ilan-sablonu.csv"')
    res.send('﻿' + csv)  // BOM — Excel'de Türkçe karakter desteği
  }

  // POST /api/v1/listings/csv/import  (multipart/form-data, field: file)
  @Post('csv/import')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENCY, UserRole.AGENT_PERSON, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Throttle({ long: { ttl: 60000, limit: 3 } })
  @ApiOperation({ summary: 'CSV ile toplu ilan yükle (maks 500 satır)' })
  async importCsv(@Body() body: { file: string }, @CurrentUser() user: User) {
    // Fastify multipart — gerçek implementasyonda @fastify/multipart kullanılacak
    // Şimdilik base64 body field olarak alıyoruz
    const buffer = Buffer.from(body.file, 'base64')
    return this.csvImportService.importFromBuffer(buffer, user.id)
  }
}
