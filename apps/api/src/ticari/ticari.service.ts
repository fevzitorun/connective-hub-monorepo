import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InjectDataSource } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { TicariReport } from './entities/ticari-report.entity'
import { TicariSnapshot } from './entities/ticari-snapshot.entity'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface YieldInput {
  purchasePrice: number
  monthlyRent: number
  annualExpenses?: number   // aidat + vergi + sigorta + bakım
  vacancyRate?: number      // % boşluk oranı (0–30)
  acquisitionCosts?: number // tapu, noter, vergi (~%4–5)
}

export interface CapRateInput {
  propertyValue: number
  monthlyRent: number
  annualOpEx: number        // toplam işletme gideri / yıl
}

export interface RoiInput {
  purchasePrice: number
  downPaymentPct: number    // %
  monthlyRent: number
  annualExpenses: number
  annualAppreciation?: number   // % yıllık değer artışı varsayımı
  holdYears?: number            // kaç yıl tutacak
  exitCostPct?: number          // satış maliyeti % (vergi + komisyon)
  loanInterestRate?: number     // kredi faiz % (yıllık)
}

// ─── Service ─────────────────────────────────────────────────────────────────

@Injectable()
export class TicariService {
  constructor(
    @InjectRepository(TicariReport) private reports: Repository<TicariReport>,
    @InjectRepository(TicariSnapshot) private snapshots: Repository<TicariSnapshot>,
    @InjectDataSource() private ds: DataSource,
  ) {}

  // ── Rental Yield ─────────────────────────────────────────────────────────

  calculateYield(input: YieldInput) {
    const {
      purchasePrice,
      monthlyRent,
      annualExpenses = 0,
      vacancyRate = 5,
      acquisitionCosts = 0,
    } = input

    const annualRent = monthlyRent * 12
    const effectiveRent = annualRent * (1 - vacancyRate / 100)
    const totalInvestment = purchasePrice + acquisitionCosts

    const grossYield = (annualRent / purchasePrice) * 100
    const netYield = ((effectiveRent - annualExpenses) / totalInvestment) * 100
    const netAnnualIncome = effectiveRent - annualExpenses
    const monthsToBreakeven = totalInvestment / (netAnnualIncome / 12)

    // Turkish real estate benchmark: healthy commercial yield = 5–8%
    const yieldRating =
      netYield >= 8 ? 'excellent'
      : netYield >= 6 ? 'good'
      : netYield >= 4 ? 'average'
      : 'below_average'

    return {
      grossYield: Math.round(grossYield * 100) / 100,
      netYield: Math.round(netYield * 100) / 100,
      annualRent: Math.round(annualRent),
      effectiveRent: Math.round(effectiveRent),
      netAnnualIncome: Math.round(netAnnualIncome),
      monthlyNetIncome: Math.round(netAnnualIncome / 12),
      monthsToBreakeven: Math.round(monthsToBreakeven),
      yearsToBreakeven: Math.round(monthsToBreakeven / 12 * 10) / 10,
      yieldRating,
      priceToRentRatio: Math.round(purchasePrice / annualRent * 10) / 10,
    }
  }

  // ── Cap Rate ─────────────────────────────────────────────────────────────

  calculateCapRate(input: CapRateInput) {
    const { propertyValue, monthlyRent, annualOpEx } = input

    const goi = monthlyRent * 12
    const noi = goi - annualOpEx
    const capRate = (noi / propertyValue) * 100

    // GRM = Price / Annual Rent
    const grm = propertyValue / goi

    // Value from cap rate (e.g. market cap rate 6%)
    const marketCapRate = 6.0
    const impliedValueAtMarket = (noi / marketCapRate) * 100

    return {
      grossOperatingIncome: Math.round(goi),
      netOperatingIncome: Math.round(noi),
      capRate: Math.round(capRate * 100) / 100,
      grm: Math.round(grm * 10) / 10,
      impliedValueAtMarket: Math.round(impliedValueAtMarket),
      valueDelta: Math.round(impliedValueAtMarket - propertyValue),
      rating:
        capRate >= 8 ? 'excellent'
        : capRate >= 6 ? 'good'
        : capRate >= 4 ? 'average'
        : 'below_average',
    }
  }

  // ── Full ROI / IRR ────────────────────────────────────────────────────────

  calculateRoi(input: RoiInput) {
    const {
      purchasePrice,
      downPaymentPct,
      monthlyRent,
      annualExpenses,
      annualAppreciation = 10,
      holdYears = 10,
      exitCostPct = 4,
      loanInterestRate = 0,
    } = input

    const downPayment = purchasePrice * (downPaymentPct / 100)
    const loanAmount = purchasePrice - downPayment
    const acquisitionCost = purchasePrice * 0.045  // tapu harcı ~%4.5

    let monthlyMortgage = 0
    if (loanAmount > 0 && loanInterestRate > 0) {
      const r = loanInterestRate / 100 / 12
      const n = holdYears * 12
      const factor = Math.pow(1 + r, n)
      monthlyMortgage = (loanAmount * r * factor) / (factor - 1)
    } else if (loanAmount > 0 && loanInterestRate === 0) {
      monthlyMortgage = loanAmount / (holdYears * 12)
    }

    const monthlyNetBeforeMortgage = monthlyRent - annualExpenses / 12
    const monthlyNetAfterMortgage = monthlyNetBeforeMortgage - monthlyMortgage
    const annualNetCashflow = monthlyNetAfterMortgage * 12

    // Cash-on-cash return
    const totalEquityInvested = downPayment + acquisitionCost
    const cocReturn = (annualNetCashflow / totalEquityInvested) * 100

    // Exit value after holdYears with appreciation
    const exitValue = purchasePrice * Math.pow(1 + annualAppreciation / 100, holdYears)
    const exitCost = exitValue * (exitCostPct / 100)
    const capitalGain = exitValue - exitCost - purchasePrice

    // Simplified IRR via Newton-Raphson (10 iterations)
    const cashflows = [-totalEquityInvested]
    for (let y = 1; y < holdYears; y++) {
      cashflows.push(annualNetCashflow)
    }
    // Final year: cashflow + exit equity (exit value - remaining loan - cost)
    const remainingLoan = loanAmount > 0
      ? this.remainingLoanBalance(loanAmount, loanInterestRate / 100 / 12, holdYears * 12, holdYears * 12)
      : 0
    cashflows.push(annualNetCashflow + exitValue - exitCost - remainingLoan)

    const irr = this.estimateIRR(cashflows)

    // Total return
    const totalReturn = ((annualNetCashflow * holdYears + capitalGain) / totalEquityInvested) * 100

    return {
      downPayment: Math.round(downPayment),
      acquisitionCost: Math.round(acquisitionCost),
      totalEquityInvested: Math.round(totalEquityInvested),
      monthlyNetCashflow: Math.round(monthlyNetAfterMortgage),
      annualNetCashflow: Math.round(annualNetCashflow),
      cocReturn: Math.round(cocReturn * 100) / 100,
      exitValue: Math.round(exitValue),
      capitalGain: Math.round(capitalGain),
      irr: irr !== null ? Math.round(irr * 10000) / 100 : null,  // as %
      totalReturn: Math.round(totalReturn * 10) / 10,
      holdYears,
      monthlyMortgage: Math.round(monthlyMortgage),
      yearlyProjection: this.buildProjection(
        purchasePrice, annualNetCashflow, annualAppreciation, holdYears, capitalGain,
      ),
    }
  }

  private remainingLoanBalance(principal: number, monthlyRate: number, totalMonths: number, paidMonths: number): number {
    if (monthlyRate === 0) return principal * (1 - paidMonths / totalMonths)
    const factor = Math.pow(1 + monthlyRate, totalMonths)
    const paidFactor = Math.pow(1 + monthlyRate, paidMonths)
    const payment = (principal * monthlyRate * factor) / (factor - 1)
    return payment * (factor - paidFactor) / (monthlyRate * factor)
  }

  private estimateIRR(cashflows: number[], guess = 0.1): number | null {
    const MAX_ITER = 50
    const PRECISION = 1e-6
    let rate = guess

    for (let i = 0; i < MAX_ITER; i++) {
      let npv = 0
      let dnpv = 0
      for (let t = 0; t < cashflows.length; t++) {
        const cf = cashflows[t] ?? 0
        const denom = Math.pow(1 + rate, t)
        npv += cf / denom
        dnpv -= (t * cf) / Math.pow(1 + rate, t + 1)
      }
      if (Math.abs(dnpv) < 1e-10) return null
      const newRate = rate - npv / dnpv
      if (Math.abs(newRate - rate) < PRECISION) return newRate
      rate = newRate
    }
    return null
  }

  private buildProjection(
    purchasePrice: number,
    annualCashflow: number,
    appreciationPct: number,
    years: number,
    totalCapitalGain: number,
  ) {
    return Array.from({ length: Math.min(years, 10) }, (_, i) => {
      const yr = i + 1
      const propertyValue = purchasePrice * Math.pow(1 + appreciationPct / 100, yr)
      const cumulativeCashflow = annualCashflow * yr
      const unrealizedGain = propertyValue - purchasePrice
      return {
        year: yr,
        propertyValue: Math.round(propertyValue),
        cumulativeCashflow: Math.round(cumulativeCashflow),
        unrealizedGain: Math.round(unrealizedGain),
        totalWealth: Math.round(cumulativeCashflow + unrealizedGain),
      }
    })
  }

  // ── Live Market Benchmark ─────────────────────────────────────────────────

  async getBenchmark(params: {
    city: string
    district?: string
    propertyType: 'commercial' | 'residential' | 'land' | 'industrial'
    listingType: 'sale' | 'rent'
  }) {
    const { city, district, propertyType, listingType } = params

    // Query live listings for real-time stats
    const conditions: string[] = [
      `l.status = 'active'`,
      `l.property_type = $1`,
      `l.listing_type = $2`,
      `l.city ILIKE $3`,
      `l.price IS NOT NULL`,
      `l.area_m2 IS NOT NULL`,
      `l.area_m2 > 0`,
    ]
    const values: unknown[] = [propertyType, listingType, city]

    if (district) {
      conditions.push(`l.district ILIKE $${values.length + 1}`)
      values.push(district)
    }

    const where = conditions.join(' AND ')

    const raw = await this.ds.query(`
      SELECT
        COUNT(*)::int                                        AS listing_count,
        ROUND(AVG(l.price / l.area_m2)::numeric, 0)         AS avg_price_m2,
        ROUND(MIN(l.price / l.area_m2)::numeric, 0)         AS min_price_m2,
        ROUND(MAX(l.price / l.area_m2)::numeric, 0)         AS max_price_m2,
        ROUND(AVG(l.price)::numeric, 0)                     AS avg_price,
        ROUND(AVG(l.area_m2)::numeric, 1)                   AS avg_area_m2,
        ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY l.price / l.area_m2)::numeric, 0)
                                                            AS median_price_m2
      FROM listings l
      WHERE ${where}
    `, values)

    const row = raw[0] as {
      listing_count: number
      avg_price_m2: string | null
      min_price_m2: string | null
      max_price_m2: string | null
      avg_price: string | null
      avg_area_m2: string | null
      median_price_m2: string | null
    }

    // Also get district breakdown if no district specified
    const districtBreakdown = district ? [] : await this.getDistrictBreakdown(city, propertyType, listingType)

    // Price range histogram (5 buckets)
    const histogram = await this.getPriceHistogram(city, district, propertyType, listingType)

    return {
      city,
      district: district ?? null,
      propertyType,
      listingType,
      listingCount: row?.listing_count ?? 0,
      avgPriceM2: row?.avg_price_m2 ? Math.round(Number(row.avg_price_m2)) : null,
      medianPriceM2: row?.median_price_m2 ? Math.round(Number(row.median_price_m2)) : null,
      minPriceM2: row?.min_price_m2 ? Math.round(Number(row.min_price_m2)) : null,
      maxPriceM2: row?.max_price_m2 ? Math.round(Number(row.max_price_m2)) : null,
      avgPrice: row?.avg_price ? Math.round(Number(row.avg_price)) : null,
      avgAreaM2: row?.avg_area_m2 ? Number(row.avg_area_m2) : null,
      districtBreakdown,
      histogram,
      dataAsOf: new Date().toISOString(),
    }
  }

  private async getDistrictBreakdown(city: string, propertyType: string, listingType: string) {
    const rows = await this.ds.query(`
      SELECT
        l.district,
        COUNT(*)::int AS count,
        ROUND(AVG(l.price / l.area_m2)::numeric, 0) AS avg_price_m2
      FROM listings l
      WHERE l.status = 'active'
        AND l.property_type = $1
        AND l.listing_type = $2
        AND l.city ILIKE $3
        AND l.price IS NOT NULL
        AND l.area_m2 > 0
        AND l.district IS NOT NULL
      GROUP BY l.district
      ORDER BY count DESC
      LIMIT 10
    `, [propertyType, listingType, city])

    return rows.map((r: { district: string; count: number; avg_price_m2: string }) => ({
      district: r.district,
      count: r.count,
      avgPriceM2: r.avg_price_m2 ? Math.round(Number(r.avg_price_m2)) : null,
    }))
  }

  private async getPriceHistogram(
    city: string, district: string | undefined,
    propertyType: string, listingType: string,
  ) {
    const districtClause = district ? `AND l.district ILIKE '${district.replace(/'/g, "''")}'` : ''
    const rows = await this.ds.query(`
      WITH bounds AS (
        SELECT
          MIN(l.price / l.area_m2) AS min_val,
          MAX(l.price / l.area_m2) AS max_val
        FROM listings l
        WHERE l.status = 'active'
          AND l.property_type = $1
          AND l.listing_type = $2
          AND l.city ILIKE $3
          AND l.price IS NOT NULL AND l.area_m2 > 0
          ${districtClause}
      ),
      bucketed AS (
        SELECT
          WIDTH_BUCKET(l.price / l.area_m2, b.min_val, b.max_val + 1, 5) AS bucket,
          COUNT(*)::int AS cnt,
          ROUND(MIN(l.price / l.area_m2)::numeric, 0) AS bucket_min,
          ROUND(MAX(l.price / l.area_m2)::numeric, 0) AS bucket_max
        FROM listings l, bounds b
        WHERE l.status = 'active'
          AND l.property_type = $1
          AND l.listing_type = $2
          AND l.city ILIKE $3
          AND l.price IS NOT NULL AND l.area_m2 > 0
          ${districtClause}
        GROUP BY bucket
        ORDER BY bucket
      )
      SELECT * FROM bucketed
    `, [propertyType, listingType, city])

    return rows.map((r: { bucket: number; cnt: number; bucket_min: string; bucket_max: string }) => ({
      bucket: r.bucket,
      count: r.cnt,
      min: Number(r.bucket_min),
      max: Number(r.bucket_max),
    }))
  }

  // ── Comparables ───────────────────────────────────────────────────────────

  async getComparables(params: {
    city: string
    propertyType: 'commercial' | 'industrial' | 'land'
    listingType: 'sale' | 'rent'
    minArea?: number
    maxArea?: number
    district?: string
    limit?: number
  }) {
    const { city, propertyType, listingType, minArea, maxArea, district, limit = 12 } = params

    const conditions = [
      `l.status = 'active'`,
      `l.property_type = $1`,
      `l.listing_type = $2`,
      `l.city ILIKE $3`,
    ]
    const values: unknown[] = [propertyType, listingType, city]

    if (district) { conditions.push(`l.district ILIKE $${values.length + 1}`); values.push(district) }
    if (minArea)  { conditions.push(`l.area_m2 >= $${values.length + 1}`); values.push(minArea) }
    if (maxArea)  { conditions.push(`l.area_m2 <= $${values.length + 1}`); values.push(maxArea) }

    const rows = await this.ds.query(`
      SELECT
        l.id, l.title, l.price, l.currency, l.area_m2, l.district, l.neighborhood,
        l.floor_no, l.building_age,
        ROUND((l.price / NULLIF(l.area_m2, 0))::numeric, 0) AS price_per_m2,
        (SELECT lp.url FROM listing_photos lp WHERE lp.listing_id = l.id AND lp.is_cover = true LIMIT 1) AS cover_url,
        l.published_at
      FROM listings l
      WHERE ${conditions.join(' AND ')}
      ORDER BY l.published_at DESC NULLS LAST
      LIMIT $${values.length + 1}
    `, [...values, limit])

    return rows.map((r: {
      id: string; title: string; price: string; currency: string;
      area_m2: string; district: string; neighborhood: string;
      floor_no: number; building_age: number;
      price_per_m2: string; cover_url: string; published_at: string
    }) => ({
      id: r.id,
      title: r.title,
      price: r.price ? Number(r.price) : null,
      currency: r.currency,
      areaM2: r.area_m2 ? Number(r.area_m2) : null,
      district: r.district,
      neighborhood: r.neighborhood,
      pricePerM2: r.price_per_m2 ? Math.round(Number(r.price_per_m2)) : null,
      coverUrl: r.cover_url ?? null,
      publishedAt: r.published_at,
    }))
  }

  // ── Saved Reports ─────────────────────────────────────────────────────────

  async saveReport(userId: string, data: {
    reportType: string
    title?: string
    listingId?: string
    inputData: Record<string, unknown>
    resultData: Record<string, unknown>
  }) {
    const report = this.reports.create({
      userId,
      reportType: data.reportType,
      title: data.title ?? null,
      listingId: data.listingId ?? null,
      inputData: data.inputData,
      resultData: data.resultData,
    })
    return this.reports.save(report)
  }

  async getReports(userId: string) {
    return this.reports.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    })
  }

  async deleteReport(id: string, userId: string) {
    await this.reports.delete({ id, userId })
  }

  // ── Snapshot (cron job would call this daily) ─────────────────────────────

  async takeMarketSnapshot(city: string, propertyType: string, listingType: string) {
    const today = new Date().toISOString().slice(0, 10)
    const rows = await this.ds.query(`
      SELECT
        ROUND(AVG(l.price / l.area_m2)::numeric, 0)  AS avg_price_m2,
        ROUND(MIN(l.price / l.area_m2)::numeric, 0)  AS min_price_m2,
        ROUND(MAX(l.price / l.area_m2)::numeric, 0)  AS max_price_m2,
        ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY l.price / l.area_m2)::numeric, 0) AS median_price,
        COUNT(*)::int AS listing_count
      FROM listings l
      WHERE l.status = 'active'
        AND l.property_type = $1
        AND l.listing_type = $2
        AND l.city ILIKE $3
        AND l.price IS NOT NULL
        AND l.area_m2 > 0
    `, [propertyType, listingType, city])

    const r = rows[0] as {
      avg_price_m2: string; min_price_m2: string; max_price_m2: string;
      median_price: string; listing_count: number
    }
    if (!r || !r.listing_count) return

    await this.ds.query(`
      INSERT INTO ticari_market_snapshots
        (city, property_type, listing_type, avg_price_m2, median_price, min_price_m2, max_price_m2, listing_count, sample_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (city, COALESCE(district, ''), property_type, listing_type, sample_date) DO UPDATE SET
        avg_price_m2  = EXCLUDED.avg_price_m2,
        median_price  = EXCLUDED.median_price,
        min_price_m2  = EXCLUDED.min_price_m2,
        max_price_m2  = EXCLUDED.max_price_m2,
        listing_count = EXCLUDED.listing_count
    `, [city, propertyType, listingType,
        r.avg_price_m2, r.median_price, r.min_price_m2, r.max_price_m2,
        r.listing_count, today])
  }

  async getSnapshotHistory(city: string, propertyType: string, listingType: string, days = 90) {
    return this.ds.query(`
      SELECT sample_date, avg_price_m2, median_price, listing_count
      FROM ticari_market_snapshots
      WHERE city ILIKE $1
        AND property_type = $2
        AND listing_type = $3
        AND sample_date >= NOW() - INTERVAL '${Number(days)} days'
      ORDER BY sample_date ASC
    `, [city, propertyType, listingType])
  }
}
