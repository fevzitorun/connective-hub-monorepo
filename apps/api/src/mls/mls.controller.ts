/**
 * MlsController — Modül B: REST Endpoint'leri
 *
 * Tüm route'lar JWT ile korumalıdır.
 * Yetki seviyeleri:
 *   - agency / agent_person → MLS havuzunu görüntüler, ilana katılır, kendi ilanlarını açar
 *   - admin                 → Komisyon onaylama / itiraz çözme (ileride)
 *
 * Prefix: /api/v1/mls
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │  Endpoint                                      │ Kimin için                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │  POST   /listings                              │ Yetkili emlakçı           │
 * │  GET    /listings/pool                         │ Tüm emlakçılar            │
 * │  GET    /listings/mine                         │ Yetkili emlakçı           │
 * │  DELETE /listings/:mlsListingId                │ Yetkili emlakçı (iptal)   │
 * │  POST   /listings/:mlsListingId/join           │ İşbirlikçi emlakçı        │
 * │  POST   /listings/:mlsListingId/close          │ Yetkili emlakçı           │
 * │  GET    /collaborations/mine                   │ İşbirlikçi emlakçı        │
 * │  PATCH  /collaborations/:id/review             │ Yetkili emlakçı           │
 * │  PATCH  /collaborations/:id/withdraw           │ İşbirlikçi emlakçı        │
 * │  GET    /collaborations/:id/splits             │ Yetkili veya işbirlikçi   │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger'
import { JwtAuthGuard }    from '../auth/guards/jwt-auth.guard'
import { CurrentUser }     from '../auth/decorators/current-user.decorator'
import { MlsService }      from './mls.service'
import { CreateMlsListingDto }    from './dto/create-mls-listing.dto'
import { JoinMlsListingDto }      from './dto/join-mls-listing.dto'
import { ReviewCollaborationDto } from './dto/review-collaboration.dto'
import { CloseMlsDealDto }        from './dto/close-mls-deal.dto'
import { MlsPoolFiltersDto }      from './dto/mls-pool-filters.dto'

// ─── Tip yardımcısı ───────────────────────────────────────────────────────────
interface JwtUser { id: string; role: string }

@ApiTags('MLS — Emlakçılar Arası Portföy Paylaşımı')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'mls', version: '1' })
export class MlsController {
  constructor(private readonly mlsService: MlsService) {}

  // ──────────────────────────────────────────────────────────────────────────
  // İlan Yönetimi (Yetkili Emlakçı)
  // ──────────────────────────────────────────────────────────────────────────

  @Post('listings')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'İlanı MLS havuzuna aç',
    description:
      'Yetkili emlakçı kendi aktif ilanını komisyon paylaşımına açar. ' +
      'Yüzde payları toplamı 100 olmalıdır.',
  })
  @ApiCreatedResponse({ description: 'MLS kaydı oluşturuldu.' })
  openListing(
    @Body() dto: CreateMlsListingDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.mlsService.openListing(dto, user.id)
  }

  @Get('listings/pool')
  @ApiOperation({
    summary: 'MLS havuzunu listele (Partner Portal — "Havuzdaki Portföyler")',
    description:
      'Tüm açık MLS ilanlarını filtreli döndürür. ' +
      'İsteyen kullanıcının katılım durumu (my_collaboration_status) da eklenir.',
  })
  @ApiOkResponse({ description: 'Sayfalı MLS ilan listesi.' })
  listPool(
    @Query() filters: MlsPoolFiltersDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.mlsService.listPool(filters, user.id)
  }

  @Get('listings/mine')
  @ApiOperation({
    summary: 'Kendi açtığım MLS ilanları',
    description: 'Yetkili emlakçının paylaşıma açtığı tüm ilanları döndürür.',
  })
  listMyMlsListings(
    @Query('page')    page:    number = 1,
    @Query('perPage') perPage: number = 20,
    @CurrentUser() user: JwtUser,
  ) {
    return this.mlsService.listMyMlsListings(user.id, +page, +perPage)
  }

  @Delete('listings/:mlsListingId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'MLS ilanını iptal et' })
  @ApiParam({ name: 'mlsListingId', type: 'string', format: 'uuid' })
  @ApiNoContentResponse({ description: 'İptal edildi.' })
  cancelMlsListing(
    @Param('mlsListingId', ParseUUIDPipe) mlsListingId: string,
    @CurrentUser() user: JwtUser,
  ) {
    return this.mlsService.cancelMlsListing(mlsListingId, user.id)
  }

  // ──────────────────────────────────────────────────────────────────────────
  // İşbirliği İşlemleri
  // ──────────────────────────────────────────────────────────────────────────

  @Post('listings/:mlsListingId/join')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'MLS ilanına işbirlikçi olarak katıl',
    description:
      'Başvuru PENDING durumunda açılır. ' +
      'Yetkili emlakçı onaylayana kadar ilan portföyde görünmez.',
  })
  @ApiParam({ name: 'mlsListingId', type: 'string', format: 'uuid' })
  @ApiCreatedResponse({ description: 'Başvuru alındı.' })
  joinListing(
    @Param('mlsListingId', ParseUUIDPipe) mlsListingId: string,
    @Body() dto: JoinMlsListingDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.mlsService.joinListing(mlsListingId, dto, user.id)
  }

  @Post('listings/:mlsListingId/close')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'MLS işlemini kapat & komisyonu hesapla',
    description:
      'Yetkili emlakçı satışı/kiralamayı tamamlar. ' +
      'Komisyon split kayıtları otomatik oluşturulur, ilan "sold/rented" olur.',
  })
  @ApiParam({ name: 'mlsListingId', type: 'string', format: 'uuid' })
  @ApiOkResponse({ description: 'İşlem kapatıldı, komisyon hesaplandı.' })
  closeDeal(
    @Param('mlsListingId', ParseUUIDPipe) mlsListingId: string,
    @Body() dto: CloseMlsDealDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.mlsService.closeDeal(mlsListingId, dto, user.id)
  }

  // ──────────────────────────────────────────────────────────────────────────
  // İşbirliği Yönetimi
  // ──────────────────────────────────────────────────────────────────────────

  @Get('collaborations/mine')
  @ApiOperation({
    summary: 'Benim işbirliği başvurularım',
    description:
      'İşbirlikçi emlakçının tüm başvurularını, ilan bilgisi ve ' +
      'tahmini komisyon tutarıyla döndürür.',
  })
  listMyCollaborations(
    @Query('page')    page:    number = 1,
    @Query('perPage') perPage: number = 20,
    @CurrentUser() user: JwtUser,
  ) {
    return this.mlsService.listMyCollaborations(user.id, +page, +perPage)
  }

  @Patch('collaborations/:collaborationId/review')
  @ApiOperation({
    summary: 'Başvuruyu onayla / reddet',
    description: 'Yalnızca yetkili emlakçı kullanabilir.',
  })
  @ApiParam({ name: 'collaborationId', type: 'string', format: 'uuid' })
  reviewCollaboration(
    @Param('collaborationId', ParseUUIDPipe) collaborationId: string,
    @Body() dto: ReviewCollaborationDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.mlsService.reviewCollaboration(collaborationId, dto, user.id)
  }

  @Patch('collaborations/:collaborationId/withdraw')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'İşbirliğinden çekil',
    description: 'Yalnızca başvuruyu yapan emlakçı kullanabilir.',
  })
  @ApiParam({ name: 'collaborationId', type: 'string', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Başvurudan çekilindi.' })
  withdrawCollaboration(
    @Param('collaborationId', ParseUUIDPipe) collaborationId: string,
    @CurrentUser() user: JwtUser,
  ) {
    return this.mlsService.withdrawCollaboration(collaborationId, user.id)
  }

  @Get('collaborations/:collaborationId/splits')
  @ApiOperation({
    summary: 'Komisyon dağılım detayı',
    description:
      'Tamamlanmış bir işbirliği için yetkili ve işbirlikçi komisyon tutarlarını döndürür. ' +
      'Yalnızca ilgili taraflar erişebilir.',
  })
  @ApiParam({ name: 'collaborationId', type: 'string', format: 'uuid' })
  getCommissionSplits(
    @Param('collaborationId', ParseUUIDPipe) collaborationId: string,
    @CurrentUser() user: JwtUser,
  ) {
    return this.mlsService.getCommissionSplits(collaborationId, user.id)
  }
}
