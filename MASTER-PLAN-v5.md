# 7fil.com.tr — MASTER PLAN v6.0
### Connective Hub Dijital Teknolojiler Ltd. Şti.
> **Son Güncelleme:** 29 Haziran 2026 · **Versiyon:** 6.0.0  
> **Tema:** *Phase 1 "Bekleme Odası" Tamamlandı · Eylül 2026 Grand Opening*  
> **Sprint Durumu:** Staging canlı ✅ · FILTERRA.AI demo live · Beta davetleri sırada 🚀

---

## 📋 İçindekiler

1. [Vizyon & Hedef](#1-vizyon)
2. [30 Modül Haritası](#2-30-modul)
3. [Ekip Yapısı — 11 Mühendis Ajanı](#3-ekip)
4. [Test Moduna Gidiş — 6 Haftalık Sprint](#4-test-modu)
5. [Modül-Mühendis Atama Tablosu](#5-atama-tablosu)
6. [Güncel Durum — Hangi Modül Nerede?](#6-güncel-durum)
7. [Kritik Yol Analizi (Test Modu Bloklayıcıları)](#7-kritik-yol)
8. [Teknik Altyapı Kontrol Listesi](#8-teknik-kontrol)
9. [Pazarlama Entegrasyonu](#9-pazarlama)

---

## 1. Vizyon & Hedef

```
MİSYON : Türkiye'de gayrimenkul almak, satmak, kiralamak ve yönetmek
         için tek platform — hukuk · finans · AI · müzayede hepsi dahil.

HEDEF  : 6 hafta içinde Test Modunda → Beta kullanıcılar davet edilecek
         3 ay içinde 10 pilot şehirde 100 aktif acenta
         6 ay içinde 10.000 ilan, 50.000 kayıtlı kullanıcı

KONUMLandırMA:
  • Sahibinden → sadece ilan portalı (2005 mantığı)
  • 7fil       → entegre ekosistem (ilan + hukuk + finans + AI + müzayede)
```

---

## 2. 30 Modül Haritası

### KATMAN 1 — ÇEKIRDEK PLATFORM (Test Modu İçin Zorunlu)

| # | Modül | Kod Adı | Durum | Öncelik |
|---|-------|---------|-------|---------|
| M01 | Auth & Kullanıcı Yönetimi | `AUTH` | ✅ Canlı | P0 |
| M02 | İlan Yönetimi & Fotoğraf | `LISTINGS` | ✅ Canlı | P0 |
| M03 | Arama & Harita Motoru | `SEARCH` | ✅ Canlı | P0 |
| M04 | Emlakçı Paneli (Dashboard) | `AGENT-PANEL` | ✅ Canlı | P0 |
| M05 | Alıcı Deneyimi & Favoriler | `BUYER` | ✅ Canlı | P0 |
| M06 | Abonelik & Ödeme Sistemi | `BILLING` | ✅ Canlı | P0 |
| M07 | Admin Paneli | `ADMIN` | ✅ Canlı | P0 |

### KATMAN 2 — AI & DEĞER KATMANLAR (Test Modunda Aktif Olacak)

| # | Modül | Kod Adı | Durum | Öncelik |
|---|-------|---------|-------|---------|
| M08 | FILTERRA.AI — İlan Yazarı & SEO | `FILTERRA-CONTENT` | ✅ Canlı | P1 |
| M09 | FILTERRA.AI — Değerleme & Trend | `FILTERRA-VALUATION` | ✅ Canlı | P1 |
| M10 | FILTERRA.AI — Hukuki Ön Kontrol | `FILTERRA-LEGAL` | ✅ Canlı | P1 |
| M11 | FILTERRA.AI — Mahalle & Çevre | `FILTERRA-NEIGHBORHOOD` | ✅ Canlı | P1 |
| M12 | Atlas AI Asistan | `ATLAS` | ✅ Canlı | P1 |
| M13 | SCRIBE — İçerik & Sosyal Medya | `SCRIBE` | ✅ Canlı | P1 |
| M14 | FILTERRA.AI — Fotoğraf & Çeviri | `FILTERRA-MEDIA` | ✅ Canlı | P2 |

### KATMAN 3 — KURUMSAL & FİNANS (Test Modunda Beta)

| # | Modül | Kod Adı | Durum | Öncelik |
|---|-------|---------|-------|---------|
| M15 | Hukuki Doğrulama & Sertifika | `LEGAL` | ✅ Canlı | P1 |
| M16 | Mortgage & Sigorta | `FINANCE` | ✅ Canlı | P1 |
| M17 | Müzayede Sistemi (WebSocket) | `AUCTION` | ✅ Canlı | P2 |
| M18 | MLS Portföy Paylaşımı | `MLS` | ✅ Canlı | P2 |
| M19 | CRM — Lead Yönetimi | `CRM` | ✅ Canlı | P1 |
| M20 | Analitik & Raporlama | `ANALYTICS` | ✅ Canlı | P1 |

### KATMAN 4 — BÜYÜME & DAĞITIM

| # | Modül | Kod Adı | Durum | Öncelik |
|---|-------|---------|-------|---------|
| M21 | White-Label & Subdomain SaaS | `WHITELABEL` | ✅ Canlı | P2 |
| M22 | TicariMetre — Piyasa Analizi | `TICARI` | ✅ Canlı | P2 |
| M23 | Partner Portal & Referral | `PARTNER` | ✅ Canlı | P2 |
| M24 | Mobile App (Expo) | `MOBILE` | ✅ Hazır | P1 |
| M25 | Mail / Push / WhatsApp Bildirimleri | `HERALD` | ✅ Canlı | P0 |

### KATMAN 5 — SPRINT 4+ (Post-Test Mode)

| # | Modül | Kod Adı | Durum | Öncelik |
|---|-------|---------|-------|---------|
| M26 | PDF Broşür Motoru | `PDF-ENGINE` | 🔶 Planlandı | P2 |
| M27 | Property Management & Sağlık Skoru | `PROP-MGMT` | 🔶 Planlandı | P3 |
| M28 | Depozito Güvence & FinTech Escrow | `ESCROW` | 🔶 Planlandı | P3 |
| M29 | AI Search / Doğal Dil Arama | `NLS-SEARCH` | 🆕 Sprint 4 | P2 |
| M30 | YT-Director & İçerik Motoru | `YT-DIRECTOR` | 🆕 Sprint 4 | P3 |

---

## 3. Ekip Yapısı — 11 Mühendis Ajanı

### BAŞ MÜHENDİS (Lead Engineer)

```
┌─────────────────────────────────────────────────────────────────────┐
│  AJAN: ARCHITECT                                                      │
│  Unvan: Baş Mühendis / Platform Mimarı                               │
│  Model: claude-opus-4-8 (en güçlü karar verici)                     │
│                                                                        │
│  Sorumluluklar:                                                       │
│  • Tüm mimari kararların son onayı                                    │
│  • Cross-modül bağımlılık yönetimi                                    │
│  • Test modu deployment koordinasyonu                                  │
│  • Sprint planlama ve öncelik belirleme                               │
│  • Kod review (kritik path'ler)                                       │
│  • API versiyonlama ve breaking change yönetimi                       │
│                                                                        │
│  Modüller: Tüm mimari — M01'den M30'a kadar                          │
│  Raporlama: Doğrudan Fevzi Torun'a                                   │
└─────────────────────────────────────────────────────────────────────┘
```

### BACKEND MÜHENDİSLERİ

```
┌─────────────────────────────────────────────────────────────────┐
│  AJAN: BACKEND-CORE                                              │
│  Unvan: Kıdemli Backend Mühendisi — Çekirdek Platform           │
│  Model: claude-sonnet-4-6                                        │
│                                                                   │
│  Birincil Modüller: M01, M02, M03, M06                          │
│  • Auth sistemi (JWT, refresh token, KVKK)                       │
│  • Listing CRUD + PostGIS coğrafi işlemler                       │
│  • Meilisearch entegrasyonu ve indexing                          │
│  • İyzico 3DS ödeme + abonelik yaşam döngüsü                    │
│  • API rate limiting + güvenlik middleware                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  AJAN: BACKEND-AI                                                │
│  Unvan: Kıdemli Backend Mühendisi — AI & Ajan Sistemi          │
│  Model: claude-sonnet-4-6                                        │
│                                                                   │
│  Birincil Modüller: M08-M14, M29                                │
│  • FILTERRA.AI 8 ajan entegrasyonu (OpenAI / Claude)            │
│  • Atlas AI konuşma motoru                                       │
│  • SCRIBE içerik üretim pipeline                                 │
│  • Token cost tracking ve rate limiting                          │
│  • AI Search / NLS endpoint (Sprint 4)                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  AJAN: BACKEND-FINANCE                                           │
│  Unvan: Backend Mühendisi — Finans & Hukuk                     │
│  Model: claude-sonnet-4-6                                        │
│                                                                   │
│  Birincil Modüller: M15, M16, M17, M28                         │
│  • Legal case yönetimi + sertifika sistemi                       │
│  • Mortgage hesaplayıcı + banka lead akışı                      │
│  • Sigorta teklif motoru (DASK + konut)                         │
│  • Müzayede WebSocket + auto-bid mantığı                         │
│  • Depozito Escrow sistemi (Sprint 4)                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  AJAN: BACKEND-GROWTH                                            │
│  Unvan: Backend Mühendisi — Büyüme & Entegrasyon               │
│  Model: claude-sonnet-4-6                                        │
│                                                                   │
│  Birincil Modüller: M18, M19, M21, M23, M25                    │
│  • MLS portföy paylaşım sistemi                                  │
│  • CRM lead pipeline + aktivite log                              │
│  • White-label subdomain + custom domain                         │
│  • Partner referral + komisyon hesaplama                         │
│  • Mail/Push/WhatsApp bildirim orchestrasyonu                   │
└─────────────────────────────────────────────────────────────────┘
```

### FRONTEND MÜHENDİSLERİ

```
┌─────────────────────────────────────────────────────────────────┐
│  AJAN: FRONTEND-WEB                                              │
│  Unvan: Kıdemli Frontend Mühendisi — Web                        │
│  Model: claude-sonnet-4-6                                        │
│                                                                   │
│  Birincil Modüller: M04, M05, M07, M20, M22                    │
│  • Emlakçı paneli UX (dashboard, ilan, CRM, analitik)           │
│  • Alıcı deneyimi (arama, ilan detay, favoriler)                 │
│  • Admin paneli (15 bölüm)                                       │
│  • TicariMetre piyasa analiz sayfaları                          │
│  • Design token entegrasyonu (Claude Design → CSS)              │
│  • Core Web Vitals optimizasyonu                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  AJAN: FRONTEND-MOBILE                                           │
│  Unvan: Frontend Mühendisi — Mobile & Cross-platform            │
│  Model: claude-sonnet-4-6                                        │
│                                                                   │
│  Birincil Modüller: M24, M25                                    │
│  • Expo React Native — 8 ekran                                  │
│  • EAS Build + App Store / Play Store submit                    │
│  • Push notification (Expo + Firebase)                           │
│  • Offline-first map ve ilan browsing                           │
│  • Shared packages/ui entegrasyonu                              │
└─────────────────────────────────────────────────────────────────┘
```

### UZMAN MÜHENDİSLER

```
┌─────────────────────────────────────────────────────────────────┐
│  AJAN: DEVOPS                                                    │
│  Unvan: DevOps & Platform Mühendisi                             │
│  Model: claude-sonnet-4-6                                        │
│                                                                   │
│  Sorumluluklar:                                                  │
│  • Railway API deploy (Dockerfile + otomatik rollback)          │
│  • Vercel web-7fil + partner-portal deploy                      │
│  • GitHub Actions CI/CD pipeline                                 │
│  • PostgreSQL + PostGIS backup ve migration yönetimi            │
│  • Meilisearch index yönetimi                                    │
│  • Cloudflare R2 CDN + rate limit                               │
│  • SSL sertifikaları + custom domain DNS                        │
│  • Uptime monitoring + alert kurulumu                           │
│  • Staging ortamı (test.7fil.com.tr)                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  AJAN: QA-ENGINEER                                               │
│  Unvan: QA Mühendisi — Test & Kalite Güvencesi                 │
│  Model: claude-haiku-4-5-20251001                                │
│                                                                   │
│  Sorumluluklar:                                                  │
│  • Kritik akışların E2E testi (Playwright)                      │
│  • API endpoint smoke test (Jest + Supertest)                   │
│  • Mobile UI test (Maestro veya Detox)                          │
│  • Yük testi (k6 — mortgage calc, arama)                       │
│  • Bug triaj ve öncelik atama                                    │
│  • Test modu onay checklist yönetimi                            │
└─────────────────────────────────────────────────────────────────┘
```

### BÜYÜME & İŞ GELİŞTİRME

```
┌─────────────────────────────────────────────────────────────────┐
│  AJAN: MARKETING-ENGINEER                                        │
│  Unvan: Pazarlama Mühendisi — Growth & Acquisition              │
│  Model: claude-sonnet-4-6                                        │
│                                                                   │
│  Sorumluluklar:                                                  │
│  • SCRIBE ajanı ile içerik üretim pipeline kurma                │
│  • SEO altyapısı (sitemap, robots.txt, schema.org)             │
│  • Google Analytics 4 + Meta Pixel entegrasyonu                │
│  • İlan sayfası SEO optimizasyonu (Next.js metadata API)       │
│  • Email drip kampanya kurulumu (acenta onboarding)            │
│  • WhatsApp Business API kampanya akışları                      │
│  • A/B test altyapısı (öneri: Statsig / GrowthBook)            │
│  • Referral programı mekanikleri (partner.7fil.com.tr)         │
│  • Sosyal medya otomasyon pipeline (SCRIBE → Buffer)           │
│  Modüller: M13, M25, M23, M30                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  AJAN: BIZ-DEV-ENGINEER                                          │
│  Unvan: İş Geliştirme Mühendisi — Partnerships & SaaS          │
│  Model: claude-sonnet-4-6                                        │
│                                                                   │
│  Sorumluluklar:                                                  │
│  • Acenta onboarding flow'u (white-label + MLS)                 │
│  • SaaS fiyatlandırma tier yönetimi (free/pro/corporate)       │
│  • Banka & sigorta partner entegrasyonları                      │
│  • Avukat ağı oluşturma (hukuk modülü feed)                   │
│  • API marketplace stratejisi (partner API key sistemi)        │
│  • 10 şehir pilot planı koordinasyonu                           │
│  • Acenta başvuru ve onay pipeline optimizasyonu               │
│  • Komisyon yapısı: MLS, partner, referral                     │
│  Modüller: M18, M21, M23, M15, M16                            │
└─────────────────────────────────────────────────────────────────┘
```

### EKIP DİYAGRAMI

```
                    ┌──────────────┐
                    │   FEVZİ      │
                    │   TORUN      │
                    │  (Kurucu)    │
                    └──────┬───────┘
                           │
                    ┌──────┴───────┐
                    │  ARCHITECT   │
                    │  (Baş Müh.)  │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────┴────┐        ┌────┴────┐       ┌────┴────┐
   │BACKEND  │        │FRONTEND │       │ UZMAN   │
   │ GRUBU   │        │  GRUBU  │       │  GRUBU  │
   └────┬────┘        └────┬────┘       └────┬────┘
        │                  │                  │
 ┌──────┼──────┐    ┌──────┴──────┐   ┌──────┼──────┐
 │      │      │    │             │   │      │      │
CORE   AI  FINANCE  WEB        MOBILE DEVOPS  QA   BIZ-DEV
      GROWTH                                  MARKETING
```

---

## 4. Test Moduna Gidiş — 6 Haftalık Sprint

### Hafta 1 — Altyapı & Deploy (DevOps + Architect)

```
HEDEF: staging.7fil.com.tr → canlıda, tüm servisler ayakta

Görevler:
□ Railway: API deploy (Dockerfile) + health check /api/v1/health
□ Vercel: web-7fil preview → staging subdomain
□ PostgreSQL: init.sql migration staging ortamına
□ Meilisearch: index oluşturma + Turkish dil konfigürasyonu
□ Cloudflare R2: bucket + CORS konfigürasyonu
□ .env.staging: tüm secret'lar Railway/Vercel'e girildi mi?
□ Custom domain: staging.7fil.com.tr DNS
□ SSL: Let's Encrypt otomatik
□ Uptime monitoring: UptimeRobot / Better Uptime kurulumu

KPI: /api/v1/health → 200 OK · web-7fil ana sayfa → yükleniyor
```

### Hafta 2 — Kritik Akış Testleri (QA + Backend-Core)

```
HEDEF: 5 kritik kullanıcı akışı hatasız çalışıyor

Akış 1: Kayıt → Giriş → Profil tamamlama
  □ Kayıt formu (e-posta + şifre + TC kimlik)
  □ E-posta doğrulama OTP (**BLOKLAYICI** — hâlâ eksik)
  □ JWT token → cookie → refresh akışı
  □ Şifremi unuttum → sıfırlama akışı

Akış 2: İlan oluşturma → Yayına alma
  □ Form doldurma (tüm zorunlu alanlar)
  □ Fotoğraf yükleme → R2 → URL döndürme
  □ Meilisearch indexleme (otomatik)
  □ WhatsApp deep link üretimi
  □ 15 günlük expire otomasyonu

Akış 3: Arama → Harita → İlan detay
  □ Full-text arama (Türkçe karakter desteği)
  □ Harita görünümü (PostGIS radius)
  □ Filtreleme (fiyat, alan, oda, şehir)
  □ İlan detay sayfası yükleme süresi < 2s

Akış 4: Abonelik → Ödeme → Aktivasyon
  □ Plan seçimi (free/pro/corporate)
  □ İyzico 3DS test kartı ile ödeme
  □ Webhook: payment → abonelik aktivasyonu
  □ Fatura PDF (ileride: PDF engine)

Akış 5: Admin panel → İlan moderasyonu
  □ Admin girişi (role: admin)
  □ İlan listesi + onay/red akışı
  □ Kullanıcı yönetimi

KPI: 5 akışın tamamı manuel test geçti → QA sign-off
```

### Hafta 3 — AI Modülleri Aktivasyonu (Backend-AI + QA)

```
HEDEF: FILTERRA.AI + Atlas + SCRIBE staging'de çalışıyor

□ OpenAI API key staging'e tanımlı  ← deploy'da env var olarak gir
□ Anthropic API key staging'e tanımlı ← deploy'da env var olarak gir
✅ FILTERRA: listing_writer → SSE streaming uygulandı (FilterraPanel.tsx)
✅ FILTERRA: valuation → fiyat tahmini döndür (valuation.agent.ts)
✅ FILTERRA: neighborhood → mahalle skoru döndür (neighborhood.agent.ts)
✅ FILTERRA: legal_precheck → ön kontrol çalışıyor (legal-precheck.agent.ts)
✅ Atlas AI: konuşma → bağlam koruyor (son 20 mesaj, atlas_conversations DB)
✅ SCRIBE: blog post üret → format doğru (generated_contents tablosu)
✅ Token maliyet takibi: GET /admin/ai/stats → admin/ai-ajanlar sayfası
✅ Rate limiting: FILTERRA 20/dk · Atlas 30/dk · SCRIBE 10/dk

KOD HAZIR — staging'de ANTHROPIC_API_KEY env var ile aktif olacak
KPI: Her ajanın başarı oranı > %95 · ortalama yanıt süresi < 5s
```

### Hafta 4 — Mobile & Portal (Frontend-Mobile + BizDev)

```
HEDEF: Expo app staging API'ye bağlı, Partner Portal canlı

Mobile:
□ EAS Build → APK (Android) + TestFlight (iOS)
□ Staging API URL → app.json'a
□ Push notification test (iOS simulator + Android emulator)
□ Ilan listesi → sonsuz scroll
□ Favoriler → yerel + sunucu sync

Partner Portal:
□ Vercel deploy → partner-staging.7fil.com.tr
□ Partner kayıt + API key alma
□ Referral link üretimi test
□ Komisyon hesaplama doğruluğu

KPI: APK test grubuna dağıtıldı · Partner Portal 1 test partner girişi yaptı
```

### Hafta 5 — Performans & Güvenlik (DevOps + Architect)

```
HEDEF: Production-ready güvenlik & performans standardı

Performans:
□ Lighthouse CI: Performance > 80, Accessibility > 90
□ Meilisearch arama: < 100ms yanıt
□ API P95 latency: < 300ms (k6 yük testi)
□ Fotoğraf optimizasyonu: WebP + Cloudflare CDN
□ Next.js ISR: ilan sayfaları cache'li

Güvenlik:
□ OWASP Top 10 taraması (Snyk / ZAP)
□ SQL injection testi (TypeORM parametrize — kontrol)
□ JWT secret rotation planı
□ Rate limiting: auth endpoint'leri (5 req/min)
□ KVKK: kişisel veri şifreleme + audit log kontrolü
□ Secret scanning: GitHub CodeQL aktif

KPI: Lighthouse > 80 · sıfır kritik güvenlik açığı
```

### Hafta 6 — Soft Launch: Test Modu (Tüm Ekip)

```
HEDEF: test.7fil.com.tr → kapalı beta, 50 davetli kullanıcı

□ Production ortamı konfigürasyonu
□ "Beta" banner + feedback formu
□ Hata izleme: Sentry entegrasyonu
□ Analytics: GA4 + Hotjar
□ Onboarding email dizisi (SCRIBE ile yazıldı)
□ 10 pilot acenta davet edildi + onboarded
□ 5 test alıcı profili oluşturuldu
□ Admin: moderasyon kuyruğu aktif
□ Destek: WhatsApp destek hattı açık
□ Runbook: bilinen hata → çözüm prosedürleri

KPI: 50 kayıtlı kullanıcı · 20 test ilanı · sıfır P0 bug
```

---

## 5. Modül-Mühendis Atama Tablosu

| Modül | Birincil | İkincil | Durum |
|-------|---------|---------|-------|
| M01 Auth | BACKEND-CORE | ARCHITECT | ✅ |
| M02 Listings | BACKEND-CORE | FRONTEND-WEB | ✅ |
| M03 Search | BACKEND-CORE | BACKEND-AI | ✅ |
| M04 Agent Panel | FRONTEND-WEB | BACKEND-CORE | ✅ |
| M05 Buyer | FRONTEND-WEB | BACKEND-CORE | ✅ |
| M06 Billing | BACKEND-FINANCE | BACKEND-CORE | ✅ |
| M07 Admin | FRONTEND-WEB | BACKEND-CORE | ✅ |
| M08 FILTERRA-Content | BACKEND-AI | — | ✅ |
| M09 FILTERRA-Valuation | BACKEND-AI | BACKEND-FINANCE | ✅ |
| M10 FILTERRA-Legal | BACKEND-AI | BACKEND-FINANCE | ✅ |
| M11 FILTERRA-Neighborhood | BACKEND-AI | — | ✅ |
| M12 Atlas AI | BACKEND-AI | ARCHITECT | ✅ |
| M13 SCRIBE | BACKEND-AI | MARKETING-ENGINEER | ✅ |
| M14 FILTERRA-Media | BACKEND-AI | FRONTEND-WEB | ✅ |
| M15 Legal | BACKEND-FINANCE | BIZ-DEV | ✅ |
| M16 Finance | BACKEND-FINANCE | BIZ-DEV | ✅ |
| M17 Auction | BACKEND-FINANCE | FRONTEND-WEB | ✅ |
| M18 MLS | BACKEND-GROWTH | BIZ-DEV | ✅ |
| M19 CRM | BACKEND-GROWTH | FRONTEND-WEB | ✅ |
| M20 Analytics | BACKEND-GROWTH | FRONTEND-WEB | ✅ |
| M21 White-Label | BACKEND-GROWTH | BIZ-DEV | ✅ |
| M22 TicariMetre | BACKEND-GROWTH | FRONTEND-WEB | ✅ |
| M23 Partner | BACKEND-GROWTH | BIZ-DEV | ✅ |
| M24 Mobile | FRONTEND-MOBILE | BACKEND-CORE | ✅ Hazır |
| M25 Herald | BACKEND-GROWTH | MARKETING-ENGINEER | ✅ |
| M26 PDF Engine | BACKEND-CORE | FRONTEND-WEB | 🔶 Sprint 4 |
| M27 Prop Management | BACKEND-FINANCE | BACKEND-CORE | 🔶 Sprint 4 |
| M28 Escrow | BACKEND-FINANCE | ARCHITECT | 🔶 Sprint 4 |
| M29 AI Search / NLS | BACKEND-AI | FRONTEND-WEB | 🆕 Sprint 4 |
| M30 YT-Director | BACKEND-AI | MARKETING-ENGINEER | 🆕 Sprint 4 |

---

## 6. Güncel Durum — Hangi Modül Nerede?

```
GÜNCEL: 29 Haziran 2026 — Phase 1 "Bekleme Odası" TAMAMLANDI ✅

KOD DURUMU (GitHub'da ✅):
  M01-M25 → Tüm kod tamamlandı ✅
  Git: 28+ commit · GitHub main branch'e push edildi ✅
  API: 126 kaynak dosya · 23 modül · 1136 satırlık init.sql
  Web: 80+ kaynak dosya · 22+ sayfa
  Mobile: 17 kaynak dosya · 8 ekran

SPRINT HAFTA 1-2 TAMAMLANANLAR (9-15 Haz):
  ✅ M01 E-posta OTP doğrulama (email_verification_tokens + akış)
  ✅ M03 Meilisearch Türkçe config (30 stopword, 14 synonym)
  ✅ SEO: robots.ts, sitemap.ts, Schema.org JSON-LD, OG/Twitter meta
  ✅ Sentry: API + Web · PostHog: App Router uyumlu
  ✅ TypeScript 0 hata — API + Web (NestJS 10 + TS 5.9 uyumu)
  ✅ EmailVerifiedGuard · Listing expire cron · token cleanup cron
  ✅ panel/ilanlar/[id]: fotoğraf drag&drop + yayına alma akışı
  ✅ pnpm v11 + Node 22 · Dockerfile + CI/deploy düzeltmeleri

SPRINT HAFTA 3 TAMAMLANANLAR (24-29 Haz) — "Bekleme Odası" Phase 1:
  ✅ Landing page: Navy/Gold Coming Soon (Zoopla kalitesi üzeri)
     - Ara butonu → Lead Capture Modal (SSR hydration fix)
     - CountdownTimer: Eylül 2026 geri sayım
     - LeadCounter: Canlı DB'den ön kayıt sayacı
     - 6 Türk şehir + 4 uluslararası kart (Londra/Dubai/Kıbrıs/Yunanistan)
  ✅ Public Leads API: POST + GET /api/v1/public/leads(/count) — auth yok
  ✅ /beta/giris — VIP Navy/Gold giriş sayfası (Partner Erişimi)
  ✅ /beta/panel — Kurucu Üye dashboard (taslak ilan + yol haritası)
  ✅ robots.txt: /panel/, /admin/, /beta/, /ara Google'dan gizli
  ✅ DB schema canlıya uygulandı (Railway PostgreSQL — 39 tablo):
     - public_leads tablosu
     - listings.is_international BOOLEAN
     - user_role_enum: 'beta_user' eklendi
     - property_type_enum: 'overseas' eklendi
  ✅ vercel.json NEXT_PUBLIC_API_URL düzeltildi (/api/v1 prefix)
  ✅ FILTERRA.AI İnteraktif Demo (landing page'e eklendi):
     - 9 şehir · m² · oda · bina yaşı girişi
     - 4 adım AI animasyon (2 sn) + sonuç kartı
     - Satıcı lead capture: PDF rapor e-posta formu
     - POST /public/leads → utmSource: 'filterra_demo'

STAGING DURUMU (29 Haz 2026):
  ✅ API: https://connective-hub-monorepo-production.up.railway.app (Railway)
  ✅ Web: https://7fil.com.tr (Vercel, main branch otomatik deploy)
  ✅ DB: Railway PostgreSQL — 39 tablo, Online
  ✅ NEXT_PUBLIC_API_URL: .../api/v1 ✅

PRODUCTION:
  Eylül 2026 — grand opening (7fil.com.tr'ye custom domain bağlanacak)

SIRADAY KİLER (Öncelik Sırasıyla):
  🔴 DB şifre rotasyonu (Railway → PostgreSQL → Settings → Regenerate)
  🔴 RAILWAY_TOKEN → GitHub Secrets'a ekle
  ⬜ 50 pilot acenta beta daveti → /beta/giris'e yönlendir
  ⬜ Mobile EAS Build (Expo → APK + TestFlight)
  ⬜ Partner Portal Vercel deploy

EKSIK KOD:
  M26: PDF Broşür → Sprint 4
  M27: Property Management → Sprint 4
  M28: Depozito Escrow → Sprint 4
  M29: AI Search NLS → Sprint 4
  M30: YT-Director → iskelet var, implementasyon Sprint 4
```

---

## 7. Kritik Yol Analizi (Test Modu Bloklayıcıları)

```
✅ BLOKLAYICI 1 (P0): E-posta OTP doğrulama — ÇÖZÜLDÜ (14 Haz)
  email_verification_tokens tablosu, verify + resend endpoint
  /dogrula-email + /dogrula-email/bekliyor sayfaları

✅ BLOKLAYICI 4 (P1): Meilisearch Turkish config — ÇÖZÜLDÜ (14 Haz)
  30 Türkçe stopword · 14 synonym grubu · özel ranking kuralları

✅ BLOKLAYICI 2 (P0): GitHub push — ÇÖZÜLDÜ (15 Haz)
  24 commit force-push ile GitHub main'e yazıldı
  GitHub Actions CI/CD aktif (pnpm v11 güncellemesiyle)

✅ BLOKLAYICI 3 (P1): Staging deploy — ÇÖZÜLDÜ (29 Haz)
  API: Railway canlı · Web: Vercel canlı · DB: 39 tablo online
  NEXT_PUBLIC_API_URL /api/v1 prefix düzeltildi

🔴 YENİ GÖREV (P0): DB şifresi rotasyonu
  Railway public URL konuşmada açığa çıktı → Railway → PostgreSQL → Settings → Regenerate
  
🔴 YENİ GÖREV (P0): RAILWAY_TOKEN → GitHub Secrets
  Token: 361dd92... → Repo Settings → Secrets → RAILWAY_TOKEN olarak ekle

⚠️  RİSK 1 (P2): İyzico test modu
  IYZICO_API_KEY + IYZICO_SECRET_KEY staging'e girilmeli
  Sandbox key .env.example'da mevcut (sandbox-... ile başlıyor)
  ETA: Railway env vars girerken ekle

⚠️  RİSK 2 (P2): WebSocket (Socket.IO) + Railway
  Railway WebSocket desteği var ama sticky session gerekebilir
  ETA: Müzayede modülü teste alınmadan önce

─── STAGING KURULUM REHBERİ (3 Adım) ───────────────────────────────────────

ADIM 1 — Railway (API + PostgreSQL + Meilisearch):
  1. railway.app → New Project → Deploy from GitHub Repo
  2. Repo: fevzitorun/connective-hub-monorepo seç
  3. Root Directory: apps/api (railway.json burada)
  4. + Add Service → PostgreSQL Plugin
  5. + Add Service → Meilisearch (Docker: getmeili/meilisearch:v1.7)
  6. Variables (API servisi) → aşağıdaki env vars'ları gir:
     DATABASE_URL       → Railway PostgreSQL otomatik doldurur
     JWT_SECRET         → openssl rand -hex 32
     REFRESH_TOKEN_SECRET → openssl rand -hex 32
     MEILI_HOST         → http://meilisearch.railway.internal:7700
     MEILI_MASTER_KEY   → güçlü rastgele string
     ANTHROPIC_API_KEY  → sk-ant-...
     R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY
     R2_BUCKET_NAME     → 7fil-media
     SENDGRID_API_KEY   → SG...
     EMAIL_FROM         → noreply@7fil.com.tr
     IYZICO_API_KEY     → sandbox-1NWpEMsMJCHnHg0j9jRvxRTHEePJCNp2
     IYZICO_SECRET_KEY  → sandbox-jaTGxVRTXj6WBVXSnkKa7RRiRz98aQwR
     IYZICO_MODE        → sandbox
     FRONTEND_URL       → https://staging.7fil.com.tr (Vercel URL)
     NODE_ENV           → production
  7. Settings → Domain: api-staging.7fil.com.tr (veya railway subdomain)
  8. Deploy butonuna bas → build log izle

ADIM 2 — Vercel (web-7fil):
  1. vercel.com → New Project → Import Git Repository
  2. Repo: fevzitorun/connective-hub-monorepo
  3. Framework: Next.js
  4. Root Directory: apps/web-7fil
  5. Environment Variables:
     NEXT_PUBLIC_API_URL    → https://[railway-url]/api/v1
     NEXT_PUBLIC_APP_URL    → https://[vercel-url]
     NEXT_PUBLIC_MAPBOX_TOKEN → pk.eyJ1...
     NEXT_PUBLIC_POSTHOG_KEY  → phc_...
     NEXT_PUBLIC_POSTHOG_HOST → https://eu.posthog.com
     NEXT_PUBLIC_SENTRY_DSN  → https://...@sentry.io/...
  6. Deploy

ADIM 3 — GitHub Actions Secrets (otomatik deploy için):
  Repo → Settings → Secrets → Actions:
  RAILWAY_TOKEN      → railway.app → Account → API Tokens
  VERCEL_TOKEN       → vercel.com → Account → Tokens
  VERCEL_ORG_ID      → vercel.com → Settings → Team ID
  VERCEL_PROJECT_ID_WEB → Vercel Project Settings → Project ID
  NEXT_PUBLIC_API_URL  → https://[railway-url]/api/v1

SONRAKI ADIMLAR (öncelik sırasıyla):
  1. ✅ TAMAMLANDI — GitHub push
  2. 🔴 Railway API deploy (Adım 1 → yukarıda)
  3. 🔴 Vercel web-7fil deploy (Adım 2 → yukarıda)
  4. 🔴 DB migration: init.sql çalıştır → apps/api/db/init.sql
  5. 🔴 Meilisearch index sync: POST /api/v1/search/sync (admin)
  6. E2E manuel test: 5 kritik akış → staging ortamında
```

---

## 8. Teknik Altyapı Kontrol Listesi

### Deployment

- [ ] Railway: API projesi oluşturuldu + PostgreSQL + Meilisearch eklendi ← AKTİF
- [ ] Vercel: web-7fil projesi bağlandı (GitHub repo) ← AKTİF
- [ ] Vercel: partner-portal projesi bağlandı
- [ ] Cloudflare R2: bucket oluşturuldu + CORS ayarlandı
- [ ] DNS: staging.7fil.com.tr + api-staging.7fil.com.tr
- [ ] DB migration: init.sql çalıştırıldı (Railway console veya psql)
- [ ] Meilisearch index sync: /admin/search/sync endpoint çağrıldı

### Güvenlik

- [ ] JWT_SECRET + JWT_REFRESH_SECRET → güçlü random string
- [ ] OPENAI_API_KEY + ANTHROPIC_API_KEY → Railway secret
- [ ] IYZICO API key test modu doğrulandı
- [ ] Rate limiting aktif: auth (5/min), API (100/min)
- [ ] CORS whitelist: sadece izinli domainler
- [ ] HttpOnly cookie: secure + sameSite=strict

### İzleme

- [x] Sentry: web-7fil + API entegrasyonu ✅
- [x] PostHog: sayfa izleme, kullanıcı analitik ✅
- [ ] Uptime monitoring: UptimeRobot
- [ ] Railway metrics: CPU/RAM alert
- [ ] DB backup: günlük otomatik

### CI/CD (.github/workflows/)

- [x] ci.yml: lint + test + type-check ✅
- [x] deploy.yml: main → Railway + Vercel ✅
- [x] pnpm v11 güncellendi (Dockerfile + CI + deploy) ✅
- [ ] GitHub Actions secrets eklendi (RAILWAY_TOKEN, VERCEL_TOKEN vb.) ← AKTİF
- [ ] staging branch tanımlandı (staging → test ortamı)
- [ ] Semantic versioning: Release Drafter aktif

---

## 9. Pazarlama Entegrasyonu

*Detaylar için [MARKETING-PLAN.md](MARKETING-PLAN.md) bak.*

### Teknik Pazarlama Altyapısı (MARKETING-ENGINEER görevi)

```
Test Modu Öncesi Yapılacaklar:
✅ robots.ts + sitemap.ts → Next.js App Router native
✅ Schema.org RealEstateListing JSON-LD → ilan detay sayfası
✅ Open Graph + Twitter Card meta → layout.tsx + ilan sayfaları
✅ PostHog → sayfa izleme entegre
□ Meta Pixel → temel event tracking
□ Hotjar → kullanıcı davranış haritası

İlk 30 Gün Kampanya:
□ SCRIBE → 10 SEO blog yazısı üret ve yayınla
□ "7fil nedir?" videosu → YT-Director agent ile script
□ WhatsApp Business → acenta onboarding mesaj şablonu
□ Instagram/Twitter → SCRIBE social pack × 30 post
□ LinkedIn → B2B acenta hedefli içerik
```

---

## Sürüm Geçmişi

| Versiyon | Tarih | Değişiklikler |
|----------|-------|---------------|
| v1.0 | 2025 Q4 | İlk prototip |
| v2.0 | 2026 Q1 | FILTERRA, Müzayede, Hukuk, Finans |
| v3.0 | 2026 May | MLS, Google I/O 2026 Search vizyonu |
| v4.0 | 2026 Haz | Admin, CRM, Mobile, SCRIBE, Kurumsal Kimlik |
| v5.0 | 9 Haz 2026 | 30 Modül · 11 Ajan Ekip · Test Modu Sprint'i |
| v5.1 | 14 Haz 2026 | P0 blokaj çözümleri: email OTP, Meilisearch TR, SEO, Sentry, PostHog |
| v5.2 | 15 Haz 2026 | 5 kritik akış kodu tamamlandı · TypeScript 0 hata · GitHub push · Staging deploy rehberi |
| **v5.3** | **24 Haz 2026** | **AI rate limiting · token stats API · Hafta 3 AI modülleri kod hazır · CLAUDE.md + README.md** |
| v5.3 | Haz 2026 | Staging deploy tamamlandı → Test Modu → 50 beta kullanıcı |
| v6.0 | 2026 Q3 | PDF, Property Mgmt, Escrow, AI Search |
| v7.0 | 2026 Q4 | Full Agent Orkestrasyonu, e-Güven, Uluslararası |

---

*Connective Hub Dijital Teknolojiler Ltd. Şti. — 7fil.com.tr*  
*"Evin için doğru adım."*
