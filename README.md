# 7fil.com.tr — Entegre Gayrimenkul Platformu

> Türkiye'de ev almak, satmak, kiralamak için tek platform.  
> İlan · AI Değerleme · Hukuki Doğrulama · Mortgage · Müzayede — hepsi bir arada.

---

## Genel Bakış

7fil, Sahibinden gibi geleneksel ilan portallarının ötesine geçerek;
- **FILTERRA.AI** ile otomatik ilan yazımı ve fiyat değerlemesi
- **Avukat onaylı** tapu ve hukuki doğrulama
- **İyzico 3DS** entegreli abonelik ve ödeme sistemi
- **Gerçek zamanlı müzayede** (WebSocket)
- **Mortgage karşılaştırma** ve sigorta teklifi
- **White-label subdomain SaaS** (emlak firmaları için)

sunan entegre bir gayrimenkul ekosistemi.

---

## Monorepo Yapısı

```
connective-hub-monorepo/
├── apps/
│   ├── api/               # NestJS 10 REST API (Fastify)
│   ├── web-7fil/          # Next.js 14 — 7fil.com.tr
│   ├── partner-portal/    # Next.js 14 — acenta/banka onboarding
│   └── mobile/            # Expo React Native
├── packages/
│   └── ui/                # Paylaşılan UI bileşenleri
├── MASTER-PLAN-v5.md      # Sprint planı (güncel durum burası)
├── CLAUDE.md              # Claude Code oturum rehberi
└── .github/workflows/     # CI/CD (GitHub Actions)
```

---

## Hızlı Başlangıç

### Gereksinimler

- Node.js 20+
- pnpm 11+
- PostgreSQL 16 + PostGIS
- Meilisearch v1.7

### Kurulum

```bash
# Bağımlılıkları yükle
pnpm install

# Env dosyalarını oluştur
cp .env.example .env
cp apps/web-7fil/.env.local.example apps/web-7fil/.env.local

# .env içindeki değerleri doldur (DB, JWT, API keys)

# DB şemasını oluştur
psql $DATABASE_URL -f apps/api/db/init.sql

# Geliştirme sunucularını başlat
pnpm --filter @7fil/api dev      # http://localhost:4000
pnpm --filter @7fil/web dev      # http://localhost:3000
```

### API Dokümantasyonu

Geliştirme modunda Swagger UI: `http://localhost:4000/api/docs`

---

## Ana Özellikler (Modüller)

| # | Modül | Açıklama |
|---|-------|----------|
| M01 | Auth | JWT + Refresh token, e-posta OTP, KVKK |
| M02 | Listings | İlan CRUD, fotoğraf (R2), CSV toplu yükleme |
| M03 | Search | Meilisearch — Türkçe tam metin, PostGIS harita |
| M04 | Agent Panel | Emlakçı dashboard, analitik |
| M05 | Buyer | Favoriler, arama alarmı, teklif gönderme |
| M06 | Billing | İyzico 3DS, abonelik yönetimi |
| M07 | Admin | Kullanıcı, ilan, ajans, içerik yönetimi |
| M08-M14 | FILTERRA.AI | 8 AI ajanı — içerik, değerleme, hukuk, fotoğraf |
| M12 | Atlas AI | Konuşma asistanı (Claude) |
| M15 | Legal | Avukat doğrulama, sertifika sistemi |
| M16 | Finance | Mortgage hesaplama, DASK + konut sigortası |
| M17 | Auction | Gerçek zamanlı müzayede (WebSocket) |
| M21 | White-Label | Subdomain SaaS, özel domain |
| M24 | Mobile | Expo React Native (iOS + Android) |

---

## Teknoloji Yığını

### Backend (`apps/api`)
- **Framework:** NestJS 10 + Fastify adapter
- **ORM:** TypeORM + PostgreSQL 16 (PostGIS coğrafi sorgular)
- **Arama:** Meilisearch v1.7 (Türkçe konfigürasyon)
- **Auth:** JWT (bcrypt hash) + SHA-256 token hash
- **Rate Limiting:** `@nestjs/throttler`
- **Zamanlama:** `@nestjs/schedule` (cron jobs)
- **Storage:** Cloudflare R2 (`@aws-sdk`)
- **Ödeme:** İyzico 3DS
- **E-posta:** SendGrid / Resend

### Frontend (`apps/web-7fil`)
- **Framework:** Next.js 14 App Router
- **Stil:** Tailwind CSS + özel design tokens
- **State:** Zustand
- **Harita:** Mapbox GL
- **Analytics:** PostHog + Sentry
- **Fontlar:** Playfair Display (başlık) + DM Sans (gövde)

---

## Deploy

| Servis | Platform | Branch |
|--------|----------|--------|
| API | Railway (Docker) | `main` |
| web-7fil | Vercel | `main` |
| partner-portal | Vercel | `main` |
| DB | Railway PostgreSQL | — |
| Arama | Railway (Meilisearch Docker) | — |
| Media | Cloudflare R2 | — |

GitHub Actions `main`'e her push'ta otomatik deploy başlatır.
Gerekli secrets: `RAILWAY_TOKEN`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID_WEB`

---

## Proje Durumu

**Sprint:** Hafta 2 tamamlandı (15 Haziran 2026)

- ✅ M01–M25 tüm modüller kodlandı
- ✅ 5 kritik kullanıcı akışı uygulandı
- ✅ TypeScript 0 hata (API + Web)
- ✅ 25 commit — GitHub `main` branch'de
- 🔴 Staging deploy aktif görev (Railway + Vercel)
- ⬜ Beta kullanıcılar (50 kişi) — staging sonrası

Detaylı sprint planı ve bloklayıcılar: [`MASTER-PLAN-v5.md`](MASTER-PLAN-v5.md)

---

## Lisans

Özel yazılım — Connective Hub Dijital Teknolojiler Ltd. Şti.  
Tüm hakları saklıdır.
