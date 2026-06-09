import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import Anthropic from '@anthropic-ai/sdk'

const MODEL = 'claude-sonnet-4-6'
const MAX_TOOL_ROUNDS = 4

export interface ValuationInput {
  listingId?: string
  city: string
  district?: string
  neighborhood?: string
  propertyType: string
  listingType: string
  roomCount?: string
  areaM2?: number
  floorNo?: number
  buildingAge?: number
  hasParking?: boolean
  hasElevator?: boolean
  price?: number
}

export interface ValuationOutput {
  estimatedMin: number
  estimatedMax: number
  pricePerM2: number
  confidence: 'high' | 'medium' | 'low'
  reasoning: string
  comparablesUsed: number
  tokensUsed: number
}

// Tool definitions registered with Claude
const TOOLS: Anthropic.Tool[] = [
  {
    name: 'search_comparable_listings',
    description: 'Benzer özellikteki yakın ilanların fiyatlarını getirir. Ekspertiz hesaplamasında kullanılır.',
    input_schema: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'Şehir adı' },
        district: { type: 'string', description: 'İlçe (opsiyonel)' },
        propertyType: { type: 'string', enum: ['residential', 'commercial', 'land', 'industrial'] },
        listingType: { type: 'string', enum: ['sale', 'rent'] },
        roomCount: { type: 'string', description: 'Oda sayısı (opsiyonel, örn: 3+1)' },
        areaMin: { type: 'number', description: 'Minimum alan m²' },
        areaMax: { type: 'number', description: 'Maksimum alan m²' },
        limit: { type: 'number', description: 'Kaç ilan dönsün (max 20)', default: 10 },
      },
      required: ['city', 'propertyType', 'listingType'],
    },
  },
  {
    name: 'get_area_price_stats',
    description: 'Belirli bir bölgedeki ortalama fiyat/m² istatistiklerini getirir.',
    input_schema: {
      type: 'object',
      properties: {
        city: { type: 'string' },
        district: { type: 'string', description: 'İlçe (opsiyonel)' },
        propertyType: { type: 'string', enum: ['residential', 'commercial', 'land', 'industrial'] },
        listingType: { type: 'string', enum: ['sale', 'rent'] },
      },
      required: ['city', 'propertyType', 'listingType'],
    },
  },
]

@Injectable()
export class ValuationAgent {
  private client: Anthropic

  constructor(
    private config: ConfigService,
    @InjectDataSource() private dataSource: DataSource,
  ) {
    this.client = new Anthropic({
      apiKey: this.config.get<string>('ANTHROPIC_API_KEY'),
    })
  }

  async valuate(input: ValuationInput): Promise<ValuationOutput> {
    const messages: Anthropic.MessageParam[] = [
      { role: 'user', content: this.buildPrompt(input) },
    ]

    let tokensUsed = 0
    let comparablesUsed = 0

    // Agentic loop — model can call tools multiple times
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const response = await this.client.messages.create({
        model: MODEL,
        max_tokens: 2048,
        tools: TOOLS,
        messages,
      })

      tokensUsed += response.usage.output_tokens

      if (response.stop_reason === 'end_turn') {
        const textBlock = response.content.find((b) => b.type === 'text')
        const text = textBlock?.type === 'text' ? textBlock.text : ''
        return {
          ...this.parseValuationResult(text),
          comparablesUsed,
          tokensUsed,
        }
      }

      if (response.stop_reason !== 'tool_use') break

      // Process tool calls
      messages.push({ role: 'assistant', content: response.content })

      const toolResults: Anthropic.ToolResultBlockParam[] = []
      for (const block of response.content) {
        if (block.type !== 'tool_use') continue

        const result = await this.executeTool(block.name, block.input as Record<string, unknown>)
        if (block.name === 'search_comparable_listings') {
          comparablesUsed += (result as { count?: number }).count ?? 0
        }
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: JSON.stringify(result),
        })
      }

      messages.push({ role: 'user', content: toolResults })
    }

    return {
      estimatedMin: 0,
      estimatedMax: 0,
      pricePerM2: 0,
      confidence: 'low',
      reasoning: 'Ekspertiz hesaplanamadı.',
      comparablesUsed,
      tokensUsed,
    }
  }

  private async executeTool(name: string, input: Record<string, unknown>): Promise<unknown> {
    if (name === 'search_comparable_listings') {
      return this.searchComparables(input)
    }
    if (name === 'get_area_price_stats') {
      return this.getAreaStats(input)
    }
    return { error: 'Unknown tool' }
  }

  private async searchComparables(input: Record<string, unknown>) {
    const limit = Math.min(Number(input.limit ?? 10), 20)
    const areaMin = input.areaMin ? Number(input.areaMin) : null
    const areaMax = input.areaMax ? Number(input.areaMax) : null

    const qb = this.dataSource
      .createQueryBuilder()
      .select([
        'l.id', 'l.price', 'l.area_m2', 'l.room_count', 'l.district',
        'l.neighborhood', 'l.building_age', 'l.floor_no',
      ])
      .from('listings', 'l')
      .where('l.status = :status', { status: 'active' })
      .andWhere('l.city = :city', { city: input.city })
      .andWhere('l.property_type = :pt', { pt: input.propertyType })
      .andWhere('l.listing_type = :lt', { lt: input.listingType })
      .andWhere('l.price IS NOT NULL')
      .orderBy('l.created_at', 'DESC')
      .limit(limit)

    if (input.district) {
      qb.andWhere('l.district = :district', { district: input.district })
    }
    if (input.roomCount) {
      qb.andWhere('l.room_count = :rc', { rc: input.roomCount })
    }
    if (areaMin) qb.andWhere('l.area_m2 >= :areaMin', { areaMin })
    if (areaMax) qb.andWhere('l.area_m2 <= :areaMax', { areaMax })

    const rows = await qb.getRawMany()
    return {
      count: rows.length,
      listings: rows.map((r) => ({
        price: Number(r.l_price),
        areaM2: Number(r.l_area_m2),
        pricePerM2: r.l_area_m2 ? Math.round(Number(r.l_price) / Number(r.l_area_m2)) : null,
        roomCount: r.l_room_count,
        district: r.l_district,
        buildingAge: r.l_building_age,
      })),
    }
  }

  private async getAreaStats(input: Record<string, unknown>) {
    const qb = this.dataSource
      .createQueryBuilder()
      .select([
        'COUNT(*) as count',
        'AVG(l.price / NULLIF(l.area_m2, 0)) as avg_price_per_m2',
        'MIN(l.price / NULLIF(l.area_m2, 0)) as min_price_per_m2',
        'MAX(l.price / NULLIF(l.area_m2, 0)) as max_price_per_m2',
        'PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY l.price / NULLIF(l.area_m2, 0)) as median_price_per_m2',
      ])
      .from('listings', 'l')
      .where('l.status = :status', { status: 'active' })
      .andWhere('l.city = :city', { city: input.city })
      .andWhere('l.property_type = :pt', { pt: input.propertyType })
      .andWhere('l.listing_type = :lt', { lt: input.listingType })
      .andWhere('l.price IS NOT NULL')
      .andWhere('l.area_m2 IS NOT NULL')
      .andWhere('l.area_m2 > 0')

    if (input.district) {
      qb.andWhere('l.district = :district', { district: input.district })
    }

    const [row] = await qb.getRawMany()
    return {
      count: Number(row?.count ?? 0),
      avgPricePerM2: Math.round(Number(row?.avg_price_per_m2 ?? 0)),
      minPricePerM2: Math.round(Number(row?.min_price_per_m2 ?? 0)),
      maxPricePerM2: Math.round(Number(row?.max_price_per_m2 ?? 0)),
      medianPricePerM2: Math.round(Number(row?.median_price_per_m2 ?? 0)),
    }
  }

  private buildPrompt(input: ValuationInput): string {
    return `Türk gayrimenkul ekspertizi yapıyorsun. Aşağıdaki mülkün piyasa değerini tahmin et.

MÜLK BİLGİLERİ:
- Tür: ${input.listingType === 'sale' ? 'Satılık' : 'Kiralık'} ${input.propertyType}
- Konum: ${input.district ? `${input.district}, ` : ''}${input.city}${input.neighborhood ? ` (${input.neighborhood})` : ''}
${input.roomCount ? `- Oda: ${input.roomCount}` : ''}
${input.areaM2 ? `- Alan: ${input.areaM2} m²` : ''}
${input.buildingAge != null ? `- Bina yaşı: ${input.buildingAge}` : ''}
${input.floorNo != null ? `- Kat: ${input.floorNo}` : ''}
${input.hasParking ? '- Otopark: Var' : ''}
${input.hasElevator ? '- Asansör: Var' : ''}
${input.price ? `- Mevcut ilan fiyatı: ${input.price.toLocaleString('tr-TR')} TL` : ''}

YAPMAN GEREKENLER:
1. Önce search_comparable_listings aracını kullanarak benzer ilanları bul
2. get_area_price_stats ile bölge istatistiklerini öğren
3. Verilere dayanarak gerçekçi bir ekspertiz yap

YANIT FORMATI (araç çağrılarından sonra):
EKSPERTIZ_MIN: [sayı]
EKSPERTIZ_MAX: [sayı]
FIYAT_PER_M2: [sayı]
GUVEN: [high/medium/low]
ACIKLAMA: [2-3 cümle Türkçe gerekçe]`
  }

  private parseValuationResult(text: string): Omit<ValuationOutput, 'comparablesUsed' | 'tokensUsed'> {
    const getNum = (key: string) => {
      const match = text.match(new RegExp(`${key}:\\s*([\\d.]+)`))
      return match ? Math.round(Number(match[1])) : 0
    }
    const confidenceMatch = text.match(/GUVEN:\s*(high|medium|low)/i)
    const reasoningMatch = text.match(/ACIKLAMA:\s*(.+?)(?:\n|$)/s)

    return {
      estimatedMin: getNum('EKSPERTIZ_MIN'),
      estimatedMax: getNum('EKSPERTIZ_MAX'),
      pricePerM2: getNum('FIYAT_PER_M2'),
      confidence: (confidenceMatch?.[1]?.toLowerCase() as 'high' | 'medium' | 'low') ?? 'low',
      reasoning: reasoningMatch?.[1]?.trim() ?? '',
    }
  }
}
