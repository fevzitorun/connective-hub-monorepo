import {
  Controller, Get, Put, Post, Body, Param,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { WhitelabelService } from './whitelabel.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User } from '../users/entities/user.entity'

// ── Authenticated agency branding management ──────────────────────────────────

@ApiTags('whitelabel')
@ApiBearerAuth()
@Controller('whitelabel')
@UseGuards(JwtAuthGuard)
export class WhitelabelController {
  constructor(private readonly wl: WhitelabelService) {}

  @Get('branding')
  async getBranding(@CurrentUser() user: User) {
    const agency = await this.wl.getAgencyByUserId(user.id)
    if (!agency) return { data: null }
    const b = await this.wl.getOrCreate(agency.id)
    return { data: b }
  }

  @Put('branding')
  @HttpCode(HttpStatus.OK)
  async updateBranding(@CurrentUser() user: User, @Body() body: {
    logoUrl?: string
    faviconUrl?: string
    primaryColor?: string
    secondaryColor?: string
    fontFamily?: string
    heroTitle?: string
    heroSubtitle?: string
    aboutText?: string
    contactPhone?: string
    contactEmail?: string
    contactAddress?: string
    instagramUrl?: string
    facebookUrl?: string
    twitterUrl?: string
    linkedinUrl?: string
    youtubeUrl?: string
    customCss?: string
    seoTitle?: string
    seoDescription?: string
    show7filBadge?: boolean
    listingsPerPage?: number
  }) {
    const agency = await this.wl.getAgencyByUserId(user.id)
    if (!agency) return { error: 'Ajans hesabı bulunamadı' }
    const updated = await this.wl.update(agency.id, body)
    return { data: updated, message: 'Marka ayarları kaydedildi.' }
  }

  @Post('domain')
  @HttpCode(HttpStatus.OK)
  async setDomain(@CurrentUser() user: User, @Body() body: { domain: string }) {
    const agency = await this.wl.getAgencyByUserId(user.id)
    if (!agency) return { error: 'Ajans bulunamadı' }
    const result = await this.wl.setCustomDomain(agency.id, body.domain)
    return { data: result }
  }

  @Post('domain/verify')
  @HttpCode(HttpStatus.OK)
  async verifyDomain(@CurrentUser() user: User) {
    const agency = await this.wl.getAgencyByUserId(user.id)
    if (!agency) return { error: 'Ajans bulunamadı' }
    const result = await this.wl.verifyCustomDomain(agency.id)
    return { data: result }
  }
}

// ── Public subdomain data (used by frontend) ──────────────────────────────────

@ApiTags('whitelabel-public')
@Controller('whitelabel/public')
export class WhitelabelPublicController {
  constructor(private readonly wl: WhitelabelService) {}

  @Get(':subdomain')
  async getPublicBranding(@Param('subdomain') subdomain: string) {
    const data = await this.wl.getPublicBranding(subdomain)
    if (!data) return { data: null }
    return { data }
  }

  @Get(':subdomain/listings')
  async getListings(
    @Param('subdomain') subdomain: string,
  ) {
    const branding = await this.wl.getPublicBranding(subdomain)
    if (!branding) return { data: [], total: 0 }
    const result = await this.wl.getAgencyListings(branding.agencyId, 1, branding.listingsPerPage)
    return result
  }

  @Get(':subdomain/listings/page/:page')
  async getListingsPage(
    @Param('subdomain') subdomain: string,
    @Param('page') page: string,
  ) {
    const branding = await this.wl.getPublicBranding(subdomain)
    if (!branding) return { data: [], total: 0 }
    return this.wl.getAgencyListings(branding.agencyId, Number(page) || 1, branding.listingsPerPage)
  }
}
