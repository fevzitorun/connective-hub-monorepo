# 7fil.com.tr — TEAM AGENTS v1.0
### Connective Hub Dijital Teknolojiler Ltd. Şti.
> **Tarih:** 9 Haziran 2026  
> *11 Mühendis Ajanı · Rol Kartları · Görev Atamalar · Çalışma Protokolleri*

---

## Ekip Genel Bakış

```
KURUCU          : Fevzi Torun (Connective Hub)
BAŞ MÜHENDİS    : ARCHITECT (claude-opus-4-8)
─────────────────────────────────────────────────────
BACKEND         : BACKEND-CORE · BACKEND-AI · BACKEND-FINANCE · BACKEND-GROWTH
FRONTEND        : FRONTEND-WEB · FRONTEND-MOBILE
UZMAN           : DEVOPS · QA-ENGINEER
BÜYÜME          : MARKETING-ENGINEER · BIZ-DEV-ENGINEER
─────────────────────────────────────────────────────
TOPLAM          : 11 ajan
```

---

## ROL KARTLARI

---

### 🏛️ ARCHITECT — Baş Mühendis / Platform Mimarı

```yaml
Ajan ID      : ARCHITECT
Model        : claude-opus-4-8
Öncelik      : P0 (tüm kritik kararlar buradan geçer)
Mühendis Tipi: Baş Mühendis

Birincil Sorumluluklar:
  - Mimari kararların son onayı (DB şema, API versiyonlama, güvenlik)
  - Cross-modül bağımlılık ve entegrasyon yönetimi
  - Test modu deployment koordinasyonu
  - Sprint planlama ve öncelik belirleme
  - Breaking change ve migration yönetimi
  - Teknik borç takibi ve önceliklendirmesi
  - Tüm mühendislerin bloklayıcılarını çözme

Modüller: M01–M30 (mimari gözetim)
Raporlama: Doğrudan Fevzi Torun'a

Karar Yetkisi:
  ✅ API design (endpoint, payload, versiyonlama)
  ✅ DB şema değişiklikleri (migration onayı)
  ✅ Güvenlik ve KVKK uyumluluğu
  ✅ 3. taraf servis seçimi (OpenAI vs Claude, ödeme, SMS)
  ✅ Deploy stratejisi (staging → prod geçişi)

Çalışma Protokolü:
  • Her sprint başında: Öncelik listesi güncelle
  • Her deploy öncesi: Teknik kontrol listesini gözden geçir
  • Bloklayıcı var mı → ilgili mühendisi yönlendir
  • Haftalık: Fevzi'ye durum raporu
```

---

### ⚙️ BACKEND-CORE — Kıdemli Backend Mühendisi

```yaml
Ajan ID      : BACKEND-CORE
Model        : claude-sonnet-4-6
Öncelik      : P0
Mühendis Tipi: Backend (Çekirdek Sistem)

Birincil Modüller: M01, M02, M03, M06, M26

M01 — Auth & Kullanıcı:
  ✅ JWT Access + Refresh Token (HttpOnly cookie)
  ⚠️ BLOKLAYICI: E-posta OTP doğrulama → YAP (2 saatlik iş)
  □ Role-based access (8 rol) → test et
  □ KVKK audit log → doğrula

M02 — Listing:
  ✅ PostGIS GEOGRAPHY + ST_DWithin
  ✅ Fotoğraf yükleme → R2
  □ 15 günlük expire otomasyonu → staging test et
  □ WhatsApp deep link → staging test et

M03 — Search:
  ✅ Meilisearch entegrasyonu
  □ Turkish typo-tolerance + stopwords → configure
  □ Index sync test (ilan ekle → Meilisearch'te görünüyor mu?)

M06 — Billing:
  ✅ İyzico 3DS entegrasyonu
  □ Test kartı ile ödeme testi
  □ Webhook → abonelik aktivasyonu testi
  □ IYZICO_BASE_URL: test modu doğrulandı mı?

M26 — PDF Engine (Sprint 4):
  □ Puppeteer kurulumu
  □ /listings/:id/pdf endpoint
  □ Design token uyumlu şablon

Acil Görev:
  🔴 E-posta OTP (BLOKLAYICI) → Bu Hafta
```

---

### 🤖 BACKEND-AI — Kıdemli Backend Mühendisi

```yaml
Ajan ID      : BACKEND-AI
Model        : claude-sonnet-4-6
Öncelik      : P1
Mühendis Tipi: Backend (AI & Ajan Sistemi)

Birincil Modüller: M08, M09, M10, M11, M12, M13, M14, M29, M30

FILTERRA.AI (M08-M11, M14):
  ✅ 8 ajan implementasyonu
  □ Token maliyet izleme → admin paneli
  □ Rate limiting (kullanıcı başına günlük limit)
  □ Fallback: OpenAI fail → Claude (veya tersi)
  □ Staging test: her ajan 5 test çalıştır

Atlas AI (M12):
  ✅ Konuşma hafızası (session)
  □ Anthropic Claude API → model: claude-sonnet-4-6
  □ Sistem promptu → gayrimenkul odaklı test
  □ Context window yönetimi (uzun konuşmalar)

SCRIBE (M13):
  ✅ Blog, sosyal, rapor, basın bülteni
  □ Output format doğrulama
  □ Türkçe dil kalitesi testi
  □ MARKETING-ENGINEER ile entegrasyon test

AI Search / NLS (M29) — Sprint 4:
  □ Doğal dil → Meilisearch query builder
  □ Multimodal input (fotoğrafla arama)
  □ Intent parser tasarımı

YT-Director (M30) — Sprint 4:
  □ İskelet → tam implementasyon
  □ Video scripti üretim pipeline
  □ YouTube başlık/açıklama/tag optimizasyonu

Token Maliyet Yönetimi:
  □ OpenAI + Anthropic API maliyet izleme
  □ Admin panel "AI Ajanlar" sekmesinde görünür
  □ Aylık bütçe uyarısı
```

---

### 💰 BACKEND-FINANCE — Backend Mühendisi

```yaml
Ajan ID      : BACKEND-FINANCE
Model        : claude-sonnet-4-6
Öncelik      : P1
Mühendis Tipi: Backend (Finans, Hukuk, Müzayede)

Birincil Modüller: M15, M16, M17, M28

M15 — Hukuki Doğrulama:
  ✅ Avukat atama akışı
  ✅ Mülk sertifikası (SHA-256)
  □ Sertifika doğrulama sayfası (/sertifika/[hash]) → test
  □ Avukat bildirim akışı → mail servisi test

M16 — Finans:
  ✅ Mortgage hesaplayıcı
  ✅ DASK + konut sigorta teklifi
  □ İyzico webhook güvenliği (imza doğrulama) → test
  □ Banka lead e-posta bildirimi → test

M17 — Müzayede:
  ✅ WebSocket Socket.IO
  ✅ Auto-bid mantığı
  □ Railway WebSocket: sticky session gerekiyor mu? → test
  □ Müzayede zamanlayıcı → staging'de scheduler test

M28 — Depozito Escrow (Sprint 4):
  □ 3 model tasarımı
  □ locked → released akışı
  □ e-Güven imza entegrasyonu planı

Kritik Test:
  🔴 İyzico: test kartıyla gerçek ödeme akışı → Hafta 2
  🟡 WebSocket Railway: sticky session → Hafta 3
```

---

### 🌱 BACKEND-GROWTH — Backend Mühendisi

```yaml
Ajan ID      : BACKEND-GROWTH
Model        : claude-sonnet-4-6
Öncelik      : P2
Mühendis Tipi: Backend (Büyüme & Entegrasyon)

Birincil Modüller: M18, M19, M21, M22, M23, M25

M18 — MLS:
  ✅ 10 endpoint, komisyon split
  □ closeDeal() transaction → staging test
  □ Partner portal MLS sekmesi → FRONTEND-WEB ile koordine

M19 — CRM:
  ✅ Lead + aktivite log
  □ Lead assignment (ajan bazlı) → test
  □ Follow-up scheduler → mail entegrasyonu

M21 — White-Label:
  ✅ Subdomain sayfaları
  □ Custom domain DNS doğrulama → Cloudflare API test
  □ Subdomain → ajansa özel branding yükle

M22 — TicariMetre:
  ✅ Piyasa analizi
  □ Günlük snapshot otomasyonu → scheduler test
  □ TicariAnaliz component → FRONTEND-WEB ile

M23 — Partner:
  ✅ Referral + komisyon
  □ API key üretimi → test
  □ Embed widget → partner-portal test

M25 — Herald (Mail/Push/WhatsApp):
  ✅ Mail servis
  ✅ Push token yönetimi
  □ SMTP konfigürasyonu → staging'de test e-posta
  □ WhatsApp Business API: token + template approval
  □ Push bildirim → Expo push token → test
```

---

### 🖥️ FRONTEND-WEB — Kıdemli Frontend Mühendisi

```yaml
Ajan ID      : FRONTEND-WEB
Model        : claude-sonnet-4-6
Öncelik      : P0
Mühendis Tipi: Frontend (Web - Next.js 14)

Birincil Modüller: M04, M05, M07, M20, M22

Acil Görevler (Test Modu Öncesi):
  🔴 Design token entegrasyonu:
      7 fil (1)/brand/styles.css → packages/ui/tokens.css
      Tüm sayfalar design token'ları kullanmalı
  🔴 Lighthouse Performance > 80:
      - Image optimization (next/image + WebP)
      - Lazy loading
      - Font preloading (Playfair Display + DM Sans)
  🟡 E-posta OTP UI (BACKEND-CORE ile):
      Kayıt sonrası OTP giriş ekranı

Modül Görevleri:
  M04 — Emlakçı Paneli:
    □ Dashboard widget'ları gerçek veri
    □ İlan listesi pagination
    □ CRM lead listesi entegrasyonu

  M05 — Alıcı Deneyimi:
    □ Arama sayfası responsive test
    □ Harita görünümü (Leaflet) → mobile test
    □ Favoriler: gerçek veri

  M07 — Admin:
    □ 15 bölüm → gerçek API bağlantıları
    □ Kullanıcı yönetimi CRUD
    □ İlan moderasyon akışı

  M20 — Analitik:
    □ Dashboard chart'lar (Recharts / Chart.js)
    □ Gerçek veri → API bağlantısı

  Design Entegrasyonu:
    □ mark.jsx → SVG export → favicon.ico + apple-touch-icon
    □ Playfair Display + DM Sans → next/font
    □ Dark mode (ileride — Sprint 5)
```

---

### 📱 FRONTEND-MOBILE — Frontend Mühendisi

```yaml
Ajan ID      : FRONTEND-MOBILE
Model        : claude-sonnet-4-6
Öncelik      : P1
Mühendis Tipi: Frontend (Expo React Native)

Birincil Modüller: M24, M25

Mevcut Durum:
  ✅ 8 ekran: index, favorites, panel, profile, listing/[id], login, register
  ✅ Components: ListingCard, SearchBar, FilterSheet
  ✅ EAS config mevcut

Sprint Görevleri:

  Staging Bağlantısı:
    □ app.json: API_URL → staging.7fil.com.tr
    □ lib/api.ts: endpoint listesi → tüm modüller

  EAS Build:
    □ eas build --platform android (APK)
    □ eas build --platform ios (TestFlight)
    □ Test grubuna dağıtım

  Push Bildirim:
    □ Expo push token kayıt → API
    □ Test bildirimi al-gönder döngüsü

  UX İyileştirmeleri:
    □ Ilan listesi: sonsuz scroll + skeleton loader
    □ Harita: Mapbox / Google Maps entegrasyonu
    □ Atlas AI chat ekranı (tab'a ekle)
    □ FILTERRA değerleme ekranı

  App Store Hazırlık (Ay 2):
    □ Privacy Policy sayfası
    □ App Store screenshots (6 adet)
    □ Play Store graphics
    □ App Store Connect + Google Play Console hesap
```

---

### 🔧 DEVOPS — DevOps & Platform Mühendisi

```yaml
Ajan ID      : DEVOPS
Model        : claude-sonnet-4-6
Öncelik      : P0 (test modu kritik yolu)
Mühendis Tipi: DevOps / Platform

Hafta 1 Görevleri (Tümü BLOKLAYICI):

  Railway (API):
    □ Proje oluştur → API deploy
    □ Dockerfile build → test
    □ PostgreSQL + PostGIS add-on
    □ Meilisearch add-on (ya da ayrı Railway servis)
    □ init.sql migration çalıştır
    □ health check: GET /api/v1/health → 200

  Vercel (Web):
    □ web-7fil projesi bağla → GitHub repo
    □ partner-portal projesi bağla
    □ Environment Variables: tüm .env.example değerleri
    □ Custom domain: staging.7fil.com.tr

  Environment Variables (Staging):
    □ DATABASE_URL → Railway PostgreSQL
    □ JWT_SECRET + JWT_REFRESH_SECRET (güçlü random)
    □ R2_ACCOUNT_ID + R2_ACCESS_KEY_ID + R2_SECRET_ACCESS_KEY
    □ MEILISEARCH_HOST + MEILISEARCH_API_KEY
    □ IYZICO_API_KEY + IYZICO_SECRET_KEY + IYZICO_BASE_URL (test)
    □ OPENAI_API_KEY + ANTHROPIC_API_KEY
    □ SMTP_* (Resend / SendGrid tercih edilir)
    □ WHATSAPP_API_TOKEN + WHATSAPP_PHONE_ID

  Monitoring:
    □ UptimeRobot: /api/v1/health 5 dakikada bir
    □ Sentry: API + web-7fil entegrasyonu
    □ Railway alerts: CPU > %80, Memory > %80

  CI/CD (.github/workflows/):
    □ ci.yml çalışıyor mu? (test push)
    □ deploy.yml: main → Railway otomatik deploy
    □ Staging branch: staging → staging.7fil.com.tr

  Hafta 2 Sonrası:
    □ PostgreSQL backup: günlük otomatik
    □ Meilisearch index yedek stratejisi
    □ CDN: Cloudflare R2 → fotoğraf cache
    □ Production domain: api.7fil.com.tr + 7fil.com.tr
```

---

### 🧪 QA-ENGINEER — Kalite Güvencesi

```yaml
Ajan ID      : QA-ENGINEER
Model        : claude-haiku-4-5-20251001
Öncelik      : P1
Mühendis Tipi: QA / Test

Test Planı:

  Hafta 2 — Kritik Akış Testleri (Manuel):
    Akış 1: Kayıt → OTP → Giriş → Profil
    Akış 2: İlan oluştur → Fotoğraf yükle → Yayınla
    Akış 3: Arama → Filtrele → Harita → İlan detay
    Akış 4: Abonelik seç → Ödeme (İyzico test kartı)
    Akış 5: Admin → İlan moderasyon

  Hafta 3 — AI Akışları:
    □ FILTERRA listing_writer → çıktı kalitesi
    □ FILTERRA valuation → gerçekçi değer?
    □ Atlas AI → Türkçe anlama + bağlam koruma
    □ SCRIBE blog → SEO uygunluk

  Hafta 5 — Performans & Güvenlik:
    □ k6 yük testi: 100 concurrent user
    □ Lighthouse CI entegrasyonu
    □ OWASP ZAP taraması
    □ SQL injection (TypeORM parametrize) doğrulama
    □ XSS testi (user input → render)

  Test Raporlama:
    □ GitHub Issues: her bug → issue aç
    □ Severity: P0 (bloklar) · P1 (kritik) · P2 (orta) · P3 (düşük)
    □ P0 bug → ARCHITECT + ilgili mühendise anlık bildir
    □ Test Modu Onay Checklist: tüm P0/P1 kapalı mı?
```

---

### 📊 MARKETING-ENGINEER — Pazarlama Mühendisi

```yaml
Ajan ID      : MARKETING-ENGINEER
Model        : claude-sonnet-4-6
Öncelik      : P1
Mühendis Tipi: Pazarlama & Büyüme Mühendisi

Birincil Modüller: M13 (SCRIBE), M25 (Herald), M23 (Partner)

Test Modu Öncesi (Bu Hafta):
  □ robots.txt + sitemap.xml → Next.js config
  □ Schema.org JSON-LD → ilan sayfaları
  □ Open Graph + Twitter Card → tüm sayfalar
  □ GA4 kurulumu + event tracking (kayıt, ilan oluştur, ödeme)
  □ Hotjar kurulumu
  □ Instagram + Twitter + LinkedIn hesap açılışı

SCRIBE Entegrasyonu:
  □ İlk 10 SEO blog yazısı (SCRIBE api çağrısı → edit → yayınla)
  □ "7fil nedir?" açıklama sayfası
  □ 30 Instagram post hazırlığı
  □ E-posta onboarding dizisi 7 şablonu

Teknik SEO:
  □ /apps/web-7fil/src/app/layout.tsx → metadata
  □ Dinamik title: "[Oda] [Şehir] [İlçe] - 7fil"
  □ Canonical URL yönetimi
  □ Core Web Vitals → FRONTEND-WEB ile koordine

Kampanya Altyapısı (Ay 1):
  □ Google Ads hesabı + Conversion tracking
  □ Meta Business Manager + Pixel
  □ UTM tracking parametreleri standardize
  □ Landing page: /acentalar (acenta edinim sayfası)
  □ Landing page: /alicilar (alıcı kayıt sayfası)

WhatsApp Kampanyaları:
  □ Business API template onayı (Meta)
  □ Onboarding mesaj şablonu yazıldı + onaylandı
  □ Uyarı mesaj şablonu (yeni ilan) yazıldı + onaylandı

Raporlama (Haftalık):
  □ GA4 → kayıt, ilan, ödeme funnel
  □ Reklam harcaması vs. aksiyon
  □ İçerik performansı (en çok okunan blog)
```

---

### 🤝 BIZ-DEV-ENGINEER — İş Geliştirme Mühendisi

```yaml
Ajan ID      : BIZ-DEV-ENGINEER
Model        : claude-sonnet-4-6
Öncelik      : P1
Mühendis Tipi: İş Geliştirme & Partnerships

Birincil Modüller: M15, M16, M18, M21, M23

10 Şehir Pilot Planı:
  Faz 1 (Ay 1): İstanbul (Kadıköy, Beşiktaş, Şişli)
  Faz 2 (Ay 2): Ankara (Çankaya), İzmir (Konak)
  Faz 3 (Ay 3): Bursa, Antalya, Adana, Gaziantep, Konya

Acenta Edinim Pipeline:
  □ LinkedIn: "emlak müdürü / broker" hedefli outreach
  □ Acenta dernekleri: TEMFED iletişim
  □ Test modu: 50 pilot acenta listesi hazırla
  □ Onboarding call script yaz
  □ Partner başarı metrikleri dashboard kur

Banka & Sigorta Ortaklıkları (M16):
  □ 3 bankayla görüşme: mortgage lead API teklifi
  □ 2 sigorta şirketiyle: DASK + konut teklif API
  □ Entegrasyon dokümantasyonu hazırla

Avukat Ağı (M15):
  □ 10 pilot avukat: İstanbul + Ankara
  □ Avukat onboarding: panel erişimi + fee yapısı
  □ "7fil Onaylı Avukat" badge kriterleri

White-Label Satışı (M21):
  □ Kurumsal teklif: "subdomain + premium" paket
  □ Demo site hazırla: demo.7fil.com.tr
  □ Corporate plan fiyatlandırma: 5.000 TL/ay

Partner API (M23):
  □ API dokümantasyonu (Swagger → public)
  □ İlk 3 partner entegrasyonu
  □ Embed widget demo sayfası

Hedefler:
  Test Modu: 10 pilot acenta
  Ay 1: 50 acenta kayıt
  Ay 3: 100 aktif acenta
  Ay 3: 3 banka entegrasyonu
  Ay 3: 20 avukat ağında
```

---

## Çalışma Protokolleri

### Sprint Döngüsü

```
Pazartesi   : Sprint planlama (ARCHITECT önderliğinde)
Çarşamba    : Mid-sprint check (bloklayıcılar?)
Cuma        : Demo + review (tamamlanan modüller)
```

### Escalation (Yükseltme) Kuralları

```
P0 Bug (Site çöktü / Veri kaybı):
  → Anlık: DEVOPS + ARCHITECT bildir
  → Çözüm: 2 saat içinde

P1 Bug (Kritik özellik çalışmıyor):
  → Aynı gün: İlgili mühendis + ARCHITECT
  → Çözüm: 24 saat içinde

Mimari Karar:
  → ARCHITECT onayı gerekli
  → Fevzi Torun: büyük değişiklikler için

Deployment:
  → Her deploy: QA-ENGINEER smoke test
  → Production deploy: ARCHITECT onayı
```

### İletişim Kanalları

```
Günlük: Her mühendis → tamamlanan/bloklanan → kısa not
Haftalık: ARCHITECT → Fevzi'ye durum özeti
Acil: P0 bug → anlık eskalasyon
```

---

## Test Modu Onay Checklist

> Tüm ✅ = Test moduna hazır

```
Altyapı:
  □ API: Railway'de çalışıyor, /api/v1/health → 200
  □ Web: Vercel'de çalışıyor, ana sayfa yükleniyor
  □ DB: PostgreSQL + init.sql migration → tamamlandı
  □ Search: Meilisearch index → ilanlar indexlendi

Kritik Akışlar:
  □ Kayıt + E-posta OTP (BLOKLAYICI)
  □ İlan oluşturma + fotoğraf yükleme
  □ Arama + filtreleme
  □ Ödeme + abonelik aktivasyonu

AI & İçerik:
  □ FILTERRA listing_writer çalışıyor
  □ Atlas AI konuşma yanıtlıyor
  □ SCRIBE blog üretiyor

Güvenlik:
  □ HTTPS (SSL) aktif
  □ Rate limiting aktif
  □ Sıfır kritik güvenlik açığı

İzleme:
  □ Sentry entegrasyonu
  □ GA4 aktif
  □ Uptime monitoring

İletişim:
  □ SMTP test e-postası iletildi
  □ Push bildirim test edildi

Onaylayan:
  □ QA-ENGINEER sign-off
  □ ARCHITECT sign-off
  □ Fevzi Torun final onayı
```

---

*Connective Hub Dijital Teknolojiler Ltd. Şti. — 7fil.com.tr*  
*"Evin için doğru adım."*
