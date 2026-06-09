import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Anthropic from '@anthropic-ai/sdk'
import { FastifyReply } from 'fastify'

const MODEL = 'claude-sonnet-4-6'

// Cached system prompt — counts once per 5-min TTL
const SYSTEM_PROMPT = `Sen 7fil.com.tr'nin FILTERRA.AI yazım asistanısın. Türkiye'nin önde gelen gayrimenkul ekosistemi için ilan açıklamaları yazıyorsun.

GÖREV: Verilen ilan bilgilerini kullanarak, Türk gayrimenkul alıcılarına hitap eden, SEO dostu, ikna edici ve doğru bir ilan açıklaması yaz.

KURALLAR:
- 3-5 paragraf, toplamda 200-350 kelime
- İlk paragraf: Mülkün en çekici özelliğini vurgula (konum veya ana özellik)
- İkinci paragraf: İç özellikler (oda sayısı, metrekare, kat, yaş vb.)
- Üçüncü paragraf: Sosyal olanaklar (eğitim, ulaşım, alışveriş yakınlığı)
- Dördüncü paragraf (opsiyonel): Yatırım potansiyeli veya kiracı profili
- Son paragraf: Harekete geçirici mesaj (WhatsApp vurgusu)
- Fiyatı açıklamaya yazma (card'da ayrıca gösterilir)
- Abartılı ifadeler kullanma: "eşsiz", "muhteşem", "inanılmaz" gibi sözcüklerden kaçın
- Türkçe yazım kurallarına uy, sade ama profesyonel dil
- Asla uydurma bilgi ekleme — sadece verilen verilere dayan

FORMAT: Sadece açıklama metnini döndür, başlık veya meta bilgi ekleme.`

export interface ListingWriterInput {
  title: string
  city: string
  district: string
  neighborhood?: string
  propertyType: string
  listingType: string
  roomCount?: string
  areaM2?: number
  floorNo?: number
  totalFloors?: number
  buildingAge?: number
  isFurnished?: boolean
  hasParking?: boolean
  hasElevator?: boolean
  hasBalcony?: boolean
  hasGarden?: boolean
  hasPool?: boolean
  category?: string
  agentPhone?: string
}

@Injectable()
export class ListingWriterAgent {
  private client: Anthropic

  constructor(private config: ConfigService) {
    this.client = new Anthropic({
      apiKey: this.config.get<string>('ANTHROPIC_API_KEY'),
    })
  }

  async streamTo(input: ListingWriterInput, res: FastifyReply): Promise<{ text: string; tokensUsed: number }> {
    const userMessage = this.buildUserMessage(input)

    res.raw.setHeader('Content-Type', 'text/event-stream')
    res.raw.setHeader('Cache-Control', 'no-cache')
    res.raw.setHeader('X-Accel-Buffering', 'no')

    let fullText = ''
    let tokensUsed = 0

    const stream = this.client.messages.stream({
      model: MODEL,
      max_tokens: 1024,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: userMessage }],
    })

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        fullText += chunk.delta.text
        res.raw.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
      }
      if (chunk.type === 'message_delta' && chunk.usage) {
        tokensUsed = (chunk.usage as { output_tokens: number }).output_tokens
      }
    }

    res.raw.write(`data: ${JSON.stringify({ done: true })}\n\n`)
    res.raw.end()

    return { text: fullText, tokensUsed }
  }

  async generate(input: ListingWriterInput): Promise<{ text: string; tokensUsed: number }> {
    const message = await this.client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: this.buildUserMessage(input) }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const tokensUsed = message.usage.output_tokens
    return { text, tokensUsed }
  }

  private buildUserMessage(input: ListingWriterInput): string {
    const specs = [
      input.roomCount && `Oda sayısı: ${input.roomCount}`,
      input.areaM2 && `Alan: ${input.areaM2} m²`,
      input.floorNo != null && `Kat: ${input.floorNo}/${input.totalFloors ?? '?'}`,
      input.buildingAge != null && `Bina yaşı: ${input.buildingAge}`,
      input.isFurnished != null && `Eşyalı: ${input.isFurnished ? 'Evet' : 'Hayır'}`,
    ].filter(Boolean)

    const features = [
      input.hasParking && 'Otopark',
      input.hasElevator && 'Asansör',
      input.hasBalcony && 'Balkon',
      input.hasGarden && 'Bahçe',
      input.hasPool && 'Havuz',
    ].filter(Boolean)

    return `İlan Bilgileri:
Başlık: ${input.title}
Tür: ${input.listingType === 'sale' ? 'Satılık' : 'Kiralık'} ${this.propTypeLabel(input.propertyType)}
Konum: ${input.district ? `${input.district}, ` : ''}${input.city}${input.neighborhood ? ` (${input.neighborhood})` : ''}
${specs.length ? `Özellikler: ${specs.join(' | ')}` : ''}
${features.length ? `Olanaklar: ${features.join(', ')}` : ''}
${input.category ? `Kategori: ${input.category}` : ''}

Lütfen bu ilan için profesyonel bir açıklama yaz.`
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
