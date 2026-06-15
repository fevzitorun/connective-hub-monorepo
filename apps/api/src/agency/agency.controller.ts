import {
  Controller, Get, Patch, Post, Body, Query,
  UseGuards, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { AgencyService } from './agency.service'
import { UpdateAgencyDto } from './dto/update-agency.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User, UserRole } from '../users/entities/user.entity'
import { AgencyPlan } from '../users/entities/agency.entity'

class SubscribeDto {
  @IsEnum(AgencyPlan) plan: AgencyPlan
}

@ApiTags('Agency')
@Controller('agency')

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.AGENCY, UserRole.AGENT_PERSON, UserRole.ADMIN)
@ApiBearerAuth()
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  // GET /api/v1/agency/me
  @Get('me')
  @ApiOperation({ summary: 'Ajans profilimi getir' })
  getProfile(@CurrentUser() user: User) {
    return this.agencyService.getProfile(user.id)
  }

  // PATCH /api/v1/agency/me
  @Patch('me')
  @ApiOperation({ summary: 'Ajans profilini güncelle' })
  updateProfile(@Body() dto: UpdateAgencyDto, @CurrentUser() user: User) {
    return this.agencyService.updateProfile(user.id, dto)
  }

  // GET /api/v1/agency/stats
  @Get('stats')
  @ApiOperation({ summary: 'Dashboard istatistikleri' })
  getStats(@CurrentUser() user: User) {
    return this.agencyService.getStats(user.id)
  }

  // GET /api/v1/agency/listings?page=1&perPage=20
  @Get('listings')
  @ApiOperation({ summary: 'Ajansa ait ilanlar' })
  getListings(
    @CurrentUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(20), ParseIntPipe) perPage: number,
  ) {
    return this.agencyService.getMyListings(user.id, page, perPage)
  }

  // GET /api/v1/agency/plans
  @Get('plans')
  @ApiOperation({ summary: 'Plan fiyatlandırması' })
  getPlans() {
    return this.agencyService.getPlanPricing()
  }

  // POST /api/v1/agency/subscribe
  @Post('subscribe')
  @ApiOperation({ summary: 'Abonelik başlat / plan değiştir' })
  subscribe(@Body() dto: SubscribeDto, @CurrentUser() user: User) {
    return this.agencyService.subscribe(user.id, dto.plan)
  }
}
