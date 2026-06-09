/**
 * SCRIBE Agent — M-04
 *
 * Otomatik içerik üretim motoru. Claude AI (Anthropic SDK) veya
 * çevre değişkenine göre OpenAI kullanır.
 *
 * Ürettiği içerik türleri:
 *   - blog        : SEO optimized blog yazısı (TR)
 *   - social_pack : 7 platform için sosyal medya paketi
 *   - listing_desc: İlan açıklaması zenginleştirme
 *   - market_report: Pazar özeti / haftalık bülten
 *   - press_release: Basın bülteni (PR-MAESTRO ile ortak)
 */

import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Anthropic from '@anthropic-ai/sdk'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

// ─── DTOs ────────────────────────────────────────────────────────────────────

export type ContentType =
  | 'blog'
  | 'social_pack'
  | 'listing_desc'
  | 'market_report'
  | 'press_release'

export interface ScribeJobInput {
  type: ContentType
  /** Şehir veya konu (örn: "İstanbul Kadıköy") */
  topic: string
  /** Ek bağlam — ilan verisi, istatistikler vb. */
  context?: string
  /** Hedef anahtar kelimeler (SEO) */
  keywords?: string[]
  /** İçerik tonu: professional | friendly | urgent */
  tone?: 'professional' | 'friendly' | 'urgent'
  /** İlan ID'si (listing_desc için zorunlu) */
  listingId?: string
  /** Talep eden acenta ID'si */
  agencyId?: string
  /** Talep eden kullanıcı ID'si */
  requestedByUserId?: string
}

export interface ScribeJobOutput {
  type: ContentType
  topic: string
  content: Record<string, string>
  metadata: {
    model: string
    tokensUsed?: number
    generatedAt: string
  }
}

// ─── Prompt şablonları ───────────────────────────────────────────────────────

const PROMPTS: Record<ContentType, (input: ScribeJobInput) => string> = {
  blog: (i) => `
Sen 7fil.com.tr için içerik üreten SCRIBE ajansısın. Türkiye gayrimenkul sektöründe uzman bir içerik yazarısın.

Konu: ${i.topic}
${i.context ? `Bağlam: ${i.context}` : ''}
${i.keywords?.length ? `Hedef anahtar kelimeler: ${i.keywords.join(', ')}` : ''}
Ton: ${i.tone ?? 'professional'}

Aşağıdaki formatta Türkçe SEO blog yazısı yaz:

<title>Makale başlığı (60 karakter altı)</title>
<meta_desc>Meta açıklama (150-160 karakter)</meta_desc>
<slug>url-dostu-slug</slug>
<intro>Giriş paragrafı (100-150 kelime)</intro>
<sections>
  <section>
    <h2>Alt başlık</h2>
    <content>Bölüm içeriği (200-300 kelime)</content>
  </section>
  <!-- En az 3 section -->
</sections>
<conclusion>Sonuç paragrafı ve CTA (50-100 kelime)</conclusion>
<tags>etiket1, etiket2, etiket3, etiket4, etiket5</tags>
`,

  social_pack: (i) => `
Sen 7fil.com.tr için sosyal medya içeriği üreten SCRIBE ajansısın.

Konu: ${i.topic}
${i.context ? `Bağlam: ${i.context}` : ''}
Ton: ${i.tone ?? 'friendly'}

7 platform için ayrı ayrı Türkçe gönderi yaz:

<instagram>
  <caption>Gönderi metni (en fazla 2200 karakter, 3-5 emoji, hashtag'ler)</caption>
  <hashtags>#hashtag1 #hashtag2 ... (30 hashtag)</hashtags>
</instagram>
<twitter>Tweet (280 karakter, 2-3 hashtag)</twitter>
<linkedin>LinkedIn gönderisi (profesyonel ton, 500-800 karakter)</linkedin>
<facebook>Facebook gönderisi (500-1000 karakter)</facebook>
<whatsapp>WhatsApp mesajı (kısa, etkili, link ile, 200-300 karakter)</whatsapp>
<tiktok>TikTok caption + hook metni (150 karakter caption + 3 hook seçeneği)</tiktok>
<threads>Threads gönderisi (500 karakter altı)</threads>
`,

  listing_desc: (i) => `
Sen 7fil.com.tr için ilan açıklaması yazan SCRIBE ajansısın.

İlan bilgileri: ${i.context ?? i.topic}
Ton: ${i.tone ?? 'professional'}

Satış/kiralama ilanı için iki farklı açıklama yaz:

<short_desc>Kısa açıklama (150-200 karakter, arama motoru odaklı)</short_desc>
<long_desc>Uzun açıklama (400-600 kelime, SEO optimized, özellikler vurgulanmış, CTA ile)</long_desc>
<highlights>5 madde halinde öne çıkan özellikler</highlights>
`,

  market_report: (i) => `
Sen 7fil.com.tr için piyasa raporu yazan SCRIBE ajansısın.

Bölge/Konu: ${i.topic}
${i.context ? `Veriler/Bağlam: ${i.context}` : ''}
Tarih: ${new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}

Haftalık piyasa özeti raporu yaz:

<report_title>Rapor başlığı</report_title>
<executive_summary>Yönetici özeti (150-200 kelime)</executive_summary>
<price_trends>Fiyat trendleri analizi (200-300 kelime)</price_trends>
<supply_demand>Arz-talep dengesi (150-200 kelime)</supply_demand>
<investment_outlook>Yatırım perspektifi (150-200 kelime)</investment_outlook>
<key_insights>5 kritik içgörü (madde madde)</key_insights>
`,

  press_release: (i) => `
Sen 7fil.com.tr için basın bülteni yazan PR-MAESTRO ajansısın.

Konu: ${i.topic}
${i.context ? `Bağlam: ${i.context}` : ''}
Şirket: Connective Hub Dijital Teknolojiler Ltd. Şti.
Platform: 7fil.com.tr

Profesyonel basın bülteni yaz (AP formatı, Türkçe):

<headline>Manşet (80 karakter altı)</headline>
<subheadline>Alt manşet (100 karakter altı)</subheadline>
<dateline>İstanbul, ${new Date().toLocaleDateString('tr-TR')}</dateline>
<lead_paragraph>Lede paragrafı (5W1H kuralı, 100-150 kelime)</lead_paragraph>
<body_paragraphs>Gövde (2-3 paragraf, toplam 300-400 kelime)</body_paragraphs>
<quote>CEO alıntısı (50-80 kelime)</quote>
<boilerplate>Şirket tanıtım metni (100 kelime)</boilerplate>
<contact>İletişim bilgileri placeholder</contact>
`,
}

// ─── SCRIBE Service ──────────────────────────────────────────────────────────

@Injectable()
export class ScribeService {
  private readonly logger = new Logger(ScribeService.name)
  private readonly anthropic: Anthropic

  constructor(
    private readonly config: ConfigService,
    @InjectDataSource() private readonly ds: DataSource,
  ) {
    this.anthropic = new Anthropic({
      apiKey: this.config.get<string>('ANTHROPIC_API_KEY') ?? '',
    })
  }

  /**
   * Ana içerik üretim metodu.
   * Üretilen içeriği `generated_contents` tablosuna kaydeder.
   */
  async generate(input: ScribeJobInput): Promise<ScribeJobOutput> {
    if (!PROMPTS[input.type]) {
      throw new BadRequestException(`Bilinmeyen içerik türü: ${input.type}`)
    }

    const prompt = PROMPTS[input.type](input)
    const model  = this.config.get<string>('AI_MODEL') ?? 'claude-haiku-4-5-20251001'

    this.logger.log(`SCRIBE çalışıyor: type=${input.type} topic="${input.topic}" model=${model}`)

    let rawContent: string
    let tokensUsed: number | undefined

    try {
      const response = await this.anthropic.messages.create({
        model,
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      })

      rawContent = response.content
        .filter((b) => b.type === 'text')
        .map((b) => (b as { type: 'text'; text: string }).text)
        .join('\n')

      tokensUsed = response.usage.input_tokens + response.usage.output_tokens
    } catch (err) {
      this.logger.error('Anthropic API hatası', err)
      throw err
    }

    // XML taglerini parse et
    const parsed = this._parseXmlTags(rawContent)

    const output: ScribeJobOutput = {
      type:    input.type,
      topic:   input.topic,
      content: parsed,
      metadata: {
        model,
        tokensUsed,
        generatedAt: new Date().toISOString(),
      },
    }

    // Veritabanına kaydet
    await this._saveContent(input, rawContent, output.metadata)

    return output
  }

  /**
   * Blog üretip direkt dön.
   */
  async generateBlog(topic: string, keywords?: string[], agencyId?: string) {
    return this.generate({ type: 'blog', topic, keywords, agencyId })
  }

  /**
   * Sosyal medya paketi üret.
   */
  async generateSocialPack(topic: string, context?: string, agencyId?: string) {
    return this.generate({ type: 'social_pack', topic, context, agencyId })
  }

  /**
   * İlan açıklaması zenginleştir.
   */
  async enrichListingDescription(listingId: string, agencyId?: string) {
    // İlan verisini DB'den çek
    const [listing] = await this.ds.query(
      `SELECT title, description, city, district, property_type,
              area_m2, room_count, price
         FROM listings WHERE id = $1`,
      [listingId],
    )

    if (!listing) throw new BadRequestException('İlan bulunamadı')

    const context = JSON.stringify({
      başlık: listing.title,
      şehir: listing.city,
      ilçe: listing.district,
      tip: listing.property_type,
      alan: listing.area_m2,
      oda: listing.room_count,
      fiyat: listing.price,
    })

    return this.generate({
      type: 'listing_desc',
      topic: `${listing.city} ${listing.district} ${listing.property_type}`,
      context,
      listingId,
      agencyId,
    })
  }

  /**
   * Haftalık piyasa raporu üret.
   */
  async generateMarketReport(city: string, agencyId?: string) {
    // Basit istatistik çek
    const stats = await this.ds.query(
      `SELECT
         COUNT(*)              AS total_listings,
         AVG(price)            AS avg_price,
         MIN(price)            AS min_price,
         MAX(price)            AS max_price
       FROM listings
       WHERE city = $1 AND status = 'active'`,
      [city],
    )

    const context = stats.length
      ? `Aktif ilan sayısı: ${stats[0].total_listings}, Ortalama fiyat: ${Math.round(parseFloat(stats[0].avg_price ?? '0')).toLocaleString('tr-TR')} ₺`
      : undefined

    return this.generate({
      type: 'market_report',
      topic: city,
      context,
      agencyId,
    })
  }

  // ─── Yardımcı Metodlar ────────────────────────────────────────────────────

  /** Basit XML tag parser */
  private _parseXmlTags(text: string): Record<string, string> {
    const result: Record<string, string> = { raw: text }
    const tagRegex = /<(\w+)>([\s\S]*?)<\/\1>/g
    let match: RegExpExecArray | null
    while ((match = tagRegex.exec(text)) !== null) {
      result[match[1]] = match[2].trim()
    }
    return result
  }

  /** Üretilen içeriği kaydet */
  private async _saveContent(
    input: ScribeJobInput,
    raw: string,
    meta: ScribeJobOutput['metadata'],
  ) {
    try {
      await this.ds.query(
        `INSERT INTO generated_contents
           (agency_id, requested_by_user_id, content_type, topic, listing_id, raw_output, ai_model, tokens_used)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT DO NOTHING`,
        [
          input.agencyId ?? null,
          input.requestedByUserId ?? null,
          input.type,
          input.topic,
          input.listingId ?? null,
          raw,
          meta.model,
          meta.tokensUsed ?? null,
        ],
      )
    } catch (err) {
      // Kayıt hatası içerik üretimini engellemez
      this.logger.warn('İçerik kayıt hatası', err)
    }
  }
}
