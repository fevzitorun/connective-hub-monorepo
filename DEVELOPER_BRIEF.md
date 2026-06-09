# 7fil.com.tr — Developer Brief
**Tarih:** Mayıs 2026 | **Hazırlayan:** Claude (Sonnet 4.6)

---

## 1. Proje Özeti

**7fil.com.tr** — Türkiye'nin entegre gayrimenkul ekosistemi.

Tek platformda: ilan arama, ajans paneli, hukuki danışmanlık, kredi & sigorta hesaplama, müzayede, yapay zeka asistanı, beyaz etiket çözümler, partner ağı ve mobil uygulama.

**Tech stack:**
- **API:** NestJS 10 + Fastify, TypeORM, PostgreSQL + PostGIS
- **Web:** Next.js 14 App Router, Tailwind CSS, Zustand
- **Mobile:** Expo SDK 51, Expo Router v3
- **Partner Portal:** Next.js 14 (ayrı app, port 3002)
- **Monorepo:** Turborepo + pnpm workspaces
- **Depolama:** Cloudflare R2
- **AI:** Anthropic Claude (claude-sonnet-4-6) — Atlas AI asistanı
- **Ödeme:** İyzico Checkout Form (3D Secure)
- **E-posta:** Resend SDK
- **Push:** Expo Push API
- **CI/CD:** GitHub Actions → Railway (API) + Vercel (Web/Partner) + EAS (Mobil)

---

## 2. Monorepo Yapısı

```
connective-hub-monorepo/
├── apps/
│   ├── api/              NestJS API (port 4000)
│   ├── web-7fil/         Next.js ana site (port 3000)
│   ├── partner-portal/   Next.js partner paneli (port 3002)
│   └── mobile/           Expo React Native uygulaması
├── packages/
│   ├── ui/               Paylaşılan UI bileşenleri
│   ├── types/            Paylaşılan TypeScript tipleri
│   └── config/           ESLint, tsconfig vb.
├── .github/
│   ├── workflows/ci.yml        CI (typecheck + test)
│   ├── workflows/deploy.yml    CD (Railway + Vercel + EAS)
│   └── DEPLOY.md               İlk deploy kılavuzu
└── .env.example          Tüm environment değişkenleri
```

---

## 3. Kurulum

### Gereksinimler
- Node.js 20+
- pnpm 9+
- PostgreSQL 16+ (PostGIS extension)
- Docker (opsiyonel, önerilen)

### Adımlar

```bash
git clone <repo>
cd connective-hub-monorepo

# Bağımlılıkları yükle
pnpm install

# .env dosyasını oluştur
cp .env.example apps/api/.env.local
# .env.local içindeki tüm değerleri doldur

# Veritabanını başlat (PostgreSQL + PostGIS gerekli)
psql -U postgres -c "CREATE DATABASE 7fil_dev;"
psql -U postgres -d 7fil_dev -f apps/api/db/init.sql

# Tüm servisleri başlat
pnpm dev
# API: http://localhost:4000
# Web: http://localhost:3000
# Partner: http://localhost:3002
```

---

## 4. API Modülleri

| Modül | Prefix | Açıklama |
|-------|--------|----------|
| Auth | `/api/v1/auth` | JWT, refresh token, şifre sıfırlama |
| Users | `/api/v1/users` | Profil, push token yönetimi |
| Agency | `/api/v1/agency` | Ajans profili, abonelik, istatistik |
| Listings | `/api/v1/listings` | İlan CRUD, fotoğraf upload (R2) |
| Search | `/api/v1/search` | Meilisearch fulltext + filtre arama |
| Favorites | `/api/v1/favorites` | Favori ilanlar |
| Finance | `/api/v1/finance` | Kredi hesap, DASK, İyzico ödeme |
| Legal | `/api/v1/legal` | Hukuki danışmanlık modülü |
| Ticari | `/api/v1/ticari` | Ticari gayrimenkul özellikleri |
| Filterra | `/api/v1/filterra` | AI destekli arama (Atlas/Filterra) |
| Analytics | `/api/v1/analytics` | İlan ve ajans analitiği |
| Auction | `/api/v1/auction` | Müzayede sistemi (Socket.IO) |
| Atlas | `/api/v1/atlas` | Claude AI asistan konuşmaları |
| Whitelabel | `/api/v1/whitelabel` | Beyaz etiket özelleştirme |
| Admin | `/api/v1/admin` | Platform yönetimi (sadece admin rolü) |
| Partner | `/api/v1/partner` | Partner referans ve komisyon sistemi |
| Health | `/api/v1/health` | Railway health check |

**Swagger UI:** `http://localhost:4000/api/docs` (sadece geliştirme ortamında)

---

## 5. Veritabanı Şeması

Ana tablolar (`apps/api/db/init.sql`):

```
users                 → Tüm kullanıcılar (buyer, agency, admin, partner vb.)
agencies              → Ajans profilleri
subscriptions         → Ajans abonelikleri (starts_at, ends_at)
listings              → İlanlar (PostGIS koordinat desteği)
listing_photos        → İlan fotoğrafları (R2 key + URL)
favorites             → Kullanıcı favorileri
search_alerts         → Kayıtlı aramalar
auctions              → Müzayedeler
auction_bids          → Müzayede teklifleri
atlas_conversations   → AI konuşmaları
atlas_messages        → AI mesajları
mortgage_leads        → Kredi başvuruları
insurance_quotes      → Sigorta teklifleri
payment_orders        → İyzico ödeme kayıtları
password_reset_tokens → Şifre sıfırlama
push_tokens           → Expo push token'ları
partner_referrals     → Partner referans kayıtları
partner_commissions   → Partner komisyon kayıtları
partner_api_keys      → Partner API anahtarları
```

**Kritik:** `subscriptions` tablosu `starts_at` ve `ends_at` kolonlarını kullanır (`started_at`/`expires_at` değil).

---

## 6. Kullanıcı Rolleri

```typescript
enum UserRole {
  BUYER        = 'buyer'        // Alıcı/kiracı
  AGENCY       = 'agency'       // Emlak ajansı sahibi
  AGENT_PERSON = 'agent_person' // Ajans danışmanı
  LAWYER       = 'lawyer'       // Avukat
  BANK         = 'bank'         // Banka kullanıcısı
  INSURER      = 'insurer'      // Sigorta
  PARTNER      = 'partner'      // Partner portal kullanıcısı
  ADMIN        = 'admin'        // Platform yöneticisi
}
```

---

## 7. Authentication

- **JWT Access Token:** 15 dakika (Bearer)
- **Refresh Token:** 7 gün (httpOnly cookie önerilir, şu an body'de)
- **Şifre:** bcrypt hash
- **Şifre sıfırlama:** SHA-256 token, 1 saat geçerli — timing-safe (email bulunsun/bulunsunmasın aynı yanıt)
- **Rol koruması:** `@Roles(UserRole.ADMIN)` + `RolesGuard`

---

## 8. Ödeme Akışı (İyzico 3DS)

```
1. Frontend: POST /finance/payment/init  { plan, months }
2. Backend:  İyzico Checkout Form başlatılır → { orderId, checkoutFormContent, token }
3. Frontend: checkoutFormContent HTML'i iframe içine inject edilir
4. Kullanıcı: 3DS işlemini tamamlar
5. İyzico:   POST /finance/payment/callback?token=xxx
6. Backend:  İyzico'ya doğrulama yapar → abonelik aktifleştirilir
7. Frontend: /panel/abonelik?odeme=basarili sayfasına yönlenir
```

**Sandbox API Key'ler `.env.example`'da mevcut** — canlıya geçmeden üretim key'lerine alın.

İyzico PKI imza: `base64(SHA1(apiKey + randomKey + pki_string + secretKey))`

---

## 9. Real-Time (Socket.IO)

Müzayede modülü WebSocket kullanır:

```typescript
// Gateway: apps/api/src/auction/auction.gateway.ts
// Namespace: /auction
// Events:
//   Client → Server: join_auction, place_bid
//   Server → Client: bid_update, auction_ended
```

Client bağlantısı (web):
```typescript
import { io } from 'socket.io-client'
const socket = io('http://localhost:4000/auction', {
  auth: { token: accessToken }
})
socket.emit('join_auction', { auctionId })
socket.on('bid_update', (data) => { /* güncelle */ })
```

---

## 10. E-posta & Push Bildirimleri

**MailModule** `@Global()` olarak tanımlanmıştır — her modülde import etmeden kullanılır.

```typescript
// E-posta gönderimi (fire-and-forget — business logic'i bloklamamalı)
this.mail.sendWelcome(email, name).catch(() => undefined)
this.mail.sendPasswordReset(email, name, token).catch(() => undefined)
this.mail.sendAuctionWon(email, name, auction).catch(() => undefined)

// Push bildirimi
this.push.sendToUser(userId, 'Başlık', 'Mesaj', { data: 'payload' })
this.push.sendToRole('agency', 'Başlık', 'Mesaj')
```

**Zamanlayıcılar** (`mail.scheduler.ts`):
- `09:00` her gün: İlan bitiş uyarıları (7 gün önceden)
- `00:00` her gün: Abonelik yenileme hatırlatmaları (7 gün önceden)

---

## 11. Mobile (Expo)

```bash
cd apps/mobile
npm install -g eas-cli
eas login
eas build --platform all --profile development
# veya local geliştirme için:
npx expo start
```

**Push token kaydı:** Login sonrası `usePushNotifications(onToken, accessToken)` hook'u otomatik kaydeder.

**EAS profilleri** (`eas.json`):
- `development` → geliştirme build
- `preview` → TestFlight/Internal Testing
- `production` → App Store / Google Play

---

## 12. Partner Portal

Ayrı Next.js uygulaması (`apps/partner-portal`, port 3002).

- Giriş: Aynı API `/auth/login` — `role: 'partner'` kontrolü yapılır
- Endpoint'ler: `/api/v1/partner/*` — `@Roles(UserRole.PARTNER)` korumalı
- Özellikler: Referans gönderme, komisyon takibi, embed/widget kodu üretimi, API key yönetimi

---

## 13. Admin Panel

Web uygulaması içinde `/admin` route'u altında.

- Sadece `role: 'admin'` kullanıcılar erişebilir
- `/admin` → Platform özeti (kullanıcı, ilan, ajans, abonelik sayıları)
- `/admin/kullanicilar` → Kullanıcı yönetimi (rol, aktif/pasif)
- `/admin/ajanslar` → Ajans yönetimi (doğrulama, plan değişikliği)
- `/admin/ilanlar` → İlan moderasyonu (durum, silme)
- `/admin/abonelikler` → Abonelik listesi ve atama

---

## 14. CI/CD & Deploy

### Gerekli GitHub Secrets

```
RAILWAY_TOKEN              Railway deploy token
VERCEL_TOKEN               Vercel API token
VERCEL_ORG_ID              Vercel organization ID
VERCEL_PROJECT_ID_WEB      web-7fil project ID
VERCEL_PROJECT_ID_PARTNER  partner-portal project ID
EXPO_TOKEN                 Expo access token
NEXT_PUBLIC_API_URL        Production API URL
```

### Deploy Akışı

- **PR açıldığında:** TypeCheck + API test (PostgreSQL servis container ile)
- **`main`'e merge:** API → Railway, Web + Partner → Vercel otomatik deploy
- **Mobil:** Commit mesajında `[mobile]` varsa EAS build tetiklenir

### İlk Deploy

Bkz: `.github/DEPLOY.md` — adım adım Railway + Vercel + EAS kurulum kılavuzu.

---

## 15. Bilinen Kısıtlamalar & Yapılacaklar

| # | Konu | Durum |
|---|------|-------|
| 1 | Meilisearch — tam entegrasyon (SearchModule şablon hâlinde) | Yapılacak |
| 2 | WhatsApp Business API entegrasyonu | Yapılacak |
| 3 | TC Kimlik doğrulama (İyzico için zorunlu prod'da) | Yapılacak |
| 4 | Refresh token rotation + Redis blacklist | Yapılacak |
| 5 | Rate limit granüler ayar (throttler) | İncelemek |
| 6 | E2E test suite (Playwright) | Yapılacak |
| 7 | İyzico webhook imza doğrulama | Yapılacak |
| 8 | KVKK veri silme endpoint'i | Yapılacak |
| 9 | Softlan subdomain routing (whitelabel) | Yapılacak |
| 10 | Abonelik TypeORM entity `plan` kolonu VARCHAR olarak güncellendi, entity'deki enum anotasyonu da güncellenmeli | Kontrol et |

---

## 16. Önemli Mimari Kararlar

### Neden Fastify?
NestJS'in Express adaptörü yerine Fastify kullanıldı. Daha hızlı (~2x), daha iyi TypeScript desteği ve `@fastify/multipart` ile doğal dosya upload desteği.

### Neden raw SQL?
Admin ve raporlama sorgularında TypeORM QueryBuilder yerine `DataSource.query()` kullanıldı. Karmaşık JOIN ve window fonksiyon sorgularında daha okunabilir ve performanslı.

### Neden @Global() MailModule?
MailService ve PushService her feature modülünde kullanılır. Tekrar tekrar import etmemek için `@Global()` decorator ile tanımlandı.

### Neden client-side rendering?
Admin panel ve Panel sayfaları auth durumuna göre yönlendirme yaptığı için 'use client' ile işaretlendi. Public sayfalar (ilan listesi, ilan detay) SSR/SSG olabilir — ileride `next-intl` ve Suspense optimizasyonu yapılabilir.

### Para birimi
Tüm fiyatlar `DECIMAL(14,2)` olarak saklanır. Uygulama `tr-TR` locale ile formatlar. İyzico entegrasyonu TRY kullanır.

---

## 17. Güvenlik Notları

- SQL parametreleri her zaman `$1, $2...` şeklinde parameterize edilmiştir
- Şifreler bcrypt ile hash'lenir (10 round)
- JWT secret'lar environment'tan okunur, kod içinde hardcode yoktur
- Admin endpoint'leri hem `JwtAuthGuard` hem `RolesGuard` ile çift korumalıdır
- İyzico callback'i `token` ile doğrulanır, direkt abonelik aktifleştirme yoktur
- Push token'lar `UNIQUE(user_id, token)` constraint ile korunur
- Partner API key'leri SHA-256 hash olarak saklanır, plain text asla

---

*Bu brief Claude Sonnet 4.6 tarafından 7fil.com.tr codebase'i analiz edilerek otomatik üretilmiştir.*
