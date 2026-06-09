import {
  Controller, Get, Post, Delete, Body, Param, Query,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuctionService } from './auction.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User, UserRole } from '../users/entities/user.entity'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

@ApiTags('auctions')
@Controller('auctions')
export class AuctionController {
  constructor(
    private readonly auctionService: AuctionService,
    @InjectDataSource() private ds: DataSource,
  ) {}

  // ── Public ─────────────────────────────────────────────────────────────────

  @Get()
  async list(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const validStatuses = ['scheduled', 'active', 'ended', 'cancelled']
    const s = validStatuses.includes(status ?? '') ? status as 'active' : undefined
    return this.auctionService.listAuctions(s, page ? Number(page) : 1, limit ? Number(limit) : 20)
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return { data: await this.auctionService.getAuction(id) }
  }

  @Get(':id/bids')
  async getBids(@Param('id') id: string, @Query('limit') limit?: string) {
    return { data: await this.auctionService.getBids(id, limit ? Number(limit) : 20) }
  }

  // ── Authenticated ──────────────────────────────────────────────────────────

  @Post(':id/bid')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async bid(
    @Param('id') id: string,
    @Body('amount') amount: number,
    @CurrentUser() user: User,
  ) {
    return this.auctionService.placeBid(id, user.id, Number(amount))
  }

  // ── Agency ─────────────────────────────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@CurrentUser() user: User, @Body() body: {
    listingId: string; title: string; description?: string
    startPrice: number; reservePrice?: number; minIncrement?: number
    buyNowPrice?: number; startsAt: string; endsAt: string
  }) {
    const agencyId = await this.getAgencyId(user.id)
    if (!agencyId) return { error: 'Ajans bulunamadı' }
    return { data: await this.auctionService.createAuction(agencyId, body) }
  }

  @Get('my/list')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async myAuctions(@CurrentUser() user: User) {
    const agencyId = await this.getAgencyId(user.id)
    if (!agencyId) return { data: [] }
    return { data: await this.auctionService.getAgencyAuctions(agencyId) }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancel(@Param('id') id: string, @CurrentUser() user: User) {
    const agencyId = await this.getAgencyId(user.id)
    if (!agencyId) return
    await this.auctionService.cancelAuction(id, agencyId)
  }

  private async getAgencyId(userId: string): Promise<string | null> {
    const rows = await this.ds.query(
      `SELECT id FROM agencies WHERE user_id = $1 LIMIT 1`, [userId],
    )
    return (rows[0] as { id: string } | undefined)?.id ?? null
  }
}
