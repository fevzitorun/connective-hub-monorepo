# 7fil.com.tr — Connective Hub Gayrimenkul SaaS

> **"Sahibinden ilan satar. 7fil sizi zengin eder."**
>
> Rightmove + Zoopla + LoopNet → Türkiye'nin entegre gayrimenkul SaaS ekosistemi.

---

## 🐘 Nedir?

7fil; arama, değerleme, hukuki doğrulama, finansman, sigorta, imza ve taşınma — ev sahibi olmanın **yedi adımını** tek çatı altında birleştiren B2C + B2B SaaS platformu.

- **B2C Portal** — Rightmove gibi: 100K+ ilan, NLS arama, Atlas AI asistan
- **B2B SaaS** — Zoopla gibi: acenta aboneliği, CRM, MLS, PDF broşür, analitik
- **Ticari Portal** — LoopNet gibi: TicariMetre (ofis, depo, arsa)

---

## 🛠️ Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| Frontend | Next.js 16.2.6, React 19, TypeScript |
| Stil | Tailwind CSS v4, custom CSS design system |
| AI | @anthropic-ai/sdk (claude-sonnet-4-6), streaming SSE |
| Drag & Drop | @dnd-kit/core, @dnd-kit/sortable |
| Fontlar | Playfair Display (serif), DM Sans (sans) |
| Deploy | Vercel (önerilen) |

### Tasarım Token'ları
```css
--ink:       #14142a   /* Ana koyu renk */
--gold:      #c9a84c   /* 7fil altın */
--teal:      #2d6a6a   /* Aksiyon rengi */
--cream:     #f8f4ee   /* Açık arka plan */
--paper:     #fffdf8   /* Kart arka planı */
```

---

## 📁 Proje Yapısı

```
app/
  page.tsx              → Ana sayfa (hero, stats, ilanlar, özellikler)
  ilanlar/
    page.tsx            → İlan listesi (filtre sidebar, harita toggle)
    [id]/page.tsx       → İlan detayı (Atlas AI raporu, RitualVertical)
  panel/
    page.tsx            → Partner dashboard (KPI, ilan yönetimi, MLS toggle)
    crm/page.tsx        → CRM Kanban (dnd-kit, 5 sütun)
    mls/page.tsx        → MLS havuz sistemi (3 sekme)
    pdf-brosur/page.tsx → PDF broşür oluşturucu (3 şablon, 4 dil)
  atlas/page.tsx        → Atlas AI chat (gerçek API, SSE streaming)
  kayit/page.tsx        → Acenta onboarding (4 adım)
  fiyatlar/page.tsx     → SaaS fiyatlandırma (4 plan + karşılaştırma)
  sehir/[slug]/         → 10 şehir SEO landing sayfası (SSG)
  muzayede/page.tsx     → Canlı müzayede
  admin/page.tsx        → Admin panel
  api/
    atlas/route.ts      → Atlas AI API (NLS parse + streaming)
  globals.css           → ~2400 satır design system

components/
  nav.tsx               → Sticky navigation
  icons.tsx             → 40+ SVG ikon + BrandMark fil logosu
  photos.tsx            → SVG mimari sahneler (6 tip x 6 palet)
  ui.tsx                → RitualStrip, ListingCard, Pill, RitualVertical

lib/
  data.ts               → LISTINGS (9), STEPS, fmtTRY, Listing interface
  cities.ts             → 10 şehir verisi (slug, stats, ilçeler)

docs/
  MARKET-ATTACK-v5.md   → Rightmove/Zoopla/LoopNet Türkiye strateji belgesi
  PANEL-DESIGN-v1.md    → Sahibinden Ofisim analizi + 7fil üstünlük haritası
```

---

## 🚀 Kurulum

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # production build
```

### Environment Variables

```env
# Atlas AI için zorunlu (production)
ANTHROPIC_API_KEY=sk-ant-...

# Opsiyonel (ileride)
IYZICO_API_KEY=...
IYZICO_SECRET_KEY=...
```

---

## 🗺️ Tüm Rotalar

| Route | Açıklama | Durum |
|-------|----------|-------|
| `/` | Ana sayfa | ✅ |
| `/ilanlar` | İlan listesi + filtreler | ✅ |
| `/ilanlar/[id]` | İlan detayı | ✅ |
| `/atlas` | Atlas AI chat (gerçek API, streaming) | ✅ |
| `/panel` | Partner dashboard | ✅ |
| `/panel/crm` | CRM Kanban (drag & drop) | ✅ |
| `/panel/mls` | MLS havuz sistemi | ✅ |
| `/panel/pdf-brosur` | PDF broşür oluşturucu | ✅ |
| `/kayit` | Acenta onboarding (4 adım) | ✅ |
| `/fiyatlar` | SaaS fiyatlandırma | ✅ |
| `/sehir/istanbul` | İstanbul landing | ✅ |
| `/sehir/ankara` | Ankara landing | ✅ |
| `/sehir/izmir` | İzmir landing | ✅ |
| `/sehir/bodrum` | Bodrum landing | ✅ |
| `/sehir/antalya` | Antalya landing | ✅ |
| `/sehir/bursa` | Bursa landing | ✅ |
| `/sehir/cesme` | Çeşme landing | ✅ |
| `/sehir/gaziantep` | Gaziantep landing | ✅ |
| `/sehir/mersin` | Mersin landing | ✅ |
| `/sehir/trabzon` | Trabzon landing | ✅ |
| `/muzayede` | Canlı müzayede | ✅ |
| `/admin` | Admin panel | ✅ |
| `/api/atlas` | Atlas AI streaming route handler | ✅ |

---

## 🤖 Atlas AI Nasıl Çalışır?

`/api/atlas/route.ts` — 3 aşamalı pipeline:

1. **NLS Parse** — Türkçe sorguyu JSON filtresine çevirir (claude-sonnet-4-6)
   ```
   "Kadıköy'de 3+1, bütçem 9M" → { city: "Kadıköy", rooms: "3+1", maxPrice: 9000000 }
   ```
2. **LISTINGS Filtre** — Kriterlere uyan ilanları LISTINGS array'den seçer
3. **Streaming Yanıt** — Claude ile SSE streaming konuşma, inline ilan kartları

Atlas chat'te: gerçek zamanlı `▋` cursor, Enter ile gönder, suggest chips.

---

## 📋 Sprint Durumu — 16 Haziran 2026

### ✅ Tamamlandı

| Yapı | İçerik |
|------|--------|
| **Design Port** | Hi-fi tasarım prototipi → Next.js |
| **Faz 1** | CRM Kanban, Acenta Onboarding |
| **Faz 2** | MLS sayfaları, Atlas AI gerçek API |
| **Faz 3** | PDF Broşür, Fiyatlar sayfası, 10 şehir SEO landing |

### 🔲 Sıradaki (Faz 4+)

| Görev | Öncelik | Notlar |
|-------|---------|--------|
| Ödeme / abonelik akışı | **P0** | Iyzico entegrasyonu, `/api/odeme` |
| Depozito Güvence akışı | **P0** | `/panel/depozito`, escrow |
| e-İmza entegrasyonu | **P0** | e-Güven API |
| Acenta onboarding — magic link gerçek impl | **P1** | Şu an mock |
| WhatsApp toplu kampanya | **P1** | `/panel/whatsapp` |
| SCRIBE içerik fabrikası | **P1** | `/panel/icerik` — blog, sosyal, YouTube |
| PDF gerçek Puppeteer | **P2** | Şu an önizleme mock |
| Admin şehir + koordinatör yönetimi | **P2** | `/admin/sehirler` |
| TicariMetre | **P2** | Ticari ilan kategorileri |
| Harita katmanları | **P2** | PostGIS + MapLibre |
| FILTERRA.AI B2B API | **P3** | Banka pilot |
| Mobile app | **P3** | React Native veya PWA |

---

## 💰 SaaS Fiyatlandırma

| Plan | Fiyat | Hedef |
|------|-------|-------|
| Ücretsiz | 0 ₺/ay | Deneme, 3 ilan |
| Pro | 990 ₺/ay | Bireysel danışman |
| Kurumsal | 2.490 ₺/ay | Büyüyen acentalar |
| Enterprise | 5.990 ₺/ay | Çok şubeli kurumsal |

Yıllık ödemede %20 indirim. İlk 14 gün ücretsiz.

---

## 🏙️ 10 Şehir Pilot

| Şehir | Slug | Ort. Fiyat | Yıllık Trend |
|-------|------|-----------|--------------|
| İstanbul | `istanbul` | 6,8M ₺ | +%9,4 |
| Ankara | `ankara` | 3,2M ₺ | +%7,1 |
| İzmir | `izmir` | 4,1M ₺ | +%11,2 |
| Bodrum | `bodrum` | 18,5M ₺ | +%14,8 |
| Antalya | `antalya` | 5,2M ₺ | +%13,5 |
| Bursa | `bursa` | 2,9M ₺ | +%8,6 |
| Çeşme | `cesme` | 12M ₺ | +%16,2 |
| Gaziantep | `gaziantep` | 1,8M ₺ | +%6,8 |
| Mersin | `mersin` | 2,1M ₺ | +%7,9 |
| Trabzon | `trabzon` | 2,4M ₺ | +%12,1 |

---

## 🎨 CSS Design System

`app/globals.css` — ~2400 satır. Bölümler:

```
Hero, search, chips           → Ana sayfa
Stats, RitualStrip            → İstatistikler, 7 adım
Cards, ListingCard            → İlan kartları
Filters, map                  → İlan listesi filtreleri
Detail, gallery               → İlan detayı
Partner, pmcard, plisting     → Panel bileşenleri
CRM board, col, card          → CRM Kanban
MLS tabs, commission          → MLS sistemi
Atlas chat, msg-*             → AI chat
Onboarding, pricing-*        → Kayıt, fiyatlar
PDF preview, controls         → PDF broşür
City hero, stats, grid        → Şehir landing
```

---

## 📎 Strateji Dokümanları

- `docs/MARKET-ATTACK-v5.md` — Rightmove/Zoopla/LoopNet Türkiye strateji, sprint takvimi, gelir modeli
- `docs/PANEL-DESIGN-v1.md` — Sahibinden Ofisim analizi, 7fil panel üstünlük haritası

---

## 🌿 Git

```bash
# Aktif branch
git checkout claude/friendly-curie-d64CC

# PR
# https://github.com/fevzitorun/connective-hub-monorepo/pull/1
```

---

*Connective Hub Dijital Teknolojiler Ltd. Sti. — 7fil.com.tr*
*"Hortumu yukariya donuk fil bereket getirir; yedi fil ise yeni bir kapinin acilisina eslik eder."*
