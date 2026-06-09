# 7fil.com.tr — MASTER PLAN v3.0
### Connective Hub Dijital Teknolojiler Ltd. Şti.
> **Son Güncelleme:** 24 Mayıs 2026 · **Versiyon:** 3.0.0-sprint2  
> *Türkiye'nin entegre gayrimenkul ekosistemi — İlan · Hukuk · Finans · Müzayede · Yapay Zeka*

---

## 📋 İçindekiler

1. [Proje Durumu (Genel Bakış)](#1-proje-durumu)
2. [Mimari Harita](#2-mimari-harita)
3. [Modül Durumu — Tam Liste](#3-modül-durumu)
4. [Sprint 2 — Tamamlanan İş](#4-sprint-2-tamamlanan)
5. [Sprint 3 — Yapılacaklar Yol Haritası](#5-sprint-3-yol-haritası)
6. [Yeni Nesil Arama Mimarisi (Google I/O 2026 İlham)](#6-yeni-nesil-arama)
7. [AI Agent Mimarisi — 7fil Agent Ekosistemi](#7-ai-agent-ekosistemi)
8. [GitHub Eklenti Önerileri](#8-github-eklentileri)
9. [Veritabanı Şema Özeti](#9-veritabanı-özeti)
10. [Deployment & Ortam](#10-deployment)

---

## 1. Proje Durumu

```
Platform Adı : 7fil.com.tr
Şirket       : Connective Hub Dijital Teknolojiler Ltd. Şti.
Monorepo     : github.com/fevzitorun/connective-hub-monorepo
API Versiyonu: 0.1.0 (NestJS 10 + Fastify + TypeORM + PostgreSQL/PostGIS)
Frontend     : Next.js 14 (web-7fil + partner-portal)
Mobile       : Expo (React Native)
İnfra        : Railway (API) · Vercel (Web) · Cloudflare R2 (Dosya)
```

### Genel İlerleme

| Katman | Durum | Tamamlanma |
|--------|-------|-----------|
| **Core API (Auth, Users, Listings)** | ✅ Canlı | %100 |
| **Arama & Filtreleme** | ✅ Canlı | %90 |
| **FILTERRA.AI** | ✅ Aktif | %85 |
| **Hukuk Modülü** | ✅ Tamamlandı | %90 |
| **Finans & Sigorta** | ✅ Tamamlandı | %85 |
| **Müzayede Sistemi** | ✅ Canlı | %95 |
| **White-Label / SaaS** | ✅ Tamamlandı | %80 |
| **Atlas AI** | ✅ Aktif | %75 |
| **Partner Portal** | ✅ Temel | %70 |
| **MLS Sistemi (Modül B)** | ✅ **Sprint 2'de tamamlandı** | %100 |
| **Property Management** | 🔶 Tasarlandı | %10 |
| **Depozito Güvence (FinTech)** | 🔶 Tasarlandı | %10 |
| **PDF Broşür Motoru** | 🔶 Tasarlandı | %5 |
| **Yeni Nesil Arama (AI Mode)** | 🆕 Planlandı | %0 |
| **7fil Agent Ekosistemi** | 🆕 Planlandı | %0 |

---

## 2. Mimari Harita

```
connective-hub-monorepo/
├── apps/
│   ├── api/                          ← NestJS 10 + Fastify (Railway)
│   │   ├── src/
│   │   │   ├── admin/               ✅ Panel yönetimi
│   │   │   ├── agency/              ✅ Ajans CRUD
│   │   │   ├── analytics/           ✅ İstatistikler
│   │   │   ├── atlas/               ✅ AI Asistan (Claude/GPT)
│   │   │   ├── auction/             ✅ Müzayede + WebSocket
│   │   │   ├── auth/                ✅ JWT + Refresh + KVKK
│   │   │   ├── filterra/            ✅ 8 AI Agent
│   │   │   ├── finance/             ✅ Mortgage + Sigorta + İyzico
│   │   │   ├── legal/               ✅ Tapu + Hukuki kontrol
│   │   │   ├── listings/            ✅ PostGIS + Meilisearch
│   │   │   ├── mail/                ✅ E-posta + Push + Scheduler
│   │   │   ├── mls/                 ✅ MLS Portföy Paylaşımı (Sprint 2)
│   │   │   ├── partner/             ✅ Partner referral + komisyon
│   │   │   ├── search/              ✅ Meilisearch + Kayıtlı aramalar
│   │   │   ├── ticari/              ✅ TicariMetre piyasa analizi
│   │   │   ├── users/               ✅ Kullanıcı + KVKK audit
│   │   │   └── whitelabel/          ✅ White-label branding
│   │   └── db/
│   │       └── init.sql             ✅ 895 satır (34 tablo, 53 enum, 1 view)
│   │
│   ├── web-7fil/                     ← Next.js 14 (Vercel)
│   │   └── src/
│   │       ├── app/                 ✅ 35+ sayfa
│   │       └── components/          ✅ 16 component
│   │
│   ├── partner-portal/               ← Next.js 14 (Vercel)
│   │   └── src/
│   │       └── app/dashboard/       ✅ 6 sayfa
│   │
│   └── mobile/                       ← Expo React Native
│       └── src/                     ✅ 10 ekran + push notification
│
└── packages/
    ├── ui/                           ✅ 6 shared component
    └── types/                        ✅ Shared TypeScript types
```

---

## 3. Modül Durumu — Tam Liste

### ✅ TAMAMLANAN MODÜLLER

---

#### Modül 1 — Authentication & Kullanıcı Yönetimi
**Dosyalar:** `apps/api/src/auth/` (11 dosya) · `apps/api/src/users/` (6 dosya)

- JWT Access + Refresh Token (HttpOnly cookie)
- Roller: `buyer · agency · agent_person · lawyer · bank · insurer · partner · admin`
- KVKK audit log — tüm işlemler kayıt altında
- TC Kimlik alanı, şifre sıfırlama akışı
- Push token yönetimi (iOS · Android · Web)

**Eksik:** E-posta doğrulama (e-posta gönderimi var ama OTP akışı yok)

---

#### Modül 2 — İlan Yönetimi
**Dosyalar:** `apps/api/src/listings/` (8 dosya) · `apps/web-7fil/src/app/ilan/`

- PostGIS GEOGRAPHY(POINT, 4326) — coğrafi arama (`ST_DWithin`)
- Meilisearch full-text + filtreleme entegrasyonu
- Fotoğraf yükleme (Cloudflare R2, max 20/ilan)
- WhatsApp deep link + QR kod otomatik üretimi
- İlan kategorileri, oda sayısı, bina yaşı, tüm filtreler
- Otomatik 15 günlük son kullanma tarihi
- Harita görünümü (Leaflet/MapBox)

**Eksik:** Video yükleme, 360° sanal tur, karanlık mod

---

#### Modül 3 — Arama & Keşif Motoru
**Dosyalar:** `apps/api/src/search/` (5 dosya)

- Meilisearch entegrasyonu (Turkish dil desteği + pg_trgm)
- PostGIS radius arama (km bazlı)
- Kayıtlı aramalar + e-posta/WhatsApp uyarısı
- Filtreleme: şehir, ilçe, mahalle, tip, fiyat, alan, oda sayısı
- Sıralama: fiyat asc/desc, alan, yayın tarihi

**Eksik:** Doğal dil arama (NLS) — Sprint 3'te gelecek

---

#### Modül 4 — FILTERRA.AI (8 Ajan)
**Dosyalar:** `apps/api/src/filterra/` (12 dosya)

| Ajan | Görev | Durum |
|------|-------|-------|
| `listing_writer` | Oto. ilan açıklaması üretir | ✅ |
| `title_optimizer` | SEO-optimize başlık önerir | ✅ |
| `valuation` | Min/Max değer tahmini | ✅ |
| `legal_precheck` | Tapu riski ön analizi | ✅ |
| `neighborhood` | Mahalle analizi (okul, ulaşım, AVM) | ✅ |
| `market_trend` | Piyasa trend raporu | ✅ |
| `photo_description` | Fotoğraf → metin tanımı | ✅ |
| `translation` | Çok dilli içerik (EN/AR/RU) | ✅ |

---

#### Modül 5 — Hukuki Doğrulama (Legal)
**Dosyalar:** `apps/api/src/legal/` (6 dosya) · `apps/web-7fil/src/app/panel/hukuk/`

- Avukat atama akışı
- Belge yükleme: tapu, iskan, ruhsat, kadastro, vekaletname, DASK
- Risk skoru (0-100) + avukat notları
- Mülk sertifikası üretimi (SHA-256 hash doğrulama)
- Sertifika badge'i public ilanlar üzerinde görünür
- Sertifika durumları: `pending · issued · expired · revoked`

---

#### Modül 6 — Finans & Sigorta
**Dosyalar:** `apps/api/src/finance/` (7 dosya) · `apps/web-7fil/src/components/MortgageCalculator.tsx`

- Mortgage hesaplayıcı (konvansiyonel + İslami)
- Mortgage lead yönetimi (banka yönlendirmesi)
- DASK + Konut sigorta teklifi
- İyzico 3DS ödeme entegrasyonu
- Webhook güvenli işleme
- Abonelik planları: `free · pro · corporate · enterprise`

---

#### Modül 7 — Müzayede Sistemi
**Dosyalar:** `apps/api/src/auction/` (5 dosya) · `apps/web-7fil/src/app/muzayede/`

- WebSocket (Socket.IO) real-time teklif akışı
- Otomatik teklif (auto-bid) mantığı
- Zamanlayıcı: scheduled → active → ended otomasyonu
- Reserve fiyat, min artış, "Hemen Al" özelliği
- WhatsApp bildirim entegrasyonu

---

#### Modül 8 — White-Label / SaaS Marka Oluşturucu
**Dosyalar:** `apps/api/src/whitelabel/` (4 dosya) · `apps/web-7fil/src/app/s/[subdomain]/`

- Subdomain bazlı ajans siteleri (`ajansadi.7fil.com.tr`)
- Renk, logo, font, hero içerik özelleştirme
- Custom domain desteği (DNS doğrulama)
- SEO başlık/açıklama, sosyal medya linkleri
- 7fil rozeti göster/gizle seçeneği

---

#### Modül 9 — TicariMetre (Ticari Gayrimenkul Analizi)
**Dosyalar:** `apps/api/src/ticari/` (5 dosya) · `apps/web-7fil/src/app/ticari/`

- Piyasa anlık görüntüsü (m² fiyat ortalamaları, medyan, min/max)
- Yatırım getirisi hesaplayıcı
- Şehir/ilçe bazlı karşılaştırmalı analiz
- Periyodik snapshot otomasyonu

---

#### Modül 10 — Atlas AI Asistan
**Dosyalar:** `apps/api/src/atlas/` (3 dosya) · `apps/web-7fil/src/app/panel/atlas/`

- Konuşma hafızası (session bazlı)
- Gayrimenkul özelinde sistem promptu
- Kullanıcı bağlamına göre kişiselleştirilmiş yanıt
- Mevcut ilan verisiyle entegrasyon

---

#### Modül 11 — Partner Portal
**Dosyalar:** `apps/api/src/partner/` (3 dosya) · `apps/partner-portal/`

- Referral yönetimi (listing_lead, mortgage_lead, agency_signup)
- Komisyon takibi (pending → approved → paid)
- API key yönetimi
- Embed widget üretici

---

#### Modül B (Sprint 2) — MLS Portföy Paylaşım Sistemi ⭐ YENİ
**Dosyalar:** `apps/api/src/mls/` (9 dosya)

- Yetkili emlakçı ilanı MLS havuzuna açar
- Komisyon tipleri: yüzde (%3.5) veya sabit TL
- İşbirlikçi emlakçı başvurusu → onay/ret akışı
- `closeDeal()` — PostgreSQL transaction ile komisyon split hesaplama
- 10 REST endpoint (tam Swagger dokümantasyonu)
- SQL: 3 tablo, 4 enum, 1 view, 3 UNIQUE index, 3 trigger
- Partner portal "Havuzdaki Portföyler" sekmesine hazır

---

### 🔶 TASARLANDI / KISMEN BAŞLANDI

#### Modül C — Property Management & Mülk Sağlık Skoru
**Hedef:** Ev sahiplerini platforma kilitleyecek en güçlü özellik

**Planlanan:**
- Kira sözleşmesi başladığında 6 aylık otomatik denetim görevi
- Kontrolör mobil üzerinden oda fotoğrafları çeker
- FILTERRA.AI check-in vs. kontrol fotoğraflarını karşılaştırır
- `health_score` (0-100) otomatik üretilir
- Hasar tespiti → depozito modülü tetiklenir

**Gerekli tablolar:** `property_contracts`, `inspection_tasks`, `inspection_rooms`, `room_photos`, `health_scores`

---

#### Modül D — Depozito Güvence & FinTech Escrow
**Hedef:** Türkiye'nin en büyük kiracı-ev sahibi kavgasını çözmek

**Planlanan:**
- 3 model: Nakit Escrow / Teminat Mektubu / Depozito Kredisi
- Avukat onaylı sözleşme (e-Güven imza entegrasyonu)
- Çıkış akışı: hasar raporu → bloke çözme / itiraz yönetimi
- `locked` → `released` geçişi yalnızca hasar raporu onayı ile

**Gerekli tablolar:** `deposit_agreements`, `deposit_transactions`, `deposit_disputes`

---

#### Modül A — PDF Broşür & Yatırım Raporu Motoru
**Hedef:** Tek tıkla kurumsal kalitede ilan broşürü

**Planlanan:**
- NestJS + Puppeteer servisi
- `/listings/:id/pdf` endpoint
- FILTERRA.AI mahalle analizi dahil
- 7fil design tokens (`--gold`, `--ink`, `Playfair Display`) uyumu

---

### 🆕 SPRINT 3 — PLANLANMAKTA

#### Modül E — Yeni Nesil Arama (AI Search)
*Google I/O 2026 ilhamıyla — detay Bölüm 6'da*

#### Modül F — 7fil Agent Ekosistemi
*Detay Bölüm 7'de*

---

## 4. Sprint 2 — Tamamlanan İş

### Yazılan Dosyalar

```
apps/api/src/mls/
  ├── entities/mls-listing.entity.ts   → 3 TypeORM entity, 6 enum
  ├── dto/create-mls-listing.dto.ts    → İlanı havuza açma
  ├── dto/join-mls-listing.dto.ts      → İşbirlikçi başvurusu
  ├── dto/review-collaboration.dto.ts  → Onayla/Reddet
  ├── dto/close-mls-deal.dto.ts        → İşlemi kapat
  ├── dto/mls-pool-filters.dto.ts      → Havuz listeleme filtresi
  ├── mls.service.ts                   → 10 iş metodu
  ├── mls.controller.ts                → 10 JWT endpoint
  └── mls.module.ts                    → NestJS modülü

apps/api/db/init.sql                   → +230 satır MLS şeması eklendi
apps/api/src/app.module.ts             → MlsModule kaydı eklendi
```

### Kritik İş Kuralları (Güvenceler)
- `authorized_agent_share + collaborator_share = 100` — SQL CHECK kısıtı
- Bir ilan → tek aktif MLS kaydı — PARTIAL UNIQUE INDEX
- Aynı emlakçı aynı ilana çift başvuru — PARTIAL UNIQUE INDEX
- `closeDeal()` — atomik PostgreSQL transaction (commit veya tam rollback)
- `locked` depozito → `released` geçişi — yalnızca hasar raporu onayı

---

## 5. Sprint 3 — Yol Haritası

### Öncelik Sırası

```
P0 (Bu sprint):
  ├── Modül A: PDF Broşür Motoru (Puppeteer)
  ├── Modül C: Property Management temel akış
  └── UI: MLS "Havuzdaki Portföyler" sekmesi (partner-portal)

P1 (Sonraki sprint):
  ├── Modül D: Depozito Güvence Sistemi
  ├── Modül E: Yeni Nesil Arama (AI Mode)
  └── UI: Çevre Analizi komponenti (PostGIS + transit verisi)

P2 (Gelecek kuartal):
  ├── Modül F: 7fil Agent Ekosistemi
  ├── e-Güven e-imza entegrasyonu
  └── Uluslararası listeleme (TR/EN/AR/RU)
```

### Sprint 3 Detay Görevleri

| # | Görev | Modül | Tahmini Süre |
|---|-------|-------|-------------|
| S3-01 | Puppeteer servis altyapısı (NestJS) | A | 2 gün |
| S3-02 | PDF broşür HTML şablonu (design tokens) | A | 1 gün |
| S3-03 | `/listings/:id/pdf` endpoint | A | 1 gün |
| S3-04 | `property_contracts` tablosu + entity | C | 1 gün |
| S3-05 | `inspection_tasks` scheduler | C | 2 gün |
| S3-06 | `room_photos` + FILTERRA diff analizi | C | 3 gün |
| S3-07 | `health_score` hesaplama algoritması | C | 1 gün |
| S3-08 | Partner portal MLS sekmesi (Next.js) | B-UI | 2 gün |
| S3-09 | MLS toggle ilan oluşturma formuna | B-UI | 1 gün |
| S3-10 | Çevre analizi komponenti (PostGIS) | UI | 2 gün |
| S3-11 | AI Search NLS endpoint | E | 3 gün |
| S3-12 | Search Agent altyapısı | E | 4 gün |

---

## 6. Yeni Nesil Arama Mimarisi

> **Kaynak:** Google I/O 2026 — "A new era for AI Search" (19 Mayıs 2026)
> Google'ın AI Mode, 1 yılda 1 milyar kullanıcıya ulaştı. Sorgular her çeyrekte ikiye katlanıyor.
> 7fil bu trendi Türk gayrimenkul sektörüne taşıyacak.

### 6.1 Google'ın Açıkladığı Özellikler → 7fil Uyarlaması

| Google I/O 2026 Özelliği | 7fil Uyarlaması |
|--------------------------|-----------------|
| **Gemini 3.5 Flash** — yeni default AI modeli | Claude 3.5 Sonnet / Gemini 2.0 Flash hybrid |
| **Intelligent Search Box** — multimodal (text + image + video + file) | 7fil Akıllı Arama — fotoğraf yükle, "buna benzer ev bul" |
| **AI Mode** — konuşma bazlı arama | Atlas AI entegrasyonu → doğal dil → ilan eşleştirme |
| **Information Agents** — 24/7 arka planda tarama | 7fil Uyarı Ajanları — kriterlere uyan ilan çıkınca anlık bildirim |
| **Agentic Booking** — kriterlere göre otomatik randevu | 7fil Gezici Planlayıcı — "Kadıköy'de Cumartesi öğleden sonra 3 ilan gez" |
| **Generative UI** — sorguya özel dinamik arayüz | Ilan sayfası dinamik bölümler (yatırım modu / kiracı modu / karşılaştırma) |
| **Custom Dashboards ("mini apps")** | 7fil Kişisel Pano — "İstanbul yatırım takip" tracker |
| **Personal Intelligence** — Gmail, Photos bağlantısı | 7fil Hafıza — önceki aramalar, ziyaretler, tercihler kalıcı bağlam |

### 6.2 7fil AI Search Mimarisi (Modül E)

```
Kullanıcı Girdisi
  │
  ├── Metin          ─┐
  ├── Fotoğraf       ─┤──→ [Multimodal Parser]
  ├── Ses (ileride)  ─┤         │
  └── Dosya (PDF)   ─┘         ▼
                         [Atlas AI — NLS Engine]
                              │
                    ┌─────────┴─────────┐
                    │                   │
              [Intent Parser]    [Filter Extractor]
                    │                   │
              Niyet tespiti:     Yapısal filtreler:
              • Satın alma       • şehir, ilçe
              • Kiralama         • fiyat aralığı
              • Yatırım          • oda sayısı
              • Karşılaştırma    • alan m²
              • Mahalle araştırma│
                    │           │
                    └─────┬─────┘
                          ▼
                  [Meilisearch Query Builder]
                          │
                          ▼
                  [PostGIS Spatial Filter]
                          │
                          ▼
                  [FILTERRA Enrichment]
                  • Mahalle skoru
                  • Yatırım skoru
                  • Hukuki risk
                          │
                          ▼
                  [Generative Results UI]
                  • Standart liste
                  • Harita modu
                  • Yatırım karşılaştırma
                  • AI özet kartları
```

### 6.3 Search Agent Altyapısı (7fil Uyarı Ajanları)

```typescript
// Konsept: apps/api/src/search/search-agent.service.ts

interface SearchAgent {
  id: string
  userId: string
  name: string                    // "Kadıköy 3+1 Takibi"
  criteria: {
    naturalLanguageQuery: string  // "Kadıköy'de 4.5M altı 3+1, asansörlü"
    parsedFilters: ListingFilters
    notifyChannels: ('push' | 'email' | 'whatsapp')[]
  }
  schedule: 'realtime' | 'daily' | 'weekly'
  lastChecked: Date
  isActive: boolean
}
```

**Çalışma Döngüsü:**
1. Kullanıcı doğal dille kriter tanımlar
2. Atlas AI → yapısal filtreye çevirir
3. Scheduler her yeni ilan indekslendiğinde ajanları tetikler
4. Kriterleri karşılayan ilan → push/email/WhatsApp bildirimi
5. Kullanıcı panelinde "Ajanım buradaydı" log'u

### 6.4 Teknik Gereksinimler

```
Yeni bağımlılıklar:
  • @google/generative-ai VEYA @anthropic-ai/sdk (zaten var: Atlas AI)
  • multer (fotoğraf parse) — multimodal input
  • sharp (görüntü önişleme)
  • redis/bullmq (agent kuyruğu)

Yeni endpoint'ler:
  POST /api/v1/search/ai          → Doğal dil arama
  POST /api/v1/search/visual      → Fotoğrafla arama
  POST /api/v1/search/agents      → Ajan oluştur
  GET  /api/v1/search/agents      → Ajanları listele
  DELETE /api/v1/search/agents/:id → Ajanı sil

Yeni DB tabloları:
  search_agents    → kullanıcının kayıtlı AI ajanları
  agent_matches    → ajan ↔ ilan eşleşme log'u
  search_sessions  → konuşma bazlı arama geçmişi
```

---

## 7. AI Agent Ekosistemi — 7fil Agent Mimarisi

> Platformun her katmanında çalışan, birbirleriyle haberleşen uzman AI ajanları.

### 7.1 Mevcut Ajanlar (FILTERRA.AI — Aktif)

| Ajan ID | Ad | Görev |
|---------|-----|-------|
| `listing_writer` | **İlan Yazarı** | Fotoğraf + özelliklerden otomatik ilan metni |
| `title_optimizer` | **Başlık Optimizatörü** | SEO + tıklanma oranı optimize başlık |
| `valuation` | **Değerleme Uzmanı** | Piyasa verisiyle min/max fiyat aralığı |
| `legal_precheck` | **Hukuki Ön Kontrol** | Tapu belgelerinden risk taraması |
| `neighborhood` | **Mahalle Analisti** | Okul, ulaşım, AVM, güvenlik puanı |
| `market_trend` | **Piyasa Takipçisi** | Bölgesel trend + fiyat momentum analizi |
| `photo_description` | **Fotoğraf Anlatıcısı** | Görüntü → detaylı metin tanımı |
| `translation` | **Çevirmen** | İlan içeriği EN/AR/RU çevirisi |

### 7.2 Yeni Ajanlar — Sprint 3+ (Önerilen)

---

#### Ajan: `ATLAS` — Ana Konuşma Ajanı ⭐
**Dosya:** `apps/api/src/atlas/` (mevcut, genişletilecek)

```
Görev: Kullanıcının "gayrimenkul danışmanı"
  → Bütçe analizi yapar
  → Mahalle karşılaştırır
  → Yatırım senaryoları sunar
  → Avukat/banka yönlendirmesi yapar
  → Arama ajanı oluşturur

Araçlar (Tools):
  • search_listings(filters)
  • get_neighborhood_score(district)
  • calculate_mortgage(price, down, years)
  • get_market_trend(city, propertyType)
  • create_search_agent(criteria)
  • get_legal_certificate(listingId)
```

---

#### Ajan: `INSPECTOR` — Mülk Sağlık Ajanı 🆕
**Dosya:** `apps/api/src/filterra/agents/inspector.agent.ts` (yeni)

```
Görev: Property Management Modül C'nin AI beyni
  → Check-in fotoğrafları ile kontrol fotoğraflarını karşılaştırır
  → Oda bazlı yıpranma tespiti (COMPUTER VISION)
  → health_score (0-100) üretir
  → Hasar tespit raporu hazırlar
  → Depozito kesmesi için gerekçe oluşturur

Giriş: { room_tag, checkin_photos[], inspection_photos[] }
Çıkış: { health_score, damage_detected, damage_severity, report_text }

Model: GPT-4o Vision veya Gemini 2.0 Flash (multimodal)
```

---

#### Ajan: `SCOUT` — Arama Ajanı 🆕
**Dosya:** `apps/api/src/search/search-agent.service.ts` (yeni)

```
Görev: 24/7 arka planda çalışan ilan takip ajanı
  → Kullanıcı kriterlerini doğal dilden parse eder
  → Her yeni ilan indekslendiğinde kriterleri kontrol eder
  → Eşleşme bulunca → push/email/WhatsApp bildirim gönderir
  → Haftalık "Bu hafta X yeni ilan bulundu" özet raporu

Tetikleyici: Yeni ilan publish edildiğinde (event driven)
```

---

#### Ajan: `BROKER` — MLS Eşleştirme Ajanı 🆕
**Dosya:** `apps/api/src/mls/mls-broker.agent.ts` (yeni)

```
Görev: MLS havuzunda akıllı eşleştirme
  → İşbirlikçi emlakçıları ilana uygunluğa göre sıralar
  → Geçmiş işlemlere bakarak "başarı oranı" hesaplar
  → Yetkili emlakçıya "Bu ajans benzer ilanlarda %80 kapandı" bilgisi sunar
  → Komisyon anlaşmazlığı arabuluculuğu

Giriş: { mlsListingId, collaboratorPool[] }
Çıkış: { rankedCollaborators[], matchScore, recommendation }
```

---

#### Ajan: `NOTARY` — Sözleşme Hazırlama Ajanı 🆕
**Dosya:** `apps/api/src/legal/notary.agent.ts` (yeni)

```
Görev: Hukuki belge otomasyonu
  → Kira sözleşmesi şablonu doldurur (taraflar, tutar, depozito maddeleri)
  → Depozito güvence maddelerini ekler
  → KVKK uyumluluk kontrolü yapar
  → Avukatlara özet + risk raporu sunar
  → e-Güven imza için belge paketler

Giriş: { landlordId, tenantId, listingId, depositModel, terms }
Çıkış: { contractDraft, riskSummary, signingPackage }
```

---

#### Ajan: `VALUATOR` — Gerçek Zamanlı Değerleme Ajanı 🆕
**Dosya:** `apps/api/src/filterra/agents/valuator.agent.ts` (genişletme)

```
Görev: Anlık piyasa bazlı değerleme
  → TicariMetre verisi + aktif ilanlar karşılaştırması
  → "Bu ilan piyasanın %12 altında" uyarısı
  → Yatırımcıya ROI hesabı (kira getiri oranı)
  → Banka için LTV hesabı (mortgage modülü entegrasyonu)

Tetikleyici: İlan yayınlandığında + günlük piyasa güncellemesinde
```

---

#### Ajan: `HERALD` — İletişim & Bildirim Ajanı 🆕
**Dosya:** `apps/api/src/mail/herald.agent.ts` (mail scheduler genişlemesi)

```
Görev: Tüm platform bildirimlerini kişiselleştirir
  → "Ahmet Bey, geçen hafta baktığınız Kadıköy ilanı fiyat düşürdü"
  → Haftalık kişisel piyasa özeti
  → Müzayede son gün hatırlatması
  → MLS başvuru durumu güncellemeleri
  → Hukuki vaka durum bildirimleri

Kanallar: E-posta · WhatsApp · Push · SMS (ileride)
```

---

### 7.3 Agent Orkestrasyon Akışı

```
Kullanıcı: "500K bütçem var, Kadıköy'de yatırımlık bir şey arıyorum"
                            │
                      [ATLAS Ajanı]
                            │
              ┌─────────────┼─────────────┐
              │             │             │
        [SCOUT Ajanı]  [VALUATOR]  [Neighborhood]
        Kriterleri      Piyasa        Mahalle
        kaydet          analizi       puanı
              │             │             │
              └─────────────┼─────────────┘
                            │
                    [ATLAS — Sonuç Özeti]
                    "Kadıköy'de 450-500K
                    arası 3 ilan bulduk.
                    En iyi yatırım skoru:
                    Moda'daki 2+1 (ROI %4.8).
                    SCOUT ajanı kurulsun mu?"
```

---

## 8. GitHub Eklenti Önerileri

### 8.1 Kod Kalitesi & Güvenlik

| Eklenti | Açıklama | Öncelik |
|---------|----------|---------|
| **Dependabot** | Bağımlılık güvenlik güncellemeleri (GitHub yerleşik) | 🔴 Kritik |
| **CodeQL** | Otomatik güvenlik açığı analizi (GitHub Advanced Security) | 🔴 Kritik |
| **Snyk** | npm/pip bağımlılıkları CVE taraması | 🔴 Kritik |
| **SonarCloud** | Kod kalitesi, teknik borç, test coverage | 🟡 Önemli |
| **ESLint GitHub Action** | PR'larda otomatik lint kontrolü | 🟡 Önemli |
| **Prettier Check** | Kod formatlama tutarlılığı | 🟢 İyi |

### 8.2 CI/CD & Deploy

| Eklenti | Açıklama | Öncelik |
|---------|----------|---------|
| **GitHub Actions** | Mevcut DEPLOY.md'de tanımlı — genişletilmeli | 🔴 Kritik |
| **Vercel GitHub App** | Her PR için preview deploy | 🔴 Kritik |
| **Railway GitHub App** | API otomatik deploy | 🔴 Kritik |
| **Turborepo Remote Cache** | Monorepo build hızlandırma (%80 daha hızlı) | 🟡 Önemli |
| **Chromatic** | Storybook + UI regression testi | 🟢 İyi |

### 8.3 Proje Yönetimi

| Eklenti | Açıklama | Öncelik |
|---------|----------|---------|
| **GitHub Projects** | Kanban + Sprint takibi (ücretsiz) | 🔴 Kritik |
| **Linear** | Eng-grade sprint yönetimi (Slack entegrasyonu) | 🟡 Önemli |
| **Notion GitHub Sync** | Dokümantasyon ↔ kod senkronizasyonu | 🟢 İyi |
| **Release Drafter** | Otomatik changelog üretimi | 🟡 Önemli |
| **Semantic Release** | Otomatik semver versiyonlama | 🟡 Önemli |

### 8.4 Test & Kalite Güvencesi

| Eklenti | Açıklama | Öncelik |
|---------|----------|---------|
| **Codecov** | Test coverage raporu (PR bazlı) | 🟡 Önemli |
| **Jest GitHub Action** | NestJS birim test otomasyonu | 🔴 Kritik |
| **Playwright** | E2E browser testi (Next.js sayfaları) | 🟡 Önemli |
| **k6 Load Test Action** | API yük testi (mortgage calc, arama vb.) | 🟢 İyi |
| **Lighthouse CI** | Web performans skoru (Core Web Vitals) | 🟡 Önemli |

### 8.5 Güvenlik & Uyumluluk

| Eklenti | Açıklama | Öncelik |
|---------|----------|---------|
| **Secret Scanning** | API key / token sızıntısı tespiti (GitHub yerleşik) | 🔴 Kritik |
| **GitGuardian** | Real-time credential leak tespiti | 🔴 Kritik |
| **OSSF Scorecard** | Açık kaynak güvenlik puanı | 🟡 Önemli |
| **Terrascan** | Infrastructure as Code güvenlik taraması | 🟢 İyi |

### 8.6 Geliştirici Deneyimi

| Eklenti | Açıklama | Öncelik |
|---------|----------|---------|
| **GitHub Copilot** | AI kod tamamlama (monorepo için özellikle güçlü) | 🟡 Önemli |
| **Cursor Rules** | `.cursorrules` — proje kuralları tanımı | 🟡 Önemli |
| **All Contributors** | `README` katkıcı listesi otomasyonu | 🟢 İyi |
| **Stale Bot** | Uzun süre bekleyen PR/Issue otomatik kapama | 🟢 İyi |
| **PR Size Labeler** | Büyük PR'ları işaretler (review kolaylığı) | 🟢 İyi |

### 8.7 Hemen Kurulacak GitHub Actions (Önerilir)

```yaml
# .github/workflows/ci.yml (mevcut DEPLOY.md'ye ek)

name: CI Pipeline
on: [push, pull_request]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install
      - run: pnpm turbo lint test --affected  # sadece değişen modüller

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: snyk/actions/node@master
        with:
          args: --all-projects

  api-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm --filter api tsc --noEmit
```

---

## 9. Veritabanı Şema Özeti

### Tablolar (34 tablo)

```
Çekirdek:
  users, kvkk_audit_log, agencies, subscriptions

İlan:
  listings, listing_photos, favorites, search_alerts, whatsapp_clicks

AI:
  filterra_reports, atlas_conversations, atlas_messages

Hukuk:
  legal_cases, legal_documents, property_certificates

Finans:
  mortgage_leads, insurance_quotes, payment_orders, iyzico_webhooks

Analiz:
  ticari_reports, ticari_market_snapshots

SaaS:
  agency_branding

Müzayede:
  auctions, auction_bids

İletişim:
  password_reset_tokens, push_tokens

Partner:
  partner_referrals, partner_commissions, partner_api_keys

MLS (Sprint 2 — YENİ):
  mls_listings, mls_collaborations, mls_commission_splits

Planlanan (Sprint 3):
  property_contracts, inspection_tasks, inspection_rooms,
  room_photos, health_scores,
  deposit_agreements, deposit_transactions, deposit_disputes,
  search_agents, agent_matches
```

### View'lar
- `mls_pool_view` — Partner portal MLS havuzu

### İndeksler: 70+ (spatial, GIN full-text, partial unique, composite)

---

## 10. Deployment & Ortam

### Servisler

| Servis | Platform | URL |
|--------|----------|-----|
| API (NestJS) | Railway | `api.7fil.com.tr` |
| Web (Next.js) | Vercel | `7fil.com.tr` |
| Partner Portal | Vercel | `partner.7fil.com.tr` |
| Dosya Deposu | Cloudflare R2 | `cdn.7fil.com.tr` |
| Full-text Arama | Meilisearch (Railway) | iç ağ |
| Veritabanı | PostgreSQL + PostGIS (Railway) | iç ağ |

### Gerekli Environment Variables

```env
# Veritabanı
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=
JWT_REFRESH_SECRET=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=

# Meilisearch
MEILISEARCH_HOST=
MEILISEARCH_API_KEY=

# İyzico
IYZICO_API_KEY=
IYZICO_SECRET_KEY=
IYZICO_BASE_URL=

# AI (FILTERRA + Atlas)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=      # Atlas AI için

# Mail
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

# WhatsApp Business API
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_ID=
```

### Deploy Akışı

```
git push main
    │
    ├── GitHub Actions: lint + test + type-check
    │
    ├── Railway: API otomatik deploy
    │       └── health check: /api/v1/health
    │
    └── Vercel: web-7fil + partner-portal preview → prod
```

---

## Sürüm Geçmişi

| Versiyon | Tarih | Değişiklikler |
|----------|-------|---------------|
| v1.0.0 | 2025 Q4 | İlk prototip — temel ilan + auth |
| v1.1.0 | 2026 Q1 | FILTERRA.AI, Müzayede, Hukuk, Finans |
| v2.0.0 | 2026 Q2 | White-label, TicariMetre, Partner Portal, Atlas AI |
| **v3.0.0** | **2026 Mayıs** | **MLS Sistemi (Sprint 2), Google I/O 2026 Search vizyonu** |
| v3.1.0 | 2026 Q3 | PDF Broşür, Property Management, Depozito Güvence |
| v4.0.0 | 2026 Q4 | AI Search Agents, 7fil Agent Ekosistemi, e-Güven |

---

*Connective Hub Dijital Teknolojiler Ltd. Şti. — 7fil.com.tr*  
*"Türkiye'nin entegre gayrimenkul ekosistemi"*
