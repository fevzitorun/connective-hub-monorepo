import {
  Controller, Get, Post, Delete, Body, Param, Query,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { PartnerService } from './partner.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User, UserRole } from '../users/entities/user.entity'

@ApiTags('partner')
@ApiBearerAuth()
@Controller('partner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PARTNER, UserRole.ADMIN)
export class PartnerController {
  constructor(private readonly partner: PartnerService) {}

  @Get('dashboard')
  dashboard(@CurrentUser() user: User) {
    return this.partner.getDashboardStats(user.id).then(data => ({ data }))
  }

  @Get('rates')
  rates() {
    return { data: this.partner.getCommissionRates() }
  }

  // ── Referrals ─────────────────────────────────────────────────────────────

  @Get('referrals')
  listReferrals(
    @CurrentUser() user: User,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('status') status?: string,
  ) {
    return this.partner.listReferrals(user.id, {
      page: Number(page), limit: Number(limit), status,
    })
  }

  @Post('referrals')
  @HttpCode(HttpStatus.CREATED)
  createReferral(
    @CurrentUser() user: User,
    @Body() body: {
      refType: 'listing_lead' | 'mortgage_lead' | 'agency_signup'
      agencyId?: string
      contactName: string
      contactEmail: string
      contactPhone?: string
      notes?: string
      estimatedValue?: number
    },
  ) {
    return this.partner.createReferral(user.id, body).then(data => ({ data }))
  }

  // ── Commissions ───────────────────────────────────────────────────────────

  @Get('commissions')
  listCommissions(
    @CurrentUser() user: User,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.partner.listCommissions(user.id, { page: Number(page), limit: Number(limit) })
  }

  // ── API Keys ──────────────────────────────────────────────────────────────

  @Get('api-keys')
  listApiKeys(@CurrentUser() user: User) {
    return this.partner.listApiKeys(user.id).then(data => ({ data }))
  }

  @Post('api-keys')
  @HttpCode(HttpStatus.CREATED)
  createApiKey(@CurrentUser() user: User, @Body('name') name: string) {
    return this.partner.createApiKey(user.id, name).then(data => ({ data }))
  }

  @Delete('api-keys/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  revokeApiKey(@CurrentUser() user: User, @Param('id') id: string) {
    return this.partner.revokeApiKey(user.id, id)
  }

  // ── Embed config ──────────────────────────────────────────────────────────

  @Get('embed')
  @HttpCode(HttpStatus.OK)
  embedConfig(
    @Query('type') type: 'search' | 'listing' | 'calculator' = 'search',
    @Query('listingId') listingId?: string,
    @Query('agencyId') agencyId?: string,
    @Query('theme') theme?: 'light' | 'dark',
    @Query('color') primaryColor?: string,
  ) {
    return { data: this.partner.getEmbedConfig({ type, listingId, agencyId, theme, primaryColor }) }
  }
}
