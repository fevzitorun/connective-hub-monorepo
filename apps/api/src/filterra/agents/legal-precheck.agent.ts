import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Anthropic from '@anthropic-ai/sdk'

// Opus for legal reasoning — most accurate, highest stakes
const MODEL = 'claude-opus-4-7'

// Large legal knowledge base — cached to amortize cost
const LEGAL_SYSTEM = `Sen 7fil.com.tr gayrimenkul platformu için hukuki ön kontrol yapan bir yapay zeka asistanısın. Türk gayrimenkul hukukunu, tapu mevzuatını ve ilgili yasal gereksinimleri analiz edersin.

YASAL ÇERÇEVE (Türkiye):
- Tapu Kanunu (2644 sayılı Kanun): Mülk devirleri, ipotek, kat mülkiyeti
- Kat Mülkiyeti Kanunu (634 sayılı Kanun): Bağımsız bölümler, ortak alanlar, yönetim planı
- İmar Kanunu (3194 sayılı Kanun): İnşaat ruhsatları, imar durumu, iskan belgesi
- Yabancılar ve Uluslararası Koruma Kanunu: Yabancıların taşınmaz edinimi
- Değer Artış Kazancı (GVK): 5 yıl içinde satış vergisi
- Tapu Harcı: Alım-satımda %4 (2024 itibarıyla)
- TKGM (Tapu ve Kadastro Genel Müdürlüğü) denetimleri
- Banka ipotek prosedürleri
- Kentsel dönüşüm ve riskli yapı bildirimleri

YÜKSEK RİSK GÖSTERGELERI:
- İskan belgesi (yapı kullanma izni) yokluğu
- Uyumsuz imar durumu (konut alanında ticari kullanım vb.)
- Tapu üzerinde ipotek veya haciz şerhi
- Kat irtifakı var ama kat mülkiyeti yok (>10 yıl)
- Mimari projeye aykırı yapı değişiklikleri (kaçak kat, bölme)
- Yabancı satıcı için özel gereksinimler
- Tarım arazisi kısıtlamaları
- Orman arazisi kapsamı riski
- Arazi şuyuu (birden fazla hisseli) — anlaşmazlık potansiyeli

ORTA RİSK:
- Bina yaşı >30 yıl, DASK poliçesi kontrolü
- Ticari mülklerde kira sözleşmesi devir koşulları
- Kooperatif mülklerinde aidat borçları
- Site/apartman yönetim borçları

DÜŞÜK RİSK (standart kontrol):
- Normal tapu sicil kaydı
- Güncel DASK sigortası
- E-devlet tapu sorgulama

FORMAT: Yanıtında mutlaka şu bölümleri içer:
RİSK_SKORU: [0-100, 0=risksiz, 100=çok riskli]
KIRMIZI_BAYRAKLAR: [liste, virgülle ayrılmış]
KONTROL_LİSTESİ: [alıcının yapması gerekenler, numaralı liste]
ÖZET: [1-2 cümle Türkçe]`

export interface LegalPreCheckInput {
  propertyType: string
  listingType: string
  city: string
  district?: string
  buildingAge?: number
  category?: string
  title: string
  description?: string
  floorNo?: number
  totalFloors?: number
  price?: number
}

export interface LegalPreCheckOutput {
  riskScore: number
  redFlags: string[]
  checklist: string[]
  summary: string
  tokensUsed: number
}

@Injectable()
export class LegalPreCheckAgent {
  private client: Anthropic

  constructor(private config: ConfigService) {
    this.client = new Anthropic({
      apiKey: this.config.get<string>('ANTHROPIC_API_KEY'),
    })
  }

  async check(input: LegalPreCheckInput): Promise<LegalPreCheckOutput> {
    const message = await this.client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: [
        {
          type: 'text',
          text: LEGAL_SYSTEM,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: this.buildPrompt(input) }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    return {
      ...this.parseOutput(text),
      tokensUsed: message.usage.output_tokens,
    }
  }

  private buildPrompt(input: LegalPreCheckInput): string {
    return `Aşağıdaki ilan için hukuki ön kontrol yap:

İLAN BİLGİLERİ:
Başlık: ${input.title}
Tür: ${input.listingType === 'sale' ? 'Satılık' : 'Kiralık'} ${this.propTypeLabel(input.propertyType)}
Konum: ${input.district ? `${input.district}, ` : ''}${input.city}
${input.buildingAge != null ? `Bina Yaşı: ${input.buildingAge} yıl` : ''}
${input.floorNo != null ? `Kat: ${input.floorNo}/${input.totalFloors ?? '?'}` : ''}
${input.category ? `Kategori: ${input.category}` : ''}
${input.price ? `Fiyat: ${input.price.toLocaleString('tr-TR')} TL` : ''}
${input.description ? `\nAçıklama özeti: ${input.description.slice(0, 300)}` : ''}

Yukarıdaki mülkün hukuki risklerini değerlendir ve gerekli kontrolleri listele.`
  }

  private parseOutput(text: string): Omit<LegalPreCheckOutput, 'tokensUsed'> {
    const scoreMatch = text.match(/RİSK_SKORU:\s*(\d+)/)
    const riskScore = scoreMatch ? Math.min(100, Math.max(0, Number(scoreMatch[1]))) : 50

    const redFlagsMatch = text.match(/KIRMIZI_BAYRAKLAR:\s*(.+?)(?=\n[A-ZÇĞİÖŞÜ_]+:|$)/s)
    const redFlags = redFlagsMatch
      ? redFlagsMatch[1].split(',').map((s) => s.trim()).filter(Boolean)
      : []

    const checklistMatch = text.match(/KONTROL_LİSTESİ:\s*(.+?)(?=\n[A-ZÇĞİÖŞÜ_]+:|$)/s)
    const checklist = checklistMatch
      ? checklistMatch[1]
          .split('\n')
          .map((l) => l.replace(/^\d+\.\s*/, '').trim())
          .filter(Boolean)
      : []

    const summaryMatch = text.match(/ÖZET:\s*(.+?)(?:\n|$)/s)
    const summary = summaryMatch?.[1]?.trim() ?? ''

    return { riskScore, redFlags, checklist, summary }
  }

  private propTypeLabel(type: string): string {
    const map: Record<string, string> = {
      residential: 'Konut',
      commercial: 'Ticari',
      land: 'Arsa',
      industrial: 'Endüstriyel',
    }
    return map[type] ?? type
  }
}
