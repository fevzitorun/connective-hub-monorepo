import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { LegalService } from './legal.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User, UserRole } from '../users/entities/user.entity'
import {
  CreateCaseDto, AssignLawyerDto, SubmitReviewDto,
  AddDocumentDto, RevokeCertificateDto,
} from './dto/legal.dto'

@ApiTags('legal')
@ApiBearerAuth()
@Controller('legal')
@UseGuards(JwtAuthGuard)
export class LegalController {
  constructor(private readonly legal: LegalService) {}

  // ── Case creation (any authenticated user) ───────────────────────────────

  @Post('cases')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Hukuki inceleme talebi oluştur' })
  async createCase(@CurrentUser() user: User, @Body() dto: CreateCaseDto) {
    const c = await this.legal.createCase(user.id, dto)
    return { success: true, data: c }
  }

  @Get('cases/mine')
  @ApiOperation({ summary: 'Kendi taleplerim' })
  async myCases(@CurrentUser() user: User) {
    const cases = await this.legal.getMyCases(user.id)
    return { success: true, data: cases }
  }

  @Delete('cases/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Talebi iptal et' })
  async cancelCase(@Param('id') id: string, @CurrentUser() user: User) {
    await this.legal.cancelCase(id, user.id)
  }

  @Post('cases/:id/documents')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Davaya belge ekle' })
  async addDocument(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: AddDocumentDto,
  ) {
    const doc = await this.legal.addDocument(id, user.id, dto)
    return { success: true, data: doc }
  }

  // ── Lawyer routes ────────────────────────────────────────────────────────

  @Get('lawyer/cases')
  @UseGuards(RolesGuard)
  @Roles(UserRole.LAWYER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Avukatlık listesi (avukat + admin)' })
  async lawyerCases(@CurrentUser() user: User) {
    const cases = await this.legal.getCasesForLawyer(user.id)
    return { success: true, data: cases }
  }

  @Get('lawyer/stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.LAWYER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Avukat istatistikleri' })
  async lawyerStats(@CurrentUser() user: User) {
    const stats = await this.legal.getLawyerStats(user.id)
    return { success: true, data: stats }
  }

  @Get('lawyer/cases/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.LAWYER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Dava detayı (avukat)' })
  async caseDetail(@Param('id') id: string, @CurrentUser() user: User) {
    const c = await this.legal.getCaseDetail(id, user.id, user.role as UserRole)
    return { success: true, data: c }
  }

  @Patch('lawyer/cases/:id/review')
  @UseGuards(RolesGuard)
  @Roles(UserRole.LAWYER)
  @ApiOperation({ summary: 'İnceleme sonucu gir' })
  async submitReview(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: SubmitReviewDto,
  ) {
    const c = await this.legal.submitReview(id, user.id, dto)
    return { success: true, data: c }
  }

  @Post('lawyer/cases/:id/certificate')
  @UseGuards(RolesGuard)
  @Roles(UserRole.LAWYER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Mülk sertifikası düzenle' })
  async issueCertificate(@Param('id') id: string, @CurrentUser() user: User) {
    const cert = await this.legal.issueCertificate(id, user.id)
    return { success: true, data: cert }
  }

  // ── Admin routes ─────────────────────────────────────────────────────────

  @Get('admin/pending')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atanmamış davalar (admin)' })
  async pendingCases() {
    const cases = await this.legal.getPendingCases()
    return { success: true, data: cases }
  }

  @Patch('admin/cases/:id/assign')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Avukat ata (admin)' })
  async assignLawyer(@Param('id') id: string, @Body() dto: AssignLawyerDto) {
    const c = await this.legal.assignLawyer(id, dto)
    return { success: true, data: c }
  }

  @Patch('admin/certificates/:id/revoke')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Sertifika iptal (admin)' })
  async revokeCertificate(@Param('id') id: string, @Body() dto: RevokeCertificateDto) {
    await this.legal.revokeCertificate(id, dto)
    return { success: true }
  }
}

// ── Public certificate verification (no auth required) ───────────────────────

@ApiTags('legal')
@Controller('legal/verify')
export class CertificateVerifyController {
  constructor(private readonly legal: LegalService) {}

  @Get(':hash')
  @ApiOperation({ summary: 'Sertifika doğrula (public)' })
  async verify(@Param('hash') hash: string) {
    return this.legal.verifyCertificate(hash)
  }

  @Get('listing/:listingId')
  @ApiOperation({ summary: 'İlana ait sertifika bilgisi' })
  async listingCert(@Param('listingId') listingId: string) {
    const cert = await this.legal.getListingCertificate(listingId)
    return { success: true, data: cert ?? null }
  }
}
