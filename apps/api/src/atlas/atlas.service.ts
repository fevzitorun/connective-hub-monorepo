import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `Sen Atlas'sın — 7fil platformunun entegre gayrimenkul asistanı.
Türkiye emlak piyasası konusunda uzman bir yapay zekasın.

Uzmanlık alanların:
- Tapu ve tapu sicili işlemleri, ipotek ve şerh bilgisi
- Kat mülkiyeti, arsa payı, hisseli tapu
- DASK ve konut sigortası
- Konut kredisi (BDDK LTV limitleri: birinci konut %80, ikinci konut %60, ticari %50)
- İslami finans / murabaha
- Güncel piyasa değerleme (m² fiyat analizi)
- Kira artış hakkı (TÜFE + %25 kira sınırı)
- Kentsel dönüşüm ve riskli yapı tespiti
- Yabancılara mülk satışı (2634 sayılı Kanun)
- Gayrimenkul yatırım ortaklıkları (GYO)
- İmar durumu ve yapı ruhsatı
- Eğitim: Türkiye'deki şehirlerin emlak karakteristiği

Yanıt verirken:
- Kısa ve öz ol (maksimum 4-5 paragraf)
- Somut sayısal veriler kullan (m², TL, oran)
- Hukuki tavsiye değil, bilgilendirme yap
- Belirsizliklerde "Bu konuda bir uzmanla görüşmanızı öneririm" de
- Türkçe yanıt ver

7fil hakkında: Türkiye'nin entegre gayrimenkul ekosistemi. Ajans ilanları, hukuki analiz,
mortgage hesaplama, ticari değerleme, açık artırma ve white-label portföy yönetimi sunar.`

@Injectable()
export class AtlasService {
  private readonly logger = new Logger(AtlasService.name)
  private anthropic: Anthropic | null = null
  private readonly model = 'claude-sonnet-4-6'

  constructor(
    private readonly config: ConfigService,
    @InjectDataSource() private ds: DataSource,
  ) {
    const apiKey = this.config.get<string>('ANTHROPIC_API_KEY')
    if (!apiKey) {
      this.logger.warn('ANTHROPIC_API_KEY tanımlı değil — Atlas AI özellikleri devre dışı.')
      return
    }
    this.anthropic = new Anthropic({ apiKey })
  }

  private get client(): Anthropic {
    if (!this.anthropic) throw new ServiceUnavailableException('Atlas yapılandırılmamış.')
    return this.anthropic
  }

  // ── Chat ──────────────────────────────────────────────────────────────────

  async chat(userId: string | null, conversationId: string | null, userMessage: string) {
    let convId = conversationId

    // Load or create conversation
    if (convId) {
      const existing = await this.ds.query(
        `SELECT id FROM atlas_conversations WHERE id = $1`, [convId],
      )
      if (!existing[0]) convId = null
    }

    if (!convId) {
      const rows = await this.ds.query(`
        INSERT INTO atlas_conversations (user_id, title)
        VALUES ($1, $2) RETURNING id
      `, [userId, userMessage.slice(0, 80)])
      convId = (rows[0] as { id: string }).id
    }

    // Load prior messages (last 20 for context window budget)
    const priorRows = await this.ds.query(`
      SELECT role, content FROM atlas_messages
      WHERE conversation_id = $1
      ORDER BY created_at ASC
      LIMIT 20
    `, [convId])

    const history = (priorRows as { role: string; content: string }[]).map((r) => ({
      role: r.role as 'user' | 'assistant',
      content: r.content,
    }))

    // Save user message
    await this.ds.query(`
      INSERT INTO atlas_messages (conversation_id, role, content)
      VALUES ($1, 'user', $2)
    `, [convId, userMessage])

    // Call Anthropic
    const messages = [...history, { role: 'user' as const, content: userMessage }]

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    })

    const content = response.content[0]
    const assistantText = content?.type === 'text' ? content.text : ''
    const tokensUsed = response.usage.input_tokens + response.usage.output_tokens

    // Save assistant response
    await this.ds.query(`
      INSERT INTO atlas_messages (conversation_id, role, content, tokens_used, model)
      VALUES ($1, 'assistant', $2, $3, $4)
    `, [convId, assistantText, tokensUsed, this.model])

    // Update conversation updated_at
    await this.ds.query(
      `UPDATE atlas_conversations SET updated_at = NOW() WHERE id = $1`, [convId],
    )

    return {
      conversationId: convId,
      message: assistantText,
      tokensUsed,
    }
  }

  // ── Property Valuation ────────────────────────────────────────────────────

  async estimateValuation(params: {
    city: string
    district: string
    propertyType: string
    areaM2: number
    roomCount?: string
    buildingAge?: number
    floorNo?: number
    hasParking?: boolean
    hasElevator?: boolean
  }) {
    // Get market data from DB
    const marketRows = await this.ds.query(`
      SELECT
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price / NULLIF(area_m2, 0)) AS median_m2_price,
        AVG(price / NULLIF(area_m2, 0)) AS avg_m2_price,
        MIN(price / NULLIF(area_m2, 0)) AS min_m2_price,
        MAX(price / NULLIF(area_m2, 0)) AS max_m2_price,
        COUNT(*)::int AS sample_count
      FROM listings
      WHERE city ILIKE $1
        AND district ILIKE $2
        AND property_type = $3
        AND listing_type = 'sale'
        AND status = 'active'
        AND area_m2 IS NOT NULL AND area_m2 > 0
        AND price IS NOT NULL AND price > 0
    `, [params.city, params.district || '%', params.propertyType])

    const market = marketRows[0] as {
      median_m2_price: string | null
      avg_m2_price: string | null
      sample_count: number
    }

    const medianM2 = Number(market.median_m2_price ?? 0)
    const prompt = `
Gayrimenkul değerleme isteği:
- Şehir: ${params.city}, İlçe: ${params.district}
- Tip: ${params.propertyType}, ${params.areaM2} m²
- Oda: ${params.roomCount ?? 'belirtilmedi'}
- Bina yaşı: ${params.buildingAge ?? 'bilinmiyor'} yıl
- Kat: ${params.floorNo ?? 'belirtilmedi'}
- Otopark: ${params.hasParking ? 'var' : 'yok'}, Asansör: ${params.hasElevator ? 'var' : 'yok'}

Platform veritabanından ${market.sample_count} aktif ilan: ortalama m² fiyatı ${Number(market.avg_m2_price ?? 0).toLocaleString('tr-TR')} ₺, medyan ${medianM2.toLocaleString('tr-TR')} ₺.

Bu mülk için piyasa değer aralığını hesapla. JSON formatında yanıt ver:
{"minValue": sayı, "maxValue": sayı, "midValue": sayı, "pricePerM2": sayı, "confidence": "low|medium|high", "reasoning": "kısa açıklama"}
`

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 512,
      system: 'Sen bir Türkiye gayrimenkul değerleme uzmanısın. Sadece JSON yanıt ver.',
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0]?.type === 'text' ? response.content[0].text : '{}'
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      const parsed = JSON.parse(jsonMatch?.[0] ?? '{}') as {
        minValue?: number; maxValue?: number; midValue?: number
        pricePerM2?: number; confidence?: string; reasoning?: string
      }
      return {
        ...parsed,
        marketData: {
          sampleCount: market.sample_count,
          medianM2Price: medianM2,
          avgM2Price: Number(market.avg_m2_price ?? 0),
        },
      }
    } catch {
      return {
        midValue: medianM2 * params.areaM2,
        pricePerM2: medianM2,
        confidence: 'low',
        reasoning: 'Yeterli piyasa verisi bulunamadı.',
        marketData: { sampleCount: market.sample_count, medianM2Price: medianM2, avgM2Price: 0 },
      }
    }
  }

  // ── Neighborhood Analysis ─────────────────────────────────────────────────

  async analyzeNeighborhood(city: string, district: string) {
    const stats = await this.ds.query(`
      SELECT
        COUNT(*)::int AS listing_count,
        AVG(NULLIF(price, 0))::bigint AS avg_price,
        AVG(NULLIF(area_m2, 0))::int AS avg_area,
        AVG(CASE WHEN area_m2 > 0 THEN price / area_m2 END)::int AS avg_m2_price,
        COUNT(*) FILTER (WHERE listing_type = 'sale')::int AS sale_count,
        COUNT(*) FILTER (WHERE listing_type = 'rent')::int AS rent_count,
        COUNT(*) FILTER (WHERE property_type = 'apartment')::int AS apartment_count
      FROM listings
      WHERE city ILIKE $1
        AND district ILIKE $2
        AND status = 'active'
    `, [city, district])

    const s = stats[0] as {
      listing_count: number; avg_price: number; avg_area: number
      avg_m2_price: number; sale_count: number; rent_count: number
    }

    const prompt = `
${city}, ${district} bölgesi analiz:
- Aktif ilan: ${s.listing_count}
- Ortalama fiyat: ${(s.avg_price ?? 0).toLocaleString('tr-TR')} ₺
- Ortalama alan: ${s.avg_area ?? 0} m²
- m² fiyatı: ${(s.avg_m2_price ?? 0).toLocaleString('tr-TR')} ₺/m²
- Satılık: ${s.sale_count}, Kiralık: ${s.rent_count}

Bu bölge hakkında yatırımcıya 3-4 cümlelik özet analiz yap.
Bölgenin potansiyeli, avantajları ve dikkat edilmesi gereken noktaları belirt.`

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    })

    const analysis = response.content[0]?.type === 'text' ? response.content[0].text : ''

    return { city, district, stats: s, analysis }
  }

  // ── Conversation History ──────────────────────────────────────────────────

  async getUserConversations(userId: string) {
    return this.ds.query(`
      SELECT id, title, created_at, updated_at,
        (SELECT COUNT(*)::int FROM atlas_messages WHERE conversation_id = ac.id) AS message_count
      FROM atlas_conversations ac
      WHERE user_id = $1
      ORDER BY updated_at DESC
      LIMIT 20
    `, [userId])
  }

  async getConversationMessages(conversationId: string, userId: string | null) {
    if (userId) {
      const check = await this.ds.query(
        `SELECT id FROM atlas_conversations WHERE id = $1 AND user_id = $2`, [conversationId, userId],
      )
      if (!check[0]) return []
    }
    return this.ds.query(`
      SELECT role, content, tokens_used, created_at
      FROM atlas_messages WHERE conversation_id = $1
      ORDER BY created_at ASC
    `, [conversationId])
  }
}
