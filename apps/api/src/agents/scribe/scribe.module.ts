/**
 * ScribeModule — M-04
 *
 * SCRIBE AI içerik üretim ajansı.
 * Anthropic Claude API ile blog, sosyal medya, ilan açıklaması,
 * pazar raporu ve basın bülteni üretir.
 *
 * Bağımlılıklar:
 *   - @anthropic-ai/sdk  → `npm i @anthropic-ai/sdk` (apps/api)
 *   - ANTHROPIC_API_KEY  → .env.local
 *   - AI_MODEL           → .env.local (default: claude-haiku-4-5-20251001)
 *
 * AppModule'e şu şekilde eklenmiştir:
 *   import { ScribeModule } from './agents/scribe/scribe.module'
 *   ScribeModule,  // M-04 — SCRIBE AI İçerik Ajansı
 */

import { Module } from '@nestjs/common'
import { ScribeService }    from './scribe.service'
import { ScribeController } from './scribe.controller'

@Module({
  controllers: [ScribeController],
  providers:   [ScribeService],
  exports:     [ScribeService], // CrmModule (CAMPAIGNER), AuctionModule vb. için
})
export class ScribeModule {}
