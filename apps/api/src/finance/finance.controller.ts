import {
  Controller, Post, Get, Patch, Body, Param, Query,
  UseGuards, HttpCode, HttpStatus, Req, Res,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { FinanceService } from './finance.service'
import { IyzicoService } from './iyzico.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User, UserRole } from '../users/entities/user.entity'

// ─── Public Finance Controller ────────────────────────────────────────────────

@ApiTags('finance')
@Controller('finance')
export class FinanceController {
  constructor(
    private readonly finance: FinanceService,
    private readonly iyzico: IyzicoService,
  ) {}

  // Mortgage calculator — public, no auth needed
  @Post('mortgage/calculate')
  @HttpCode(HttpStatus.OK)
  async calculateMortgage(@Body() body: {
    propertyPrice: number
    downPayment: number
    loanTermYears: number
    annualInterestRate: number
    isFirstHome?: boolean
    propertyType?: 'residential' | 'commercial' | 'land'
    loanType?: 'conventional' | 'islamic'
  }) {
    return {
      data: this.finance.calculateMortgage({
        propertyPrice: Number(body.propertyPrice),
        downPayment: Number(body.downPayment),
        loanTermYears: Number(body.loanTermYears),
        annualInterestRate: Number(body.annualInterestRate),
        isFirstHome: body.isFirstHome !== false,
        propertyType: body.propertyType ?? 'residential',
        loanType: body.loanType ?? 'conventional',
      }),
    }
  }

  // Save mortgage lead (optional auth)
  @Post('mortgage/lead')
  @HttpCode(HttpStatus.CREATED)
  async saveMortgageLead(@Body() body: {
    listingId?: string
    loanType: 'conventional' | 'islamic'
    propertyPrice: number
    downPayment: number
    loanAmount: number
    loanTermYears: number
    interestRate: number
    monthlyPayment: number
    ltvRatio: number
    contactName: string
    contactPhone: string
    contactEmail: string
    city?: string
    propertyType?: string
    isFirstHome?: boolean
  }, @CurrentUser() user?: User) {
    const lead = await this.finance.saveMortgageLead({
      ...body,
      userId: user?.id,
      isFirstHome: body.isFirstHome !== false,
    })
    return { data: { id: lead.id }, message: 'Başvurunuz alındı. Banka temsilcisi sizinle iletişime geçecek.' }
  }

  // DASK quote — public
  @Post('insurance/dask')
  @HttpCode(HttpStatus.OK)
  async daskQuote(@Body() body: {
    areaM2: number
    city: string
    constructionType?: 'betonarme' | 'yigma' | 'hafif_celik' | 'wood'
    buildingAge: number
    floorCount?: number
    listingId?: string
    contactEmail?: string
  }, @CurrentUser() user?: User) {
    const result = this.finance.calculateDASK({
      areaM2: Number(body.areaM2),
      city: body.city,
      constructionType: body.constructionType ?? 'betonarme',
      buildingAge: Number(body.buildingAge),
    })

    // Save quote if contact email provided
    if (body.contactEmail || user?.id) {
      await this.finance.saveInsuranceQuote({
        listingId: body.listingId,
        userId: user?.id,
        insuranceType: 'dask',
        areaM2: body.areaM2,
        city: body.city,
        constructionType: body.constructionType ?? 'betonarme',
        buildingAge: body.buildingAge,
        floorCount: body.floorCount,
        daskPremium: result.annualPremium,
        daskCoverage: result.coverageAmount,
        contactEmail: body.contactEmail,
      })
    }

    return { data: result }
  }

  // Konut sigortası quote — public
  @Post('insurance/konut')
  @HttpCode(HttpStatus.OK)
  async konutQuote(@Body() body: {
    areaM2: number
    city: string
    buildingAge: number
    coverageType?: 'basic' | 'comprehensive'
    listingId?: string
    contactEmail?: string
  }, @CurrentUser() user?: User) {
    const result = this.finance.calculateKonutSigortasi({
      areaM2: Number(body.areaM2),
      city: body.city,
      buildingAge: Number(body.buildingAge),
      coverageType: body.coverageType ?? 'basic',
    })

    if (body.contactEmail || user?.id) {
      await this.finance.saveInsuranceQuote({
        listingId: body.listingId,
        userId: user?.id,
        insuranceType: 'konut',
        areaM2: body.areaM2,
        city: body.city,
        buildingAge: body.buildingAge,
        constructionType: 'betonarme',
        konutPremium: result.annualPremium,
        contactEmail: body.contactEmail,
      })
    }

    return { data: result }
  }

  // Combined DASK + Konut quote
  @Post('insurance/combined')
  @HttpCode(HttpStatus.OK)
  async combinedQuote(@Body() body: {
    areaM2: number
    city: string
    constructionType?: 'betonarme' | 'yigma' | 'hafif_celik' | 'wood'
    buildingAge: number
    floorCount?: number
    listingId?: string
  }) {
    const dask = this.finance.calculateDASK({
      areaM2: Number(body.areaM2),
      city: body.city,
      constructionType: body.constructionType ?? 'betonarme',
      buildingAge: Number(body.buildingAge),
    })
    const konutBasic = this.finance.calculateKonutSigortasi({
      areaM2: Number(body.areaM2),
      city: body.city,
      buildingAge: Number(body.buildingAge),
      coverageType: 'basic',
    })
    const konutComprehensive = this.finance.calculateKonutSigortasi({
      areaM2: Number(body.areaM2),
      city: body.city,
      buildingAge: Number(body.buildingAge),
      coverageType: 'comprehensive',
    })
    return { data: { dask, konutBasic, konutComprehensive } }
  }

  // ── İyzico Payment ────────────────────────────────────────────────────────

  @Post('payment/init')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async initPayment(
    @Body() body: { plan: string; months?: number },
    @CurrentUser() user: User,
    @Req() req: FastifyRequest,
  ) {
    const agency = await this.finance.getAgencyByUserId(user.id)
    const userIp = req.headers['x-forwarded-for']?.toString().split(',')[0].trim()
      ?? req.socket?.remoteAddress
      ?? '1.1.1.1'

    const result = await this.iyzico.initializeCheckout({
      agencyId: agency.id,
      userId: user.id,
      userEmail: user.email,
      userName: user.fullName ?? user.email,
      plan: body.plan,
      months: body.months ?? 1,
      userIp,
    })
    return { data: result }
  }

  @Post('payment/callback')
  async paymentCallback(
    @Body('token') token: string,
    @Query('token') tokenQuery: string,
    @Res() reply: FastifyReply,
  ) {
    const t = token ?? tokenQuery
    const redirectUrl = await this.iyzico.handleCallback(t ?? '')
    return reply.redirect(302, redirectUrl)
  }

  @Get('payment/status/:orderId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async paymentStatus(@Param('orderId') orderId: string, @CurrentUser() user: User) {
    const agency = await this.finance.getAgencyByUserId(user.id)
    const status = await this.iyzico.getOrderStatus(orderId, agency.id)
    if (!status) return { data: null }
    return { data: status }
  }
}

// ─── Bank Panel Controller ────────────────────────────────────────────────────

@ApiTags('finance-bank')
@ApiBearerAuth()
@Controller('finance/bank')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.BANK, UserRole.ADMIN)
export class BankController {
  constructor(private readonly finance: FinanceService) {}

  @Get('stats')
  async stats(@CurrentUser() user: User) {
    return { data: await this.finance.getBankLeadStats(user.id) }
  }

  @Get('leads')
  async getLeads(
    @CurrentUser() user: User,
    @Query('city') city?: string,
    @Query('minLoan') minLoan?: string,
    @Query('maxLoan') maxLoan?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.finance.getBankLeads(user.id, {
      city,
      minLoan: minLoan ? Number(minLoan) : undefined,
      maxLoan: maxLoan ? Number(maxLoan) : undefined,
      status,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    })
  }

  @Post('leads/:id/claim')
  @HttpCode(HttpStatus.OK)
  async claimLead(@Param('id') id: string, @CurrentUser() user: User) {
    const lead = await this.finance.claimLead(id, user.id)
    return { data: lead, message: 'Lead talep edildi. İletişim bilgileri açıldı.' }
  }

  @Patch('leads/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
    @CurrentUser() user: User,
  ) {
    const lead = await this.finance.updateLeadStatus(id, user.id, body.status)
    return { data: lead }
  }
}
