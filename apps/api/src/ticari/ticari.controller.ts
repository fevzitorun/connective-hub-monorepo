import {
  Controller, Get, Post, Delete, Body, Param, Query,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { TicariService } from './ticari.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User } from '../users/entities/user.entity'

@ApiTags('ticari')
@Controller('ticari')
export class TicariController {
  constructor(private readonly ticari: TicariService) {}

  // ── Public calculation endpoints ─────────────────────────────────────────

  @Post('yield')
  @HttpCode(HttpStatus.OK)
  async yieldCalc(@Body() body: {
    purchasePrice: number
    monthlyRent: number
    annualExpenses?: number
    vacancyRate?: number
    acquisitionCosts?: number
  }) {
    return {
      data: this.ticari.calculateYield({
        purchasePrice: Number(body.purchasePrice),
        monthlyRent: Number(body.monthlyRent),
        annualExpenses: body.annualExpenses ? Number(body.annualExpenses) : 0,
        vacancyRate: body.vacancyRate ? Number(body.vacancyRate) : 5,
        acquisitionCosts: body.acquisitionCosts ? Number(body.acquisitionCosts) : 0,
      }),
    }
  }

  @Post('caprate')
  @HttpCode(HttpStatus.OK)
  async capRate(@Body() body: {
    propertyValue: number
    monthlyRent: number
    annualOpEx: number
  }) {
    return {
      data: this.ticari.calculateCapRate({
        propertyValue: Number(body.propertyValue),
        monthlyRent: Number(body.monthlyRent),
        annualOpEx: Number(body.annualOpEx),
      }),
    }
  }

  @Post('roi')
  @HttpCode(HttpStatus.OK)
  async roi(@Body() body: {
    purchasePrice: number
    downPaymentPct: number
    monthlyRent: number
    annualExpenses: number
    annualAppreciation?: number
    holdYears?: number
    exitCostPct?: number
    loanInterestRate?: number
  }) {
    return {
      data: this.ticari.calculateRoi({
        purchasePrice: Number(body.purchasePrice),
        downPaymentPct: Number(body.downPaymentPct),
        monthlyRent: Number(body.monthlyRent),
        annualExpenses: Number(body.annualExpenses),
        annualAppreciation: body.annualAppreciation ? Number(body.annualAppreciation) : 10,
        holdYears: body.holdYears ? Number(body.holdYears) : 10,
        exitCostPct: body.exitCostPct ? Number(body.exitCostPct) : 4,
        loanInterestRate: body.loanInterestRate ? Number(body.loanInterestRate) : 0,
      }),
    }
  }

  // ── Market data ──────────────────────────────────────────────────────────

  @Get('benchmark')
  async benchmark(
    @Query('city') city: string,
    @Query('district') district?: string,
    @Query('propertyType') propertyType?: string,
    @Query('listingType') listingType?: string,
  ) {
    return {
      data: await this.ticari.getBenchmark({
        city: city ?? 'İstanbul',
        district,
        propertyType: (propertyType as 'commercial') ?? 'commercial',
        listingType: (listingType as 'sale') ?? 'sale',
      }),
    }
  }

  @Get('comparables')
  async comparables(
    @Query('city') city: string,
    @Query('propertyType') propertyType?: string,
    @Query('listingType') listingType?: string,
    @Query('minArea') minArea?: string,
    @Query('maxArea') maxArea?: string,
    @Query('district') district?: string,
    @Query('limit') limit?: string,
  ) {
    return {
      data: await this.ticari.getComparables({
        city: city ?? 'İstanbul',
        propertyType: (propertyType as 'commercial') ?? 'commercial',
        listingType: (listingType as 'sale') ?? 'sale',
        minArea: minArea ? Number(minArea) : undefined,
        maxArea: maxArea ? Number(maxArea) : undefined,
        district,
        limit: limit ? Number(limit) : 12,
      }),
    }
  }

  @Get('history')
  async snapshotHistory(
    @Query('city') city: string,
    @Query('propertyType') propertyType?: string,
    @Query('listingType') listingType?: string,
    @Query('days') days?: string,
  ) {
    return {
      data: await this.ticari.getSnapshotHistory(
        city ?? 'İstanbul',
        propertyType ?? 'commercial',
        listingType ?? 'sale',
        days ? Number(days) : 90,
      ),
    }
  }

  // ── Saved Reports (auth required) ────────────────────────────────────────

  @Get('reports')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getReports(@CurrentUser() user: User) {
    return { data: await this.ticari.getReports(user.id) }
  }

  @Post('reports')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async saveReport(@CurrentUser() user: User, @Body() body: {
    reportType: string
    title?: string
    listingId?: string
    inputData: Record<string, unknown>
    resultData: Record<string, unknown>
  }) {
    const report = await this.ticari.saveReport(user.id, body)
    return { data: report }
  }

  @Delete('reports/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReport(@Param('id') id: string, @CurrentUser() user: User) {
    await this.ticari.deleteReport(id, user.id)
  }
}
