import {
  Controller, Get, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AdminService } from './admin.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRole } from '../users/entities/user.entity'

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  // ── Dashboard ─────────────────────────────────────────────────────────────

  @Get('stats')
  stats() { return this.admin.getDashboardStats() }

  // ── Users ─────────────────────────────────────────────────────────────────

  @Get('users')
  listUsers(
    @Query('page') page = '1',
    @Query('limit') limit = '25',
    @Query('role') role?: string,
    @Query('q') q?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.admin.listUsers({
      page: Number(page), limit: Number(limit), role, q,
      isActive: isActive === undefined ? undefined : isActive === 'true',
    })
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.admin.getUser(id)
  }

  @Patch('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateUser(
    @Param('id') id: string,
    @Body() body: { isActive?: boolean; role?: string },
  ) {
    return this.admin.updateUser(id, body)
  }

  // ── Agencies ──────────────────────────────────────────────────────────────

  @Get('agencies')
  listAgencies(
    @Query('page') page = '1',
    @Query('limit') limit = '25',
    @Query('plan') plan?: string,
    @Query('q') q?: string,
    @Query('isVerified') isVerified?: string,
  ) {
    return this.admin.listAgencies({
      page: Number(page), limit: Number(limit), plan, q,
      isVerified: isVerified === undefined ? undefined : isVerified === 'true',
    })
  }

  @Patch('agencies/:id/verify')
  @HttpCode(HttpStatus.NO_CONTENT)
  verifyAgency(@Param('id') id: string, @Body('verified') verified: boolean) {
    return this.admin.verifyAgency(id, verified)
  }

  @Patch('agencies/:id/plan')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateAgencyPlan(@Param('id') id: string, @Body('plan') plan: string) {
    return this.admin.updateAgencyPlan(id, plan)
  }

  // ── Listings ──────────────────────────────────────────────────────────────

  @Get('listings')
  listListings(
    @Query('page') page = '1',
    @Query('limit') limit = '25',
    @Query('status') status?: string,
    @Query('q') q?: string,
    @Query('city') city?: string,
  ) {
    return this.admin.listListings({ page: Number(page), limit: Number(limit), status, q, city })
  }

  @Patch('listings/:id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateListingStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.admin.updateListingStatus(id, status)
  }

  @Delete('listings/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteListing(@Param('id') id: string) {
    return this.admin.deleteListing(id)
  }

  // ── Subscriptions ─────────────────────────────────────────────────────────

  @Get('subscriptions')
  listSubscriptions(
    @Query('page') page = '1',
    @Query('limit') limit = '25',
    @Query('status') status?: string,
  ) {
    return this.admin.listSubscriptions({ page: Number(page), limit: Number(limit), status })
  }

  @Patch('agencies/:id/subscription')
  @HttpCode(HttpStatus.NO_CONTENT)
  upsertSubscription(
    @Param('id') agencyId: string,
    @Body('plan') plan: string,
    @Body('months') months = 1,
  ) {
    return this.admin.upsertSubscription(agencyId, plan, Number(months))
  }

  // ── AI Token İstatistikleri ────────────────────────────────────────────────

  @Get('ai/stats')
  getAiStats() {
    return this.admin.getAiStats()
  }
}
