# CLAUDE.md — 7fil Monorepo Proje Rehberi

> Claude Code bu dosyayı her oturumda otomatik okur.
> Proje bağlamını buradan alarak kaldığı yerden devam eder.

---

## Proje Özeti

**7fil.com.tr** — Türkiye'nin entegre gayrimenkul platformu.
Ilan + Hukuk + AI Değerleme + Mortgage + Müzayede tek çatı altında.

**Kurucu:** Fevzi Torun (`uniradimaging@gmail.com`)
**Şirket:** Connective Hub Dijital Teknolojiler Ltd. Şti.
**Repo:** `https://github.com/fevzitorun/connective-hub-monorepo`
**Ana Plan:** `MASTER-PLAN-v5.md` (her sprint sonrası güncellenir)

---

## Monorepo Yapısı

```
connective-hub-monorepo/
├── apps/
│   ├── api/               NestJS 10 + Fastify + TypeORM + PostgreSQL/PostGIS
│   ├── web-7fil/          Next.js 14 App Router (ana kullanıcı sitesi)
│   ├── partner-portal/    Next.js 14 (acenta/banka onboarding)
│   └── mobile/            Expo React Native (8 ekran)
├── packages/
│   └── ui/                Paylaşılan Tailwind + component'lar
├── MASTER-PLAN-v5.md      Sprint planı ve proje durumu
├── MARKETING-PLAN.md      Pazarlama stratejisi
├── pnpm-workspace.yaml    pnpm v11 workspace config
└── .github/workflows/     CI (ci.yml) + Deploy (deploy.yml)
```

---

## Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| Backend | NestJS 10 + Fastify adapter |
| ORM | TypeORM + PostgreSQL 16 + PostGIS |
| Arama | Meilisearch v1.7 (Türkçe: 30 stopword, 14 synonym) |
| Auth | JWT Access (15m) + Refresh (7d) — SHA-256 hashed tokens |
| Ödeme | İyzico 3DS (`iyzico.service.ts`) |
| Storage | Cloudflare R2 via `@aws-sdk/s3-request-presigner` |
| Frontend | Next.js 14 App Router + Tailwind CSS + Zustand |
| Analytics | PostHog (App Router uyumlu) + Sentry (API + Web) |
| Zamanlama | `@nestjs/schedule` — listing expire (03:00) + token cleanup (04:00) |
| Package | pnpm v11 + Turborepo |
| TypeScript | 5.9.3 |

---

## Kritik Bilgiler (Önceki Oturumlarda Öğrenildi)

### TypeScript 5.9.3 + NestJS 10 Uyumsuzluğu
`apps/api/tsconfig.json`'a şunlar EKLENMELİ (zaten eklendi):
```json
"useDefineForClassFields": false,
"strictFunctionTypes": false,
"ignoreDeprecations": "5.0",
"moduleResolution": "node"
```
`@Version('1')` class decorator kullanma — NestJS 10 + TS 5.9'da kırılıyor.
Bunun yerine `main.ts`'de `enableVersioning({ defaultVersion: '1' })` kullan.

### Auth Store Yapısı (`apps/web-7fil/src/store/auth.ts`)
```typescript
interface AuthState {
  user: User | null
  accessToken: string | null   // 'token' DEĞİL, 'accessToken'
  setUser: (user: User) => void
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
}
```
`token` diye bir alan YOK. `accessToken` kullan.

### Fastify Adapter (API)
Express tiplerini import etme. `FastifyReply`/`FastifyRequest` kullan.
`.header()` kullan, `.setHeader()` değil.

### pnpm v11
`pnpm-workspace.yaml`'da `onlyBuiltDependencies` kullanılıyor (`allowBuilds` değil).
`pnpm-lock.yaml` v11 formatında — Dockerfile'da `pnpm@11` kullan.

### PostHog Provider
`posthog-js/react`'ın `PHProvider`'ı iki farklı `@types/react` versiyonu yüzünden
`ReactNode` tipi çakışması yaşatır. `PostHogProvider.tsx`'de explicit cast uygulandı.

---

## Geliştirme Komutları

```bash
# Tüm bağımlılıkları kur
pnpm install

# API'yi başlat (localhost:4000)
pnpm --filter @7fil/api dev

# Web'i başlat (localhost:3000)
pnpm --filter @7fil/web dev

# TypeScript kontrolü — API
node_modules/.bin/tsc --noEmit -p apps/api/tsconfig.json

# TypeScript kontrolü — Web
node_modules/.bin/tsc --noEmit -p apps/web-7fil/tsconfig.json

# Tüm paketleri build et
pnpm turbo build

# API testleri
pnpm --filter @7fil/api test
```

---

## Önemli Dosyalar

### API
| Dosya | Açıklama |
|-------|----------|
| `apps/api/src/main.ts` | Fastify bootstrap, versioning, CORS, Swagger |
| `apps/api/src/app.module.ts` | Tüm modül importları + ScheduleModule |
| `apps/api/src/auth/` | JWT, refresh, OTP email, şifre sıfırlama |
| `apps/api/src/listings/listings.service.ts` | CRUD + photo upload + expire cron |
| `apps/api/src/finance/iyzico.service.ts` | 3DS ödeme + abonelik aktivasyonu |
| `apps/api/src/search/search.service.ts` | Meilisearch TR config + indexleme |
| `apps/api/src/storage/storage.service.ts` | R2 upload/delete/presign |
| `apps/api/db/init.sql` | Tüm DB şeması (migrations yerine tek SQL) |

### Web (Next.js)
| Dosya | Açıklama |
|-------|----------|
| `apps/web-7fil/src/app/layout.tsx` | Root layout + PostHogProvider |
| `apps/web-7fil/src/app/(auth)/` | Kayıt, giriş, şifre sıfırlama sayfaları |
| `apps/web-7fil/src/app/panel/` | Emlakçı paneli (dashboard, ilanlar, abonelik...) |
| `apps/web-7fil/src/app/panel/ilanlar/[id]/page.tsx` | Fotoğraf yükleme + yayına alma |
| `apps/web-7fil/src/app/admin/` | Admin paneli (15 bölüm) |
| `apps/web-7fil/src/app/ilan/[id]/page.tsx` | İlan detay (SSR + JSON-LD) |
| `apps/web-7fil/src/app/ara/page.tsx` | Arama + harita + filtreleme |
| `apps/web-7fil/src/store/auth.ts` | Zustand auth store |
| `apps/web-7fil/src/lib/api.ts` | API client |
| `apps/web-7fil/src/components/PostHogProvider.tsx` | PostHog App Router wrapper |

---

## Sprint Durumu (15 Haziran 2026)

**Tamamlanan (Kod hazır + GitHub'da):**
- M01-M25 tüm modüller kodlandı
- 5 kritik kullanıcı akışı uygulandı:
  - Akış 1: Kayıt → E-posta OTP → Giriş
  - Akış 2: İlan Oluştur → Fotoğraf Yükle → Yayına Al
  - Akış 3: Arama → Harita → İlan Detay
  - Akış 4: İyzico 3DS → Abonelik Aktivasyon
  - Akış 5: Admin → İlan Moderasyonu
- TypeScript 0 hata (hem API hem web)
- GitHub: 25 commit, `main` branch

**Şu an aktif görev: Staging Deploy**
- Railway (API) → [railway.app](https://railway.app)
- Vercel (web-7fil) → [vercel.com](https://vercel.com)
- Detaylı rehber: `MASTER-PLAN-v5.md` Section 7

**Sıradaki sprint:**
- Staging'de 5 akış manuel E2E testi
- Hafta 3: AI Modülleri staging'de aktif (FILTERRA + Atlas + SCRIBE)
- Beta kullanıcılar davet (50 kişi)

---

## Deploy Hedefleri

| Servis | Platform | Config |
|--------|----------|--------|
| API | Railway | `apps/api/railway.json` + `Dockerfile` |
| web-7fil | Vercel | `apps/web-7fil/vercel.json` |
| partner-portal | Vercel | Ayrı Vercel projesi |
| PostgreSQL | Railway plugin | `DATABASE_URL` otomatik |
| Meilisearch | Railway Docker | `getmeili/meilisearch:v1.7` |
| Media | Cloudflare R2 | `R2_*` env vars |

**GitHub Actions Secrets gerekli:**
`RAILWAY_TOKEN`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID_WEB`

---

## Kodlama Kuralları

- Yorum YOK (açıklayıcı isimler yeterli) — sadece `why` için yorum ekle
- Türkçe UI metinleri, İngilizce kod
- NestJS controller'larda `@Version()` decorator KULLANMA
- Her yeni endpoint → `EmailVerifiedGuard` gerekip gerekmediğini değerlendir
- TypeORM `create()` → `Record<string, unknown>` cast gerekebilir (TS5.9 uyumu)
- Yeni commit → `feat/fix/docs/chore(kapsam): açıklama` formatı
- `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>` her commit'te

---

## Env Değişkenleri

Tüm değişkenler: `.env.example` (kök) + `apps/web-7fil/.env.local.example`

Kritik olanlar:
```
DATABASE_URL         PostgreSQL (Railway otomatik doldurur)
JWT_SECRET           openssl rand -hex 32
REFRESH_TOKEN_SECRET openssl rand -hex 32
ANTHROPIC_API_KEY    sk-ant-...
MEILI_HOST           http://localhost:7700
MEILI_MASTER_KEY     rastgele güçlü string
R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY
SENDGRID_API_KEY     SG...
IYZICO_API_KEY       sandbox-... (test modu)
```
