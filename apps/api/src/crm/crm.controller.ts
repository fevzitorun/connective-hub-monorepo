import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger'
import { CrmService } from './crm.service'
import { CreateLeadDto } from './dto/create-lead.dto'
import { UpdateLeadDto } from './dto/update-lead.dto'
import { AddActivityDto } from './dto/add-activity.dto'
import { LeadFiltersDto } from './dto/lead-filters.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'

interface JwtPayload {
  sub: string
  agencyId?: string
  email: string
}

@ApiTags('CRM')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  // ─────────────────────────────────────────────────────────────────────────
  // LEADS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * POST /crm/leads
   * Yeni lead oluştur.
   */
  @Post('leads')
  @ApiOperation({ summary: 'Yeni lead oluştur' })
  @ApiResponse({ status: 201, description: 'Lead oluşturuldu' })
  async createLead(
    @Body() dto: CreateLeadDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.crmService.createLead(dto, user.agencyId!, user.sub)
  }

  /**
   * GET /crm/leads
   * Lead listesi (filtreli, sayfalı).
   */
  @Get('leads')
  @ApiOperation({ summary: 'Lead listesi — filtreli & sayfalı' })
  async listLeads(
    @Query() filters: LeadFiltersDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.crmService.listLeads(filters, user.agencyId!)
  }

  /**
   * GET /crm/leads/kanban
   * Kanban board verisi — status'a göre gruplu.
   */
  @Get('leads/kanban')
  @ApiOperation({ summary: 'Kanban board — status kolonları' })
  async kanban(@CurrentUser() user: JwtPayload) {
    return this.crmService.kanbanBoard(user.agencyId!)
  }

  /**
   * GET /crm/leads/overdue
   * Vadesi geçmiş takip hatırlatmaları.
   */
  @Get('leads/overdue')
  @ApiOperation({ summary: 'Vadesi geçmiş follow-up listesi' })
  async overdue(@CurrentUser() user: JwtPayload) {
    return this.crmService.getOverdueFollowUps(user.agencyId!)
  }

  /**
   * GET /crm/dashboard
   * CRM özet istatistikleri.
   */
  @Get('dashboard')
  @ApiOperation({ summary: 'CRM dashboard istatistikleri' })
  async dashboard(@CurrentUser() user: JwtPayload) {
    return this.crmService.dashboardStats(user.agencyId!)
  }

  /**
   * GET /crm/leads/:id
   * Tek lead detayı (aktivitelerle birlikte).
   */
  @Get('leads/:id')
  @ApiOperation({ summary: 'Lead detayı + aktivite geçmişi' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async getLead(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.crmService.getLead(id, user.agencyId!)
  }

  /**
   * PATCH /crm/leads/:id
   * Lead güncelle (status, priority, notlar, vb.).
   */
  @Patch('leads/:id')
  @ApiOperation({ summary: 'Lead güncelle' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async updateLead(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLeadDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.crmService.updateLead(id, dto, user.agencyId!, user.sub)
  }

  /**
   * DELETE /crm/leads/:id
   * Soft delete.
   */
  @Delete('leads/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lead sil (soft delete)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async deleteLead(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.crmService.deleteLead(id, user.agencyId!)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ACTIVITIES
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * POST /crm/leads/:id/activities
   * Lead'e aktivite ekle (arama, WhatsApp, gezme, not vb.).
   */
  @Post('leads/:id/activities')
  @ApiOperation({ summary: 'Lead aktivitesi ekle' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 201, description: 'Aktivite kaydedildi' })
  async addActivity(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddActivityDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.crmService.addActivity(id, dto, user.agencyId!, user.sub)
  }
}
