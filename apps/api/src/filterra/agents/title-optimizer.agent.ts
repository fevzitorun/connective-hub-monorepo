import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Anthropic from '@anthropic-ai/sdk'

// Haiku: fast + cheap for high-volume title generation
const MODEL = 'claude-haiku-4-5-20251001'

export interface TitleOptimizerInput {
  currentTitle: string
  city: string
  district?: string
  propertyType: string
  listingType: string
  roomCount?: string
  areaM2?: number
  price?: number
  currency?: string
}

export interface TitleOptimizerOutput {
  alternatives: string[]
  reasoning: string
  tokensUsed: number
}

@Injectable()
export class TitleOptimizerAgent {
  private client: Anthropic

  constructor(private config: ConfigService) {
    this.client = new Anthropic({
      apiKey: this.config.get<string>('ANTHROPIC_API_KEY'),
    })
  }

  async optimize(input: TitleOptimizerInput): Promise<TitleOptimizerOutput> {
    const prompt = this.buildPrompt(input)

    const message = await this.client.messages.create({
      model: MODEL,
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    return {
      ...this.parseOutput(raw),
      tokensUsed: message.usage.output_tokens,
    }
  }

  private buildPrompt(input: TitleOptimizerInput): string {
    const typeLabel = input.listingType === 'sale' ? 'Satılık' : 'Kiralık'
    const propLabel = this.propTypeLabel(input.propertyType)

    return `Sen Türkiye'nin önde gelen gayrimenkul platformu 7fil.com.tr için SEO başlık optimizasyon uzmanısın.

Mevcut başlık: "${input.currentTitle}"
Tür: ${typeLabel} ${propLabel}
Konum: ${input.district ? `${input.district}, ` : ''}${input.city}
${input.roomCount ? `Oda: ${input.roomCount}` : ''}
${input.areaM2 ? `Alan: ${input.areaM2} m²` : ''}

Görev: 3 farklı, SEO dostu başlık alternatifi üret.

Kurallar:
- Her başlık 50-80 karakter arası olsun
- Tür (Satılık/Kiralık) + Özellik + Konum formatını kullan
- Google arama niyetiyle eşleşsin (örn: "Kadıköy Satılık 3+1 Daire")
- Abartılı veya yanıltıcı ifade kullanma
- Her başlık farklı bir açıdan yaklaşsın (konum odaklı, özellik odaklı, fiyat-değer odaklı)

JSON formatında yanıt ver:
{
  "alternatives": ["başlık1", "başlık2", "başlık3"],
  "reasoning": "kısa açıklama (1-2 cümle)"
}`
  }

  private parseOutput(raw: string): Pick<TitleOptimizerOutput, 'alternatives' | 'reasoning'> {
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          alternatives: parsed.alternatives ?? [],
          reasoning: parsed.reasoning ?? '',
        }
      }
    } catch {
      // fall through to line parsing
    }

    const lines = raw.split('\n').filter((l) => l.trim().startsWith('"') || l.match(/^\d\./))
    return {
      alternatives: lines.slice(0, 3).map((l) => l.replace(/^[\d."*-]+\s*/, '').trim()),
      reasoning: '',
    }
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
