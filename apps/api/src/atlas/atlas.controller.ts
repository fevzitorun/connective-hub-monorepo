import {
  Controller, Post, Get, Body, Param, Query, UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AtlasService } from './atlas.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User } from '../users/entities/user.entity'

@ApiTags('atlas')
@Controller('atlas')
export class AtlasController {
  constructor(private readonly atlas: AtlasService) {}

  // ── Chat (public + authenticated) ─────────────────────────────────────────

  @Post('chat')
  async chat(
    @Body('message') message: string,
    @Body('conversationId') conversationId?: string,
    @Body('userId') anonUserId?: string,
  ) {
    if (!message?.trim()) return { error: 'Mesaj boş olamaz.' }
    return this.atlas.chat(anonUserId ?? null, conversationId ?? null, message.trim())
  }

  @Post('chat/auth')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async chatAuth(
    @Body('message') message: string,
    @Body('conversationId') conversationId: string | undefined,
    @CurrentUser() user: User,
  ) {
    if (!message?.trim()) return { error: 'Mesaj boş olamaz.' }
    return this.atlas.chat(user.id, conversationId ?? null, message.trim())
  }

  // ── Valuation ─────────────────────────────────────────────────────────────

  @Post('valuation')
  async valuation(@Body() body: {
    city: string; district: string; propertyType: string
    areaM2: number; roomCount?: string; buildingAge?: number
    floorNo?: number; hasParking?: boolean; hasElevator?: boolean
  }) {
    return this.atlas.estimateValuation(body)
  }

  // ── Neighborhood analysis ─────────────────────────────────────────────────

  @Get('neighborhood')
  async neighborhood(
    @Query('city') city: string,
    @Query('district') district: string,
  ) {
    if (!city) return { error: 'Şehir gerekli.' }
    return this.atlas.analyzeNeighborhood(city, district ?? '')
  }

  // ── History (auth required) ───────────────────────────────────────────────

  @Get('conversations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async conversations(@CurrentUser() user: User) {
    return { data: await this.atlas.getUserConversations(user.id) }
  }

  @Get('conversations/:id/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async messages(@Param('id') id: string, @CurrentUser() user: User) {
    return { data: await this.atlas.getConversationMessages(id, user.id) }
  }
}
