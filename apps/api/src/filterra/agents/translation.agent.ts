import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Anthropic from '@anthropic-ai/sdk'

// Haiku — high-throughput, cost-effective for translation
const MODEL = 'claude-haiku-4-5-20251001'

export type TargetLanguage = 'en' | 'ar' | 'ru' | 'de' | 'fr'

export interface TranslationInput {
  title: string
  description: string
  city: string
  district?: string
  targetLanguage: TargetLanguage
  propertyType: string
  listingType: string
}

export interface TranslationOutput {
  translatedTitle: string
  translatedDescription: string
  targetLanguage: TargetLanguage
  tokensUsed: number
}

const LANGUAGE_NAMES: Record<TargetLanguage, string> = {
  en: 'English',
  ar: 'Arabic (العربية)',
  ru: 'Russian (Русский)',
  de: 'German (Deutsch)',
  fr: 'French (Français)',
}

@Injectable()
export class TranslationAgent {
  private client: Anthropic

  constructor(private config: ConfigService) {
    this.client = new Anthropic({
      apiKey: this.config.get<string>('ANTHROPIC_API_KEY'),
    })
  }

  async translate(input: TranslationInput): Promise<TranslationOutput> {
    const message = await this.client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a professional real estate listing translator specializing in Turkish property listings.

Translate the following Turkish real estate listing to ${LANGUAGE_NAMES[input.targetLanguage]}.

IMPORTANT RULES:
- Keep property terms accurate and professional
- Preserve all factual information exactly
- Use real estate industry terminology appropriate for the target language
- Keep Turkish city/district names as-is (they are proper nouns)
- Do NOT add or remove information

LISTING TO TRANSLATE:
Title: ${input.title}
Location: ${input.district ? `${input.district}, ` : ''}${input.city}
Type: ${input.listingType === 'sale' ? 'For Sale' : 'For Rent'} - ${input.propertyType}
Description:
${input.description}

RESPONSE FORMAT:
TITLE: [translated title]
DESCRIPTION: [translated description, preserve paragraph structure]`,
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const titleMatch = text.match(/TITLE:\s*(.+?)(?=\nDESCRIPTION:|$)/s)
    const descMatch = text.match(/DESCRIPTION:\s*([\s\S]+)$/)

    return {
      translatedTitle: titleMatch?.[1]?.trim() ?? input.title,
      translatedDescription: descMatch?.[1]?.trim() ?? input.description,
      targetLanguage: input.targetLanguage,
      tokensUsed: message.usage.output_tokens,
    }
  }
}
