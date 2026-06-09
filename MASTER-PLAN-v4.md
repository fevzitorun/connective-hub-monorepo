# 7fil.com.tr — MASTER PLAN v4.0
### Connective Hub Dijital Teknolojiler Ltd. Şti.
> **Son Güncelleme:** 9 Haziran 2026 · **Versiyon:** 4.0.0-sprint3-post  
> *Türkiye'nin entegre gayrimenkul ekosistemi — İlan · Hukuk · Finans · Müzayede · CRM · AI Ajanları*

---

## 📋 İçindekiler

1. [Proje Özet Durumu](#1-proje-durumu)
2. [Git Durumu — Push Edilmeyi Bekleyen İş](#2-git-durumu)
3. [Güncel Mimari Harita](#3-mimari-harita)
4. [Kurumsal Kimlik — Claude Design Çıktıları](#4-kurumsal-kimlik)
5. [Modül Durumu — Tam Liste (v4)](#5-modül-durumu)
6. [Sprint 4 — Yapılacaklar Yol Haritası](#6-sprint-4)
7. [AI Agent Ekosistemi — Güncel Durum](#7-ai-ajanlar)
8. [Veritabanı Şema Özeti (v4)](#8-veritabani)
9. [Deployment & Ortam](#9-deployment)
10. [Sürüm Geçmişi](#10-surum-gecmisi)

---

## 1. Proje Durumu

```
Platform Adı : 7fil.com.tr
Şirket       : Connective Hub Dijital Teknolojiler Ltd. Şti.
Monorepo     : github.com/fevzitorun/connective-hub-monorepo
API Versiyonu: 0.4.0 (NestJS 10 + Fastify + TypeORM + PostgreSQL/PostGIS)
Frontend     : Next.js 14 (web-7fil + partner-portal)
Mobile       : Expo React Native (8 ekran)
İnfra        : Railway (API) · Vercel (Web) · Cloudflare R2 (Dosya)
Son Commit   : 65d86a0 feat(module-7): Alıcı Özellikleri
Push Bekleyen: 23 değiştirilmiş dosya + 56 yeni dosya/dizin
```

### Genel İlerleme (v4 güncel)

| Katman | Durum | Tamamlanma |
|--------|-------|-----------|
| **Core API (Auth, Users, Listings)** | ✅ Canlı | %100 |
| **Arama & Filtreleme** | ✅ Canlı | %90 |
| **FILTERRA.AI (8 Ajan)** | ✅ Aktif | %90 |
| **Hukuk Modülü** | ✅ Tamamlandı | %90 |
| **Finans & Sigorta** | ✅ Tamamlandı | %85 |
| **Müzayede Sistemi** | ✅ Canlı | %95 |
| **White-Label / SaaS** | ✅ Tamamlandı | %80 |
| **Atlas AI Asistan** | ✅ Aktif | %80 |
| **TicariMetre** | ✅ Aktif | %80 |
| **MLS Portföy Sistemi** | ✅ Sprint 2'de tamamlandı | %100 |
| **Admin Paneli** | ✅ Sprint 3'te tamamlandı | %85 |
| **CRM (Lead Yönetimi)** | ✅ Sprint 3'te tamamlandı | %85 |
| **Analitik Dashboard** | ✅ Sprint 3'te tamamlandı | %80 |
| **Mail / Push / Scheduler** | ✅ Tamamlandı | %85 |
| **Partner Portal** | ✅ Tamamlandı | %80 |
| **Mobile App (Expo)** | ✅ Sprint 3'te tamamlandı | %75 |
| **SCRIBE AI Ajanı** | ✅ Sprint 3'te tamamlandı | %85 |
| **Kurumsal Kimlik (Claude Design)** | ✅ Tamamlandı | %95 |
| **YT-Director Ajanı** | 🔶 İskelet | %5 |
| **Property Management (Mod C)** | 🔶 Tasarlandı | %10 |
| **Depozito Güvence (Mod D)** | 🔶 Tasarlandı | %10 |
| **AI Search / NLS (Mod E)** | 🆕 Planlandı | %0 |
| **Agent Orkestrasyonu (Mod F)** | 🆕 Planlandı | %5 |
| **e-Güven e-İmza** | 🆕 Planlandı | %0 |

---

## 2. Git Durumu — Push Edilmeyi Bekleyen İş

> ⚠️ Son commit `65d86a0` (Module 7) üzerinden **sprint 2 + sprint 3** tüm iş yerel dalda.  
> Aşağıdaki her şey henüz push edilmedi.

### 2.1 Değiştirilen Takip Edilen Dosyalar (23 adet)

```
apps/api/db/init.sql          → 240 satır → 1.122 satıra çıktı (+882 satır)
apps/api/src/app.module.ts    → Tüm yeni modüller kayıtlı
apps/api/src/auth/            → Auth güncellemeleri
apps/api/src/users/           → User entity + module güncellemeleri
apps/api/src/main.ts          → Yeni konfigürasyon
apps/web-7fil/next.config.ts  → Güncellendi
apps/web-7fil/src/app/        → 13 frontend sayfası güncellendi
apps/web-7fil/src/components/ → 3 component güncellendi
apps/web-7fil/src/lib/        → api.ts + panel-api.ts güncellendi
.env.example                  → Yeni servisler eklendi
```

### 2.2 Yeni Untracked Dizinler / Dosyalar (56 adet)

**API Modülleri (yeni):**
```
apps/api/src/admin/           ← Admin panel yönetimi (3 dosya)
apps/api/src/agents/scribe/   ← SCRIBE içerik ajanı (3 dosya)
apps/api/src/agents/yt-director/ ← YT Director iskeleti (boş)
apps/api/src/analytics/       ← İstatistik modülü (3 dosya)
apps/api/src/atlas/           ← Atlas AI asistan
apps/api/src/auction/         ← Müzayede + WebSocket
apps/api/src/crm/             ← CRM / Lead yönetimi (entities + DTOs)
apps/api/src/filterra/        ← FILTERRA.AI 8 ajan
apps/api/src/finance/         ← Mortgage + Sigorta + İyzico
apps/api/src/legal/           ← Hukuk + Sertifika
apps/api/src/mail/            ← E-posta + Push + Scheduler
apps/api/src/mls/             ← MLS Portföy (Sprint 2)
apps/api/src/partner/         ← Partner referral + komisyon
apps/api/src/ticari/          ← TicariMetre
apps/api/src/users/users.controller.ts ← Kullanıcı controller
apps/api/src/whitelabel/      ← White-label branding
apps/api/Dockerfile           ← Docker containerization
apps/api/railway.json         ← Railway deploy konfigürasyonu
```

**Frontend — web-7fil (yeni sayfalar):**
```
apps/web-7fil/src/app/admin/  ← Admin panel (15 bölüm):
  abonelikler · ai-ajanlar · ajanslar · finans · icerik
  ilanlar · kampanyalar · kullanicilar · mls · onboarding
  reklam · sehirler · youtube · layout.tsx · page.tsx

apps/web-7fil/src/app/muzayede/         ← Müzayede sayfası + [id]
apps/web-7fil/src/app/panel/analitik/   ← Emlakçı analitik dashboard
apps/web-7fil/src/app/panel/atlas/      ← Atlas AI chat
apps/web-7fil/src/app/panel/banka/      ← Mortgage / Banka paneli
apps/web-7fil/src/app/panel/hukuk/      ← Hukuk paneli + davalar
apps/web-7fil/src/app/panel/marka/      ← White-label marka ayarları
apps/web-7fil/src/app/panel/muzayede/   ← Müzayede yönetimi
apps/web-7fil/src/app/s/                ← White-label subdomain sayfaları
apps/web-7fil/src/app/sertifika/        ← Mülk sertifikası doğrulama
apps/web-7fil/src/app/ticari/           ← TicariMetre piyasa sayfası
apps/web-7fil/src/app/(auth)/sifre-sifirla/  ← Şifre sıfırlama
apps/web-7fil/src/app/(auth)/sifremi-unuttum/ ← Şifremi unuttum

apps/web-7fil/src/components/   ← 8 yeni component:
  CertificateBadge.tsx · FilterraPanel.tsx · InsuranceQuote.tsx
  LegalRequestButton.tsx · ListingFilterra.tsx · MortgageCalculator.tsx
  TicariAnaliz.tsx · TicariPiyasa.tsx

apps/web-7fil/src/lib/admin-api.ts  ← Admin API istemcisi
apps/web-7fil/src/middleware.ts     ← Auth middleware
apps/web-7fil/vercel.json           ← Vercel deploy konfigürasyonu
```

**Yeni Uygulamalar:**
```
apps/mobile/          ← Expo React Native (8 ekran)
  src/app/(tabs)/     ← index · panel · profile · favorites
  src/app/listing/    ← [id] detay sayfası
  src/app/(auth)/     ← login · register
  src/components/     ← ListingCard · SearchBar · FilterSheet

apps/partner-portal/  ← Next.js 14 (6 sayfa)
  dashboard/          ← Ana dashboard
  dashboard/referrals/ · api-keys/ · komisyon/ · embed/
  login/
```

**Tasarım & Strateji:**
```
7 fil (1)/            ← Claude Design çıktıları (brand + app + screenshots)
design-canvas.jsx     ← Figma-benzeri tasarım canvas aracı
7fil-claude-design-prompts.md  ← Tüm design brief prompt paketi
7fil - Hi-fi Prototype.html    ← Hi-fi prototip
7fil - Marka Kimliği.html      ← Marka kimliği belgesi
MARKET-ATTACK-v4.md            ← Rekabet stratejisi (Sahibinden analizi)
MASTER-PLAN-v2-EXTENSION.md   ← v2 ek notlar
MASTER-PLAN-v3.md             ← Önceki plan
DEVELOPER_BRIEF.md            ← Geliştirici özeti
sahibinden/                   ← Rakip analiz verileri
.github/                      ← GitHub Actions CI/CD
```

### 2.3 Önerilen Commit Stratejisi

```
Commit 1: feat(sprint2): MLS, Admin, Analytics, Auth güncellemeleri
Commit 2: feat(sprint3): CRM, SCRIBE, Auction, Finance, Legal, Mail
Commit 3: feat(mobile): Expo React Native uygulama (8 ekran)
Commit 4: feat(partner-portal): Partner portalı (6 sayfa)
Commit 5: feat(web): Admin panel (15 bölüm), tüm yeni sayfalar
Commit 6: feat(infra): Dockerfile, Railway, Vercel, GitHub Actions
Commit 7: docs: MASTER-PLAN-v4, MARKET-ATTACK, kurumsal kimlik dosyaları
```

---

## 3. Güncel Mimari Harita

```
connective-hub-monorepo/
├── apps/
│   ├── api/                              ← NestJS 10 + Fastify (Railway)
│   │   ├── src/
│   │   │   ├── admin/                   ✅ Admin panel + istatistikler
│   │   │   ├── agents/
│   │   │   │   ├── scribe/              ✅ SCRIBE içerik ajanı
│   │   │   │   └── yt-director/         🔶 YT Director (iskelet)
│   │   │   ├── analytics/               ✅ Analitik + raporlama
│   │   │   ├── atlas/                   ✅ Atlas AI (Claude entegrasyonu)
│   │   │   ├── auction/                 ✅ Müzayede + WebSocket
│   │   │   ├── auth/                    ✅ JWT + Refresh + KVKK
│   │   │   ├── crm/                     ✅ Lead yönetimi + aktivite log
│   │   │   ├── filterra/                ✅ 8 AI Agent
│   │   │   ├── finance/                 ✅ Mortgage + Sigorta + İyzico
│   │   │   ├── legal/                   ✅ Tapu + Hukuki kontrol
│   │   │   ├── listings/                ✅ PostGIS + Meilisearch
│   │   │   ├── mail/                    ✅ E-posta + Push + Scheduler
│   │   │   ├── mls/                     ✅ MLS Portföy Paylaşımı
│   │   │   ├── partner/                 ✅ Partner referral + komisyon
│   │   │   ├── search/                  ✅ Meilisearch + Kayıtlı aramalar
│   │   │   ├── ticari/                  ✅ TicariMetre piyasa analizi
│   │   │   ├── users/                   ✅ Kullanıcı + KVKK audit
│   │   │   └── whitelabel/              ✅ White-label branding
│   │   ├── db/
│   │   │   └── init.sql                 ✅ 1.122 satır (40+ tablo)
│   │   ├── Dockerfile                   ✅ Container desteği
│   │   └── railway.json                 ✅ Railway deploy config
│   │
│   ├── web-7fil/                        ← Next.js 14 (Vercel)
│   │   └── src/
│   │       ├── app/                     ✅ 50+ sayfa
│   │       │   ├── admin/               ✅ 15 bölüm admin panel
│   │       │   ├── panel/               ✅ 10 emlakçı paneli sayfası
│   │       │   ├── (auth)/              ✅ Login + register + şifre
│   │       │   ├── muzayede/            ✅ Müzayede sayfaları
│   │       │   ├── ticari/              ✅ TicariMetre
│   │       │   ├── sertifika/           ✅ Sertifika doğrulama
│   │       │   └── s/[subdomain]/       ✅ White-label subdomain
│   │       └── components/              ✅ 24 component
│   │
│   ├── partner-portal/                  ← Next.js 14 (Vercel)
│   │   └── src/app/                     ✅ 6 sayfa
│   │
│   └── mobile/                          ← Expo React Native
│       └── src/app/                     ✅ 8 ekran
│
├── packages/
│   ├── ui/                              ✅ 6 shared component
│   └── types/                           ✅ Shared TypeScript types
│
└── .github/workflows/                   ✅ CI/CD pipeline
```

---

## 4. Kurumsal Kimlik — Claude Design Çıktıları

> Claude Design ile hazırlanan marka kimliği **Mayıs–Haziran 2026** arasında tamamlandı.

### 4.1 Teslim Edilen Materyaller

```
7 fil (1)/
├── brand/
│   ├── mark.jsx          → Logo / marka işareti (React component)
│   ├── app.jsx           → Uygulama tasarım sistemi
│   ├── sections/         → Sayfa bölümleri
│   └── styles.css        → Design tokens + global stiller
│
├── app/
│   ├── app.jsx           → Tam uygulama ekranları
│   ├── components.jsx    → UI bileşen kütüphanesi
│   ├── data.jsx          → Mock veri
│   ├── icons.jsx         → İkon seti
│   ├── photos.jsx        → Fotoğraf yardımcıları
│   ├── screens/          → Ekran tasarımları
│   ├── styles.css        → Mobil stiller
│   └── tweaks-panel.jsx  → Tweak panel (interaktif)
│
└── screenshots/
    ├── 01-home.jpg        → Ana sayfa hi-fi
    ├── 02-mark.jpg        → Marka işareti v1
    ├── 03-mark-v2.jpg     → Marka işareti v2
    ├── 04-mark-v2b.jpg    → Marka işareti v2b
    ├── 05-wide-home.jpg   → Geniş ana sayfa
    ├── 06-tweaks.jpg      → Tweak panel
    ├── brand-01-overview.jpg  → Marka genel görünüm
    ├── brand-02-cover-focus.jpg → Kapak odak
    └── brand-tote.jpg     → Fiziksel uygulama (çanta)
```

### 4.2 Marka Özeti

| Öğe | Değer |
|-----|-------|
| **Renk — Ink** | `#1a1a2e` — Derin gece mavisi (güven, otorite) |
| **Renk — Gold** | `#c9a84c` — Antik altın (bereket, değer, prestij) |
| **Renk — Teal** | `#2d6a6a` — Deniz mavisi-yeşili (huzur, teknoloji) |
| **Renk — Cream** | `#f8f4ee` — Sıcak krem (ev hissi, güvenlik) |
| **Başlık Fontu** | Playfair Display (serif, lüks, köklü) |
| **Gövde Fontu** | DM Sans (modern, okunabilir) |
| **Tagline** | "Evin için doğru adım." |
| **FILTERRA Tagline** | "Ticaretin Yeni Ölçüsü" |
| **Logo** | 7 fil silüeti içinde "7f" — hortum yukarı, altın+lacivert |
| **Stil Yönü** | Airbnb samimiyeti + Sotheby's prestiji |

### 4.3 Yapılacaklar (Kimlik Entegrasyonu)

- [ ] Design tokens'ı `packages/ui/tokens.css`'e taşı
- [ ] `mark.jsx` → SVG export → favicon + app icon
- [ ] `app.jsx` component'larını `apps/web-7fil` ve `apps/mobile`'a entegre et
- [ ] Figma'ya export (tasarımcı el kitabı)
- [ ] `7fil-claude-design-prompts.md` → arşiv olarak `docs/design/`'a taşı

---

## 5. Modül Durumu — Tam Liste (v4)

### ✅ TAMAMLANAN MODÜLLER

---

#### Modül 1 — Authentication & Kullanıcı Yönetimi
**Dosyalar:** `apps/api/src/auth/` · `apps/api/src/users/`

- JWT Access + Refresh Token (HttpOnly cookie)
- Roller: `buyer · agency · agent_person · lawyer · bank · insurer · partner · admin`
- KVKK audit log
- TC Kimlik, şifre sıfırlama, şifremi unuttum akışları
- Push token yönetimi (iOS · Android · Web)

**Kalan:** E-posta OTP doğrulaması

---

#### Modül 2 — İlan Yönetimi
**Dosyalar:** `apps/api/src/listings/` · `apps/web-7fil/src/app/ilan/`

- PostGIS coğrafi arama, Meilisearch full-text
- Cloudflare R2 fotoğraf yükleme (max 20/ilan)
- WhatsApp deep link + QR kod
- Harita görünümü, tüm filtreler

**Kalan:** Video yükleme, 360° sanal tur

---

#### Modül 3 — Arama & Keşif Motoru
**Dosyalar:** `apps/api/src/search/`

- Meilisearch (Turkish dil desteği)
- PostGIS radius arama
- Kayıtlı aramalar + e-posta/WhatsApp uyarısı
- Tüm filtreler, sıralama seçenekleri

**Kalan:** Doğal dil arama (NLS) → Sprint 4

---

#### Modül 4 — FILTERRA.AI (8 Ajan)
**Dosyalar:** `apps/api/src/filterra/`

| Ajan | Görev | Durum |
|------|-------|-------|
| `listing_writer` | Oto. ilan açıklaması | ✅ |
| `title_optimizer` | SEO başlık önerisi | ✅ |
| `valuation` | Min/Max değer tahmini | ✅ |
| `legal_precheck` | Tapu riski ön analizi | ✅ |
| `neighborhood` | Mahalle analizi | ✅ |
| `market_trend` | Piyasa trend raporu | ✅ |
| `photo_description` | Fotoğraf → metin | ✅ |
| `translation` | Çok dilli (EN/AR/RU) | ✅ |

---

#### Modül 5 — Hukuki Doğrulama
**Dosyalar:** `apps/api/src/legal/` · `apps/web-7fil/src/app/panel/hukuk/`

- Avukat atama, belge yükleme (tapu, iskan, ruhsat, DASK)
- Risk skoru (0-100) + mülk sertifikası (SHA-256)
- Sertifika badge public ilanlar üzerinde
- `apps/web-7fil/src/app/sertifika/` → Herkese açık doğrulama sayfası

---

#### Modül 6 — Finans & Sigorta
**Dosyalar:** `apps/api/src/finance/` · `apps/web-7fil/src/components/MortgageCalculator.tsx`

- Mortgage hesaplayıcı (konvansiyonel + İslami)
- DASK + Konut sigorta teklifi
- İyzico 3DS ödeme entegrasyonu
- Abonelik planları: `free · pro · corporate · enterprise`
- `apps/web-7fil/src/app/panel/banka/` → Banka lead yönetimi

---

#### Modül 7 — Müzayede Sistemi
**Dosyalar:** `apps/api/src/auction/` · `apps/web-7fil/src/app/muzayede/`

- WebSocket (Socket.IO) real-time teklif akışı
- Otomatik teklif (auto-bid)
- Zamanlayıcı otomasyonu
- `apps/web-7fil/src/app/panel/muzayede/` → Yönetim paneli

---

#### Modül 8 — White-Label / SaaS
**Dosyalar:** `apps/api/src/whitelabel/` · `apps/web-7fil/src/app/s/[subdomain]/`

- Subdomain bazlı ajans siteleri
- Renk, logo, font, hero özelleştirme
- Custom domain desteği
- `apps/web-7fil/src/app/panel/marka/` → Self-servis ayarlar

---

#### Modül 9 — TicariMetre
**Dosyalar:** `apps/api/src/ticari/` · `apps/web-7fil/src/app/ticari/`

- Piyasa anlık görüntüsü (m² fiyat ortalamaları)
- Yatırım getirisi hesaplayıcı
- Şehir/ilçe bazlı karşılaştırmalı analiz

---

#### Modül 10 — Atlas AI Asistan
**Dosyalar:** `apps/api/src/atlas/` · `apps/web-7fil/src/app/panel/atlas/`

- Konuşma hafızası (session bazlı)
- Gayrimenkul özelinde sistem promptu
- Kullanıcı bağlamına göre kişiselleştirilmiş yanıt
- Claude API entegrasyonu

---

#### Modül 11 — Partner Portal
**Dosyalar:** `apps/api/src/partner/` · `apps/partner-portal/`

- Referral yönetimi + komisyon takibi
- API key yönetimi + embed widget
- `apps/partner-portal/src/app/` → 6 sayfa tam portal

---

#### Modül B — MLS Portföy Paylaşım Sistemi
**Dosyalar:** `apps/api/src/mls/` (9 dosya)

- Komisyon paylaşımı (% veya sabit TL)
- İşbirlikçi başvurusu → onay/ret akışı
- `closeDeal()` — atomik transaction
- 10 REST endpoint

---

#### Modül 12 — Admin Panel ⭐ Sprint 3 YENİ
**Dosyalar:** `apps/api/src/admin/` · `apps/web-7fil/src/app/admin/`

15 yönetim bölümü:
- `kullanicilar/` — Kullanıcı yönetimi + KVKK
- `ajanslar/` — Acenta onay + yönetim
- `ilanlar/` — İlan moderasyonu
- `mls/` — MLS havuz denetimi
- `abonelikler/` — Abonelik & ödeme yönetimi
- `finans/` — Gelir, komisyon, ödeme raporları
- `analitik/` → `apps/web-7fil/src/app/panel/analitik/`
- `ai-ajanlar/` — Ajan log & maliyet takibi
- `kampanyalar/` — Kampanya yönetimi
- `reklam/` — Reklam yönetimi
- `icerik/` — İçerik moderasyonu
- `sehirler/` — Şehir/ilçe/mahalle veritabanı
- `onboarding/` — Yeni üye akışı
- `youtube/` — YouTube içerik yönetimi (entegrasyona hazır)
- `layout.tsx · page.tsx` — Admin iskelet

---

#### Modül 13 — CRM (Lead Yönetimi) ⭐ Sprint 3 YENİ
**Dosyalar:** `apps/api/src/crm/`

- Lead oluşturma: `first_name, last_name, phone, email, source, status, type, priority`
- Durum makinesi: `new → contacted → qualified → proposal → negotiation → closed_won/lost`
- Aktivite log: `call, email, whatsapp, meeting, note, task`
- Lead filtreleme: şehir, ilçe, bütçe, oda, kaynak, atanan ajan
- Atama: `assigned_agent_id` JWT'den agencyId kısıtlı
- KVKK consent takibi

---

#### Modül 14 — Analitik & Raporlama ⭐ Sprint 3 YENİ
**Dosyalar:** `apps/api/src/analytics/` · `apps/web-7fil/src/app/panel/analitik/`

- Platform geneli istatistikler
- Ajans bazlı performans metrikleri
- İlan görüntülenme, tıklanma, WhatsApp dönüşüm
- Abonelik ve gelir analizi
- Admin panel istatistik servisi

---

#### Modül 15 — Mobile App (Expo) ⭐ Sprint 3 YENİ
**Dosyalar:** `apps/mobile/src/`

8 ekran:
- `(tabs)/index.tsx` — Ana akış (ilan listesi)
- `(tabs)/favorites.tsx` — Favoriler
- `(tabs)/panel.tsx` — Emlakçı paneli
- `(tabs)/profile.tsx` — Kullanıcı profili
- `listing/[id].tsx` — İlan detay
- `(auth)/login.tsx` — Giriş
- `(auth)/register.tsx` — Kayıt
- Components: `ListingCard · SearchBar · FilterSheet`

---

#### Modül 16 — SCRIBE AI İçerik Ajanı ⭐ Sprint 3 YENİ
**Dosyalar:** `apps/api/src/agents/scribe/`

İçerik tipleri:
- `blog` — SEO blog yazısı
- `social_pack` — Sosyal medya paketi (Instagram + Twitter + LinkedIn)
- `listing_desc` — İlan açıklaması
- `market_report` — Piyasa raporu
- `press_release` — Basın bülteni

Ton seçenekleri: `professional · friendly · urgent`

Endpoint'ler:
- `POST /agents/scribe/generate` — Genel içerik üretimi
- `POST /agents/scribe/blog` — Hızlı blog
- `GET /agents/scribe/history` — Üretim geçmişi

---

### 🔶 KISMI / İSKELET

#### Modül 16b — YT-Director Ajanı
**Dosyalar:** `apps/api/src/agents/yt-director/` (şu an boş)
**Hedef:** YouTube içerik stratejisi + video scriptleri

Planlanmış:
- `admin/youtube/` sayfasıyla birlikte çalışacak
- Video başlığı, açıklaması, tag optimizasyonu
- Gayrimenkul YouTube kanalı içerik takvimi

---

### 🔶 TASARLANDI — Sprint 4

#### Modül C — Property Management & Mülk Sağlık Skoru
- Kira sözleşmesi başladığında 6 aylık otomatik denetim
- FILTERRA.AI check-in vs. kontrol fotoğrafı karşılaştırması
- `health_score` (0-100) otomatik üretim
- Gerekli tablolar: `property_contracts, inspection_tasks, inspection_rooms, room_photos, health_scores`

---

#### Modül D — Depozito Güvence & FinTech Escrow
- 3 model: Nakit Escrow / Teminat Mektubu / Depozito Kredisi
- Avukat onaylı sözleşme
- `locked → released` geçişi yalnızca hasar raporu onayı ile
- Gerekli tablolar: `deposit_agreements, deposit_transactions, deposit_disputes`

---

### 🆕 SPRINT 4 — PLANLANMAKTA

#### Modül A — PDF Broşür Motoru
- NestJS + Puppeteer
- `/listings/:id/pdf` endpoint
- Design token uyumlu şablon

#### Modül E — AI Search / NLS
- Doğal dil arama ("Kadıköy'de 3+1, ebeveyn banyolu, 5M altı")
- Fotoğrafla arama (multimodal)
- Atlas AI → Meilisearch query builder

#### Modül F — Agent Orkestrasyonu
- SCOUT (arama ajanı), BROKER (MLS eşleştirme), NOTARY (sözleşme), VALUATOR (değerleme), HERALD (bildirim)
- Detay: eski `MASTER-PLAN-v3.md` Bölüm 7'ye bak

---

## 6. Sprint 4 — Yol Haritası

### Öncelik Sırası

```
P0 — Önce Yapılacak (Teknik Borç + Canlı Yayın):
  ├── Git: Sprint 2+3 tüm iş commit + push edilecek (7 commit)
  ├── Design: Design tokens → packages/ui/tokens.css entegrasyonu
  ├── Design: mark.jsx → SVG favicon + app icon
  └── Mobile: App Store + Play Store hazırlık

P1 — Bu Sprint:
  ├── Modül A: PDF Broşür Motoru (Puppeteer)
  ├── Modül C: Property Management temel akış
  └── YT-Director: İskelet → çalışan ajan

P2 — Sonraki Sprint:
  ├── Modül D: Depozito Güvence Sistemi
  ├── Modül E: AI Search / NLS endpoint
  └── e-Güven e-imza entegrasyonu

P3 — Gelecek Kuartal:
  ├── Modül F: Full Agent Orkestrasyonu
  ├── Uluslararası listeleme (EN/AR/RU)
  └── Video yükleme + 360° sanal tur
```

### Sprint 4 Detay Görevleri

| # | Görev | Modül | Tahmini Süre |
|---|-------|-------|-------------|
| S4-01 | Git commit + push (sprint 2+3 tüm iş) | Teknik Borç | 1 gün |
| S4-02 | Design tokens → packages/ui | Kimlik | 0.5 gün |
| S4-03 | Logo SVG → favicon + app icon | Kimlik | 0.5 gün |
| S4-04 | Puppeteer servis altyapısı | A | 2 gün |
| S4-05 | PDF broşür HTML şablonu | A | 1 gün |
| S4-06 | `/listings/:id/pdf` endpoint | A | 1 gün |
| S4-07 | `property_contracts` tablosu + entity | C | 1 gün |
| S4-08 | `inspection_tasks` scheduler | C | 2 gün |
| S4-09 | `room_photos` + FILTERRA diff | C | 3 gün |
| S4-10 | `health_score` algoritması | C | 1 gün |
| S4-11 | YT-Director ajan implementasyonu | 16b | 2 gün |
| S4-12 | AI Search NLS endpoint | E | 3 gün |
| S4-13 | Deposit Escrow temel akış | D | 4 gün |

---

## 7. AI Agent Ekosistemi — Güncel Durum

### 7.1 Aktif Ajanlar

| Ajan | Lokasyon | Durum | Görev |
|------|----------|-------|-------|
| FILTERRA × 8 | `src/filterra/` | ✅ Canlı | İlan yazarı, değerleme, hukuki ön kontrol, mahalle, trend, çeviri |
| ATLAS | `src/atlas/` | ✅ Canlı | Konuşma asistanı — Claude API |
| SCRIBE | `src/agents/scribe/` | ✅ Sprint 3 | Blog, sosyal medya, piyasa raporu |

### 7.2 Planlanmış Ajanlar (Sprint 4+)

| Ajan | Görev | Sprint |
|------|-------|--------|
| YT-DIRECTOR | YouTube içerik stratejisi | Sprint 4 |
| INSPECTOR | Mülk sağlık skoru (computer vision) | Sprint 4 |
| SCOUT | 24/7 arama + uyarı ajanı | Sprint 4 |
| BROKER | MLS eşleştirme | Sprint 5 |
| NOTARY | Sözleşme hazırlama | Sprint 5 |
| VALUATOR | Gerçek zamanlı değerleme | Sprint 5 |
| HERALD | Kişiselleştirilmiş bildirim | Sprint 5 |

### 7.3 Orkestrasyon Mimarisi (Hedef)

```
Kullanıcı: "500K bütçem var, Kadıköy'de yatırım arıyorum"
                        │
                  [ATLAS Ajanı]
                        │
          ┌─────────────┼─────────────┐
          │             │             │
    [SCOUT]        [VALUATOR]   [neighborhood]
    Kriterleri      Piyasa         Mahalle
    kaydet          analizi        puanı
          │             │             │
          └─────────────┼─────────────┘
                        │
                [ATLAS — Özet]
                "3 ilan bulundu.
                 En iyi yatırım: Moda 2+1 (ROI %4.8)
                 SCOUT ajanı kurulsun mu?"
```

---

## 8. Veritabanı Şema Özeti (v4)

```
init.sql boyutu: 1.122 satır (v3: ~240 satır)
```

### Tablolar (40+ tablo, kesin sayım için init.sql'e bak)

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

CRM (Sprint 3 — YENİ):
  leads, lead_activities

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

MLS (Sprint 2):
  mls_listings, mls_collaborations, mls_commission_splits

Planlanan (Sprint 4):
  property_contracts, inspection_tasks, inspection_rooms,
  room_photos, health_scores,
  deposit_agreements, deposit_transactions, deposit_disputes,
  search_agents, agent_matches, search_sessions
```

---

## 9. Deployment & Ortam

### Servisler

| Servis | Platform | URL |
|--------|----------|-----|
| API (NestJS) | Railway | `api.7fil.com.tr` |
| Web (Next.js) | Vercel | `7fil.com.tr` |
| Partner Portal | Vercel | `partner.7fil.com.tr` |
| Dosya Deposu | Cloudflare R2 | `cdn.7fil.com.tr` |
| Full-text Arama | Meilisearch (Railway) | iç ağ |
| Veritabanı | PostgreSQL + PostGIS (Railway) | iç ağ |
| Mobile | Expo EAS | App Store / Play Store (hazırlık) |

### Gerekli Environment Variables (güncel)

```env
DATABASE_URL=postgresql://...
JWT_SECRET=
JWT_REFRESH_SECRET=

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=

MEILISEARCH_HOST=
MEILISEARCH_API_KEY=

IYZICO_API_KEY=
IYZICO_SECRET_KEY=
IYZICO_BASE_URL=

OPENAI_API_KEY=        # FILTERRA + SCRIBE
ANTHROPIC_API_KEY=     # Atlas AI

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_ID=
```

### Deploy Akışı (güncel, .github/ mevcut)

```
git push main
    │
    ├── GitHub Actions: lint + test + type-check + security scan
    │
    ├── Railway: API otomatik deploy (Dockerfile kullanılıyor)
    │       └── health check: /api/v1/health
    │
    └── Vercel: web-7fil + partner-portal preview → prod
```

---

## 10. Sürüm Geçmişi

| Versiyon | Tarih | Değişiklikler |
|----------|-------|---------------|
| v1.0.0 | 2025 Q4 | İlk prototip — temel ilan + auth |
| v1.1.0 | 2026 Q1 | FILTERRA.AI, Müzayede, Hukuk, Finans |
| v2.0.0 | 2026 Q2 | White-label, TicariMetre, Partner Portal, Atlas AI |
| v3.0.0 | 2026 May | MLS Sistemi, Google I/O 2026 Search vizyonu |
| **v4.0.0** | **2026 Haz** | **Admin Panel, CRM, Analytics, Mobile, SCRIBE, Kurumsal Kimlik (Claude Design)** |
| v4.1.0 | 2026 Q3 | PDF Broşür, Property Management, YT-Director |
| v4.2.0 | 2026 Q3 | Depozito Güvence, AI Search / NLS |
| v5.0.0 | 2026 Q4 | Full Agent Orkestrasyonu, e-Güven, Uluslararası |

---

*Connective Hub Dijital Teknolojiler Ltd. Şti. — 7fil.com.tr*  
*"Evin için doğru adım."*
