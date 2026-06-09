import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import Anthropic from '@anthropic-ai/sdk'

// Sonnet for market analysis — balance of intelligence and cost
const MODEL = 'claude-sonnet-4-6'

export interface MarketTrendInput {
  city: string
  district?: string
  propertyType: string
  listingType: string
}

export interface MarketTrendOutput {
  trend: 'rising' | 'stable' | 'falling'
  trendPercent: number
  avgPricePerM2: number
  activeListings: number
  avgDaysOnMarket: number
  demandSupplyRatio: number
  summary: string
  recommendation: string
  tokensUsed: number
}

@Injectable()
export class MarketTrendAgent {
  private client: Anthropic

  constructor(
    private config: ConfigService,
    @InjectDataSource() private dataSource: DataSource,
  ) {
    this.client = new Anthropic({
      apiKey: this.config.get<string>('ANTHROPIC_API_KEY'),
    })
  }

  async analyze(input: MarketTrendInput): Promise<MarketTrendOutput> {
    const [currentStats, historicalStats] = await Promise.all([
      this.getCurrentStats(input),
      this.getHistoricalStats(input),
    ])

    const prompt = `Türk gayrimenkul piyasası analisti olarak aşağıdaki verilere dayanarak bir piyasa trend raporu hazırla.

BÖLGE: ${input.district ? `${input.district}, ` : ''}${input.city}
TÜR: ${input.listingType === 'sale' ? 'Satılık' : 'Kiralık'} ${input.propertyType}

MEVCUT VERİLER (son 30 gün):
- Aktif ilan sayısı: ${currentStats.activeCount}
- Ortalama fiyat/m²: ${currentStats.avgPricePerM2} TL
- Ortalama ilan süresi: ${currentStats.avgDaysOnMarket} gün
- Favori sayısı toplamı: ${currentStats.totalFavorites}

GEÇMİŞ VERİLER (önceki 30 gün):
- Aktif ilan sayısı: ${historicalStats.activeCount}
- Ortalama fiyat/m²: ${historicalStats.avgPricePerM2} TL

GÖREV: Piyasa trendini analiz et.

YANIT FORMATI:
TREND: [rising/stable/falling]
TREND_YUZDE: [+/- yüzde değişim, örn: +5.2]
TALEP_ARZ: [0.1-5.0 arası oran, 1=dengeli, >1 talep fazla]
ÖZET: [2 cümle Türkçe piyasa özeti]
ÖNERİ: [Alıcıya/yatırımcıya 1 cümle öneri]`

    const message = await this.client.messages.create({
      model: MODEL,
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    return {
      ...this.parseOutput(text, currentStats),
      tokensUsed: message.usage.output_tokens,
    }
  }

  private async getCurrentStats(input: MarketTrendInput) {
    const rows = await this.dataSource.query(
      `SELECT
        COUNT(*) as active_count,
        AVG(price / NULLIF(area_m2, 0)) as avg_price_per_m2,
        AVG(EXTRACT(EPOCH FROM (NOW() - published_at)) / 86400) as avg_days_on_market,
        SUM(favorite_count) as total_favorites
       FROM listings
       WHERE status = 'active'
         AND city = $1
         AND property_type = $2
         AND listing_type = $3
         AND published_at > NOW() - INTERVAL '30 days'
         ${input.district ? 'AND district = $4' : ''}`,
      input.district
        ? [input.city, input.propertyType, input.listingType, input.district]
        : [input.city, input.propertyType, input.listingType],
    )

    const r = rows[0] ?? {}
    return {
      activeCount: Number(r.active_count ?? 0),
      avgPricePerM2: Math.round(Number(r.avg_price_per_m2 ?? 0)),
      avgDaysOnMarket: Math.round(Number(r.avg_days_on_market ?? 0)),
      totalFavorites: Number(r.total_favorites ?? 0),
    }
  }

  private async getHistoricalStats(input: MarketTrendInput) {
    const rows = await this.dataSource.query(
      `SELECT
        COUNT(*) as active_count,
        AVG(price / NULLIF(area_m2, 0)) as avg_price_per_m2
       FROM listings
       WHERE status IN ('active', 'sold', 'rented')
         AND city = $1
         AND property_type = $2
         AND listing_type = $3
         AND published_at BETWEEN NOW() - INTERVAL '60 days' AND NOW() - INTERVAL '30 days'
         ${input.district ? 'AND district = $4' : ''}`,
      input.district
        ? [input.city, input.propertyType, input.listingType, input.district]
        : [input.city, input.propertyType, input.listingType],
    )

    const r = rows[0] ?? {}
    return {
      activeCount: Number(r.active_count ?? 0),
      avgPricePerM2: Math.round(Number(r.avg_price_per_m2 ?? 0)),
    }
  }

  private parseOutput(
    text: string,
    stats: { activeCount: number; avgPricePerM2: number; avgDaysOnMarket: number },
  ): Omit<MarketTrendOutput, 'tokensUsed'> {
    const trendMatch = text.match(/TREND:\s*(rising|stable|falling)/i)
    const pctMatch = text.match(/TREND_YUZDE:\s*([+-]?\d+\.?\d*)/)
    const ratioMatch = text.match(/TALEP_ARZ:\s*(\d+\.?\d*)/)
    const summaryMatch = text.match(/ÖZET:\s*(.+?)(?=\nÖNERİ:|$)/s)
    const recMatch = text.match(/ÖNERİ:\s*(.+?)(?:\n|$)/s)

    return {
      trend: (trendMatch?.[1]?.toLowerCase() as 'rising' | 'stable' | 'falling') ?? 'stable',
      trendPercent: Number(pctMatch?.[1] ?? 0),
      avgPricePerM2: stats.avgPricePerM2,
      activeListings: stats.activeCount,
      avgDaysOnMarket: stats.avgDaysOnMarket,
      demandSupplyRatio: Number(ratioMatch?.[1] ?? 1),
      summary: summaryMatch?.[1]?.trim() ?? '',
      recommendation: recMatch?.[1]?.trim() ?? '',
    }
  }
}
