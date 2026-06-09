import {
  Controller, Get, Query, Res, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AnalyticsService } from './analytics.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User, UserRole } from '../users/entities/user.entity'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(
    private readonly analytics: AnalyticsService,
    @InjectDataSource() private ds: DataSource,
  ) {}

  // ── Agency endpoints ─────────────────────────────────────────────────────

  @Get('agency')
  async agencyStats(@CurrentUser() user: User) {
    const agencyId = await this.getAgencyId(user.id)
    if (!agencyId) return { data: null, error: 'Ajans bulunamadı' }
    return { data: await this.analytics.getAgencyStats(agencyId) }
  }

  @Get('agency/listings')
  async listingPerformance(
    @CurrentUser() user: User,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
  ) {
    const agencyId = await this.getAgencyId(user.id)
    if (!agencyId) return { data: [], total: 0 }
    return this.analytics.getListingPerformance(
      agencyId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
      sort ?? 'views',
    )
  }

  @Get('agency/export')
  async exportCsv(@CurrentUser() user: User, @Res() res: FastifyReply) {
    const agencyId = await this.getAgencyId(user.id)
    if (!agencyId) {
      res.code(400).send({ error: 'Ajans bulunamadı' })
      return
    }
    const csv = await this.analytics.exportListingsCsv(agencyId)
    const filename = `ilanlar-${new Date().toISOString().slice(0, 10)}.csv`
    res.raw.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.raw.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.raw.setHeader('BOM', '﻿')
    res.raw.end('﻿' + csv)
  }

  // ── Admin endpoints ──────────────────────────────────────────────────────

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async adminStats() {
    return { data: await this.analytics.getAdminStats() }
  }

  // ── Helper ───────────────────────────────────────────────────────────────

  private async getAgencyId(userId: string): Promise<string | null> {
    // Admin sees own agency if they have one, otherwise needs to pass agencyId via query
    const rows = await this.ds.query(
      `SELECT id FROM agencies WHERE user_id = $1 LIMIT 1`, [userId],
    )
    return (rows[0] as { id: string } | undefined)?.id ?? null
  }
}
