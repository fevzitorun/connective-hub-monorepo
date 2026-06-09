import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Anthropic from '@anthropic-ai/sdk'

// Haiku — multimodal, fast, cost-effective for image analysis
const MODEL = 'claude-haiku-4-5-20251001'

export interface PhotoDescriptionInput {
  imageUrl: string
  propertyType: string
  listingType: string
}

export interface PhotoDescriptionOutput {
  description: string
  detectedFeatures: string[]
  suggestedAltText: string
  quality: 'high' | 'medium' | 'low'
  tokensUsed: number
}

@Injectable()
export class PhotoDescriptionAgent {
  private client: Anthropic

  constructor(private config: ConfigService) {
    this.client = new Anthropic({
      apiKey: this.config.get<string>('ANTHROPIC_API_KEY'),
    })
  }

  async describe(input: PhotoDescriptionInput): Promise<PhotoDescriptionOutput> {
    const message = await this.client.messages.create({
      model: MODEL,
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'url',
                url: input.imageUrl,
              },
            },
            {
              type: 'text',
              text: `Bu ${input.listingType === 'sale' ? 'satılık' : 'kiralık'} ${this.propTypeLabel(input.propertyType)} ilanının fotoğrafını analiz et.

Şunları yap:
1. Fotoğraftaki odayı/alanı tanımla (salon, yatak odası, mutfak, banyo, bahçe vb.)
2. Görünen özellikleri listele (doğal ışık, zemin tipi, tavan yüksekliği, eşyalar, manzara vb.)
3. Fotoğraf kalitesini değerlendir

YANIT FORMATI:
AÇIKLAMA: [2-3 cümle Türkçe fotoğraf açıklaması]
ÖZELLİKLER: [virgülle ayrılmış tespit edilen özellikler]
ALT_METİN: [SEO için kısa Türkçe alt metin, max 100 karakter]
KALİTE: [high/medium/low]`,
            },
          ],
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    return {
      ...this.parseOutput(text),
      tokensUsed: message.usage.output_tokens,
    }
  }

  private parseOutput(text: string): Omit<PhotoDescriptionOutput, 'tokensUsed'> {
    const descMatch = text.match(/AÇIKLAMA:\s*(.+?)(?=\nÖZELLİKLER:|$)/s)
    const featMatch = text.match(/ÖZELLİKLER:\s*(.+?)(?=\nALT_METİN:|$)/s)
    const altMatch = text.match(/ALT_METİN:\s*(.+?)(?=\nKALİTE:|$)/s)
    const qualMatch = text.match(/KALİTE:\s*(high|medium|low)/i)

    return {
      description: descMatch?.[1]?.trim() ?? '',
      detectedFeatures: featMatch?.[1]?.split(',').map((s) => s.trim()).filter(Boolean) ?? [],
      suggestedAltText: altMatch?.[1]?.trim().slice(0, 100) ?? '',
      quality: (qualMatch?.[1]?.toLowerCase() as 'high' | 'medium' | 'low') ?? 'medium',
    }
  }

  private propTypeLabel(type: string): string {
    const map: Record<string, string> = {
      residential: 'konut',
      commercial: 'ticari',
      land: 'arsa',
      industrial: 'endüstriyel',
    }
    return map[type] ?? type
  }
}
