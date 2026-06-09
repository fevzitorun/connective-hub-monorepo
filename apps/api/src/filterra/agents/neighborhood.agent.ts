import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Anthropic from '@anthropic-ai/sdk'

const MODEL = 'claude-sonnet-4-6'

// Neighborhood knowledge — cached: large static prompt, reused across many requests
const NEIGHBORHOOD_SYSTEM = `Sen 7fil.com.tr gayrimenkul platformu için mahalle analizi yapan bir uzman asistanısın. Türkiye'nin tüm büyük şehirlerindeki mahalleleri, yaşam kalitesini ve yatırım potansiyelini analiz edersin.

PUANLAMA KRİTERLERİ (her biri 0-10):
1. Ulaşım: Metro, metrobüs, otobüs, deniz ulaşımı yakınlığı
2. Eğitim: İlkokul, ortaokul, lise, üniversite yoğunluğu ve kalitesi
3. Sağlık: Hastane, klinik, eczane erişimi
4. Alışveriş: Market, AVM, çarşı, pazar yeri
5. Sosyal Yaşam: Kafe, restoran, park, spor alanı
6. Güvenlik: Bölgesel güvenlik algısı
7. Yeşil Alan: Park, bahçe, doğal alan yoğunluğu
8. Yatırım Potansiyeli: Değer artış trendi, kentsel dönüşüm projeler

İSTANBUL MAHALLE BİLGİSİ:
Kadıköy: Merkezi konum, marina, Moda, sanat sahnesı. Ulaşım 9, Sosyal 10.
Beşiktaş: Kurumsal, BJK stadı, Ortaköy, Bosphorus. Fiyat premium.
Şişli/Nişantaşı: Lüks perakende, kurumsal ofisler, Cumhuriyet Cad.
Üsküdar: Tarihi doku, sakin, vapur ile Avrupa'ya bağlı.
Maltepe: Sahil şeridi, uygun fiyat, yoğun nüfus.
Ataşehir: Finans merkezi, yüksek kira, kurumsal bölge.
Çekmeköy: Yeşil alan bol, ama ulaşım sınırlı.
Başakşehir: Hastane şehri, sosyal tesis ağırlıklı.
Esenyurt: Çok kültürlü, uygun fiyat, yüksek kira getirisi.
Sarıyer/Zekeriyaköy: Doğa yakın, premium villa bölgesi.

ANKARA MAHALLE BİLGİSİ:
Çankaya: Cumhurbaşkanlığı çevresi, diplomatik bölge, premium.
Keçiören: Geniş aile bölgesi, uygun fiyat.
Mamak: Sanayi yakın, uygun fiyat segmenti.
Etimesgut: Yeni gelişen, okul yoğun.
Yenimahalle: Merkezi, uygun ulaşım.
Bilkent/ODTÜ çevresi: Akademik, genç nüfus, kiralık pazar güçlü.

İZMİR MAHALLE BİLGİSİ:
Alsancak: Şehir merkezi, sahil, eğlence bölgesi.
Karşıyaka: Aile dostu, trafiğe uzak, sakin.
Bornova: Üniversite odaklı, genç nüfus, kira getirisi iyi.
Konak: Tarihi merkez, ticari canlılık.
Buca: Uygun fiyat, üniversite yakın.
Mavişehir: Modern, marinaya yakın, premium segment.

FORMAT:
PUAN_ULAŞIM: [0-10]
PUAN_EĞİTİM: [0-10]
PUAN_SAĞLIK: [0-10]
PUAN_ALIŞVERİŞ: [0-10]
PUAN_SOSYAL: [0-10]
PUAN_GÜVENLİK: [0-10]
PUAN_YEŞİL: [0-10]
PUAN_YATIRIM: [0-10]
GENEL_PUAN: [0-100 toplam]
ÖZET: [2-3 cümle Türkçe mahalle özeti]
ARTILARI: [virgülle ayrılmış]
EKSİLERİ: [virgülle ayrılmış]
HEDEF_KİTLE: [hedef alıcı/kiracı profili]`

export interface NeighborhoodInput {
  city: string
  district: string
  neighborhood?: string
  propertyType: string
  listingType: string
}

export interface NeighborhoodScore {
  transport: number
  education: number
  health: number
  shopping: number
  social: number
  safety: number
  greenSpace: number
  investment: number
  overall: number
  summary: string
  pros: string[]
  cons: string[]
  targetAudience: string
  tokensUsed: number
}

@Injectable()
export class NeighborhoodAgent {
  private client: Anthropic

  constructor(private config: ConfigService) {
    this.client = new Anthropic({
      apiKey: this.config.get<string>('ANTHROPIC_API_KEY'),
    })
  }

  async analyze(input: NeighborhoodInput): Promise<NeighborhoodScore> {
    const message = await this.client.messages.create({
      model: MODEL,
      max_tokens: 768,
      system: [
        {
          type: 'text',
          text: NEIGHBORHOOD_SYSTEM,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Şu bölgeyi analiz et:
Şehir: ${input.city}
İlçe: ${input.district}
${input.neighborhood ? `Mahalle: ${input.neighborhood}` : ''}
Mülk Tipi: ${input.propertyType}
İlan Tipi: ${input.listingType === 'sale' ? 'Satılık' : 'Kiralık'}

Tüm puanları ve mahalle analizini ver.`,
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    return {
      ...this.parseOutput(text),
      tokensUsed: message.usage.output_tokens,
    }
  }

  private parseOutput(text: string): Omit<NeighborhoodScore, 'tokensUsed'> {
    const getScore = (key: string) => {
      const match = text.match(new RegExp(`${key}:\\s*(\\d+)`))
      return match ? Math.min(10, Math.max(0, Number(match[1]))) : 5
    }

    const overallMatch = text.match(/GENEL_PUAN:\s*(\d+)/)
    const summaryMatch = text.match(/ÖZET:\s*(.+?)(?=\nARTILARI:|$)/s)
    const prosMatch = text.match(/ARTILARI:\s*(.+?)(?=\nEKSİLERİ:|$)/s)
    const consMatch = text.match(/EKSİLERİ:\s*(.+?)(?=\nHEDEF_KİTLE:|$)/s)
    const audienceMatch = text.match(/HEDEF_KİTLE:\s*(.+?)(?:\n|$)/s)

    return {
      transport: getScore('PUAN_ULAŞIM'),
      education: getScore('PUAN_EĞİTİM'),
      health: getScore('PUAN_SAĞLIK'),
      shopping: getScore('PUAN_ALIŞVERİŞ'),
      social: getScore('PUAN_SOSYAL'),
      safety: getScore('PUAN_GÜVENLİK'),
      greenSpace: getScore('PUAN_YEŞİL'),
      investment: getScore('PUAN_YATIRIM'),
      overall: overallMatch ? Number(overallMatch[1]) : 50,
      summary: summaryMatch?.[1]?.trim() ?? '',
      pros: prosMatch?.[1]?.split(',').map((s) => s.trim()).filter(Boolean) ?? [],
      cons: consMatch?.[1]?.split(',').map((s) => s.trim()).filter(Boolean) ?? [],
      targetAudience: audienceMatch?.[1]?.trim() ?? '',
    }
  }
}
