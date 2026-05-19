import {
  Controller, Get, Post, Delete, Param, Body, Query,
  UseGuards, HttpCode, HttpStatus, Version,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { FavoritesService } from './favorites.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User } from '../users/entities/user.entity'

@ApiTags('Favorites')
@Controller('favorites')
@Version('1')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  // GET /api/v1/favorites  — Favori ilanlarım
  @Get()
  @ApiOperation({ summary: 'Favori ilanlarımı listele' })
  findAll(@CurrentUser() user: User) {
    return this.favoritesService.findByUser(user.id)
  }

  // POST /api/v1/favorites/:listingId  — Favoriye ekle
  @Post(':listingId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'İlanı favorilere ekle' })
  add(@Param('listingId') listingId: string, @CurrentUser() user: User) {
    return this.favoritesService.add(user.id, listingId)
  }

  // DELETE /api/v1/favorites/:listingId  — Favoriden çıkar
  @Delete(':listingId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'İlanı favorilerden çıkar' })
  remove(@Param('listingId') listingId: string, @CurrentUser() user: User) {
    return this.favoritesService.remove(user.id, listingId)
  }

  // GET /api/v1/favorites/check?ids=uuid1,uuid2  — Toplu favori kontrolü
  @Get('check')
  @ApiOperation({ summary: 'Belirli ilanların favori durumunu kontrol et' })
  check(@Query('ids') ids: string, @CurrentUser() user: User) {
    const listingIds = ids?.split(',').filter(Boolean) ?? []
    return this.favoritesService.checkBatch(user.id, listingIds)
  }
}
