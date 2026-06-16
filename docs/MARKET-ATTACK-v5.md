# 7fil.com.tr — MARKET ATTACK PLAN v5.0
### "Rightmove + Zoopla + LoopNet = Türkiye'nin Entegre Gayrimenkul SaaS Ekosistemi"
> **Tarih:** Haziran 2026 · **Son Güncelleme:** 16 Haziran 2026 · **Durum:** Aktif Geliştirme  
> *Sahibinden'in tekelini kırmak: İlan platformu + Acenta SaaS + Ticari Portal + AI Katmanı*

---

## 📋 İçindekiler

1. [Global Benchmark — Rightmove · Zoopla · LoopNet Analizi](#1-global-benchmark)
2. [7fil Ürün Mimarisi — 3 Katmanlı Model](#2-ürün-mimarisi)
3. [Rakip Analizi — Sahibinden'in Zayıf Noktaları](#3-rakip-analizi)
4. [SaaS Fiyatlandırma Modeli](#4-fiyatlandırma)
5. [10 Şehir · 100 Acenta Pilot Planı](#5-pilot-plan)
6. [Platform Mimarisi — Konut · Ticari · SaaS Panel](#6-platform-mimarisi)
7. [AI Katmanı — Atlas AI · FILTERRA.AI · SCOUT](#7-ai-katmanı)
8. [Büyüme Motorları & Growth Hacking](#8-büyüme)
9. [Gelir Modeli & Projeksiyon](#9-gelir-modeli)
10. [Sprint Takvimi — Haziran → Eylül 2026](#10-sprint-takvimi)

---

## 1. Global Benchmark — Rightmove · Zoopla · LoopNet Analizi

### Rightmove (UK) — Konut Piyasası Lideri

```
Model:     Portal + Acenta SaaS (zorunlu abonelik)
Gelir:     £364M/yıl (2024) — %90'ı acenta aboneliği
Acentalar: 19.000+ aktif üye acenta
İlan:      1.5M+ aktif ilan
Güç:       Ağ etkisi — tüm ilanlar burada, alıcılar buraya gelir
           Acentalar başka platformda ilan veremez (pratik olarak)
Zayıflık:  Fiyat baskısı (acenta şikayetleri artar), mobil zayıf,
           AI yok, ticari sektörde zayıf
```

### Zoopla (UK) — Veri + Değerleme Odaklı

```
Model:     Portal + AI Değerleme + Piyasa Analizi
Gelir:     £165M/yıl — karma: abonelik + lead satışı
Güç:       "Zed Index" (AI değerleme) — alıcıyı platforma çeker
           Mahalle raporları, okul puanları, ulaşım haritaları
           B2B: bankalar, sigortacılar için veri satışı
Zayıflık:  Rightmove'un gölgesinde, daha az ilan
```

### LoopNet (US) — Ticari Gayrimenkul Uzmanı

```
Model:     Ticari + Endüstriyel ilan platformu + CoStar entegrasyonu
Gelir:     $1.3B/yıl (CoStar Group) — premium üyelik + veri
Güç:       Ofis, perakende, depo, arazi — hepsi tek yerde
           CoStar verisi ile profesyonel piyasa analizi
           "Diamond" üyelik = özel konumlama + lead önceliği
Zayıflık:  Kullanıcı arayüzü eski, UI/UX zayıf
```

### 7fil'in Sentezi — Üçünü Birleştiren Model

```
                  ┌─────────────────────────────────────┐
                  │           7fil EKOSİSTEMİ            │
                  ├─────────────────────────────────────┤
                  │                                     │
                  │  RIGHTMOVE katmanı:                 │
                  │  → Konut ilan portalı               │
                  │  → Acenta zorunlu abonelik modeli   │
                  │  → Ağ etkisi ile büyüme             │
                  │                                     │
                  │  ZOOPLA katmanı:                    │
                  │  → FILTERRA.AI değerleme motoru     │
                  │  → Mahalle & piyasa veri raporları  │
                  │  → B2B veri satışı (bankalar)       │
                  │                                     │
                  │  LOOPNET katmanı:                   │
                  │  → TicariMetre — ticari gayrimenkul │
                  │  → Ofis · Perakende · Depo · Arazi  │
                  │  → Kurumsal müşteri segmenti        │
                  │                                     │
                  │  + Türkiye'ye özgü katkı:           │
                  │  → Canlı Müzayede                   │
                  │  → Hukuki Risk Kontrolü             │
                  │  → Depozito Güvence (FinTech)       │
                  │  → WhatsApp entegrasyonu            │
                  │  → MLS Komisyon Paylaşımı           │
                  └─────────────────────────────────────┘
```

---

## 2. 7fil Ürün Mimarisi — 3 Katmanlı Model

### Katman 1: Tüketici Portalı (B2C)

Rightmove'un karşılığı — alıcı ve kiracıların geldiği yer.

```
7fil.com.tr  →  Ana portal
  /ilanlar        Konut ilanları (satılık + kiralık)
  /ticari         TicariMetre — ofis, perakende, depo, arazi
  /muzayede       Canlı açık artırma
  /degerim        Ücretsiz mülk değerleme (lead magnet)
  /mahalle/:slug  Mahalle raporu (FILTERRA.AI destekli)
  /atlas          Atlas AI chat (NLS arama asistanı)
```

**Kullanıcı Çekme Mantığı:**
- Tüm ilanlar 7fil'de → alıcılar buraya gelir
- Ücretsiz araçlar (değerleme, mahalle raporu) → organik trafik
- Atlas AI → Google'ın arama motoruna rakip konum

### Katman 2: Acenta SaaS Platformu (B2B)

Zoopla'nın acenta araçları + LoopNet'in premium üyeliği.

```
panel.7fil.com.tr  →  Acenta Kontrol Merkezi
  /panel/dashboard     KPI'lar, performans özeti
  /panel/ilanlar       İlan yönetimi (CRUD + AI optimize)
  /panel/crm           Müşteri takibi, lead pipeline
  /panel/mls           MLS havuzu, komisyon paylaşımı
  /panel/icerik        AI içerik fabrikası (blog, sosyal, YouTube)
  /panel/analitik      Detaylı raporlar, rekabetçi analiz
  /panel/marka         White-label subdomain builder
  /panel/property-mgmt Mülk yönetimi (kiracı + sözleşme)
  /panel/depozito      Depozito güvence işlemleri
  /panel/muzayede      Müzayede oluştur ve yönet
  /panel/abonelik      Plan yönetimi, fatura
```

**SaaS Değer Önerisi:**
"Sadece ilan yayınlamıyorsunuz — tüm işinizi 7fil üzerinden yürütüyorsunuz."

### Katman 3: B2B Veri & API (Enterprise)

CoStar'ın veri satışı modeli.

```
Bankalar:        FILTERRA.AI değerleme API → mortgage kararları
Sigortacılar:    Mülk risk skoru API → poliçe fiyatlandırma
Yatırım Fonları: Piyasa veri akışı → portföy analizi
Belediyeler:     Kentsel dönüşüm verisi → planlama
Avukatlar:       Hukuki risk API → tapu inceleme otomasyonu
```

---

## 3. Rakip Analizi — Sahibinden'in Zayıf Noktaları

### Sahibinden'in Yapısal Problemleri

```
❌ Sorun #1 — Aşırı Yüksek Fiyat, Sıfır Değer
   Sahibinden 2026 fiyatı: 3.000–8.000 TL/ay acenta paketi
   Karşılığında aldıkları: Sadece ilan yayınlama hakkı
   7fil karşılığı: 990–2.490 TL + CRM + AI + MLS + White-label

❌ Sorun #2 — Sahte İlan Cehennemi
   Alıcılar "yem ilanlar"la boğuluyor
   Platform filtreleme yapamıyor
   7fil: SHA-256 sertifikalı ilan sistemi

❌ Sorun #3 — Acenta İçin Sıfır SaaS Araç
   CRM yok · MLS yok · AI içerik yok · PDF broşür yok
   WhatsApp entegrasyonu ilkel · Analitik sığ
   7fil: tam SaaS stack, tek platform

❌ Sorun #4 — Ticari Gayrimenkul Çok Zayıf
   Ofis, depo, perakende ilanları karmaşık
   Kurumsal alıcı segmentine hitap etmiyor
   7fil: TicariMetre — LoopNet modeli

❌ Sorun #5 — Müzayede Sistemi Yok
   Açık artırmalı satış imkânı yok
   7fil: canlı müzayede modülü (Socket.IO)

❌ Sorun #6 — Veri Yok, AI Yok
   Statik ilan sayfası — 2005 mantığı
   Değerleme, mahalle analizi, piyasa trendi yok
   7fil: FILTERRA.AI + Atlas AI

❌ Sorun #7 — Acenta Marka Görünürlüğü Sıfır
   Sahibinden'de acenta kimliği kaybolur
   7fil: white-label subdomain sitesi

❌ Sorun #8 — Kiracı-Ev Sahibi Koruması Yok
   Depozito anlaşmazlığında platform devre dışı
   7fil: FinTech escrow + avukat onaylı süreç
```

### 7fil'in Mutlak Üstünlükleri

| Özellik | Sahibinden | Rightmove UK | 7fil |
|---------|-----------|-------------|------|
| AI Değerleme | ❌ | ❌ | ✅ FILTERRA.AI |
| Mahalle Raporu | ❌ | Kısmi | ✅ Tam AI raporu |
| Acenta CRM | ❌ | ❌ | ✅ Kanban pipeline |
| MLS Paylaşımı | ❌ | ❌ | ✅ Sprint 2 |
| White-label Site | ❌ | ❌ | ✅ Subdomain builder |
| Canlı Müzayede | ❌ | ❌ | ✅ Socket.IO |
| Depozito Güvence | ❌ | ❌ | ✅ FinTech escrow |
| AI İçerik Fabrikası | ❌ | ❌ | ✅ SCRIBE + YT-DIRECTOR |
| Ticari İlan (LoopNet) | Zayıf | ❌ | ✅ TicariMetre |
| Hukuki Risk Kontrolü | ❌ | ❌ | ✅ Avukat panel |
| Fiyat | 3.000–8.000/ay | £400–800/ay | **990–2.490/ay** |

---

## 4. SaaS Fiyatlandırma Modeli

### Acenta Paketleri (Rightmove Modeli + AI Değer Katmanı)

```
┌─────────────────────────────────────────────────────────────────┐
│  BAŞLANGIÇ — ÜCRETSİZ (Sonsuza Kadar)                         │
│  Hedef: Sisteme çekme, bağımlılık oluşturma                    │
├─────────────────────────────────────────────────────────────────┤
│  • 5 aktif ilan (konut + ticari)                               │
│  • 7fil.com.tr/acenta/slug profil sayfası                      │
│  • WhatsApp deep link otomasyonu                               │
│  • FILTERRA.AI — aylık 3 değerleme analizi                     │
│  • Atlas AI — günlük 5 mesaj                                   │
│  • Temel analitik dashboard                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PRO — 990 TL/ay  (yıllık ödemede 790 TL/ay)                  │
│  Hedef: Aktif tek kişilik acentalar — Rightmove Standart       │
├─────────────────────────────────────────────────────────────────┤
│  • 50 aktif ilan (konut + ticari)                              │
│  • Subdomain site: acenta.7fil.com.tr                         │
│  • FILTERRA.AI — sınırsız değerleme                            │
│  • Atlas AI — sınırsız                                         │
│  • CRM — lead pipeline, müşteri takibi                        │
│  • MLS erişimi (işbirlikçi olarak)                             │
│  • PDF broşür — aylık 20 adet                                  │
│  • AI içerik — aylık 20 post/script (SCRIBE)                  │
│  • WhatsApp toplu mesaj (aylık 500)                            │
│  • Öne çıkarma: 5 ilan/ay dahil                                │
│  • Performans analitik + haftalık rapor                        │
│  • Destek: E-posta (24 saat)                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  KURUMSAL — 2.490 TL/ay  (yıllık 1.990 TL/ay)                 │
│  Hedef: 3–10 kişilik ofis — Rightmove Premium karşılığı        │
├─────────────────────────────────────────────────────────────────┤
│  • Sınırsız ilan (konut + ticari)                              │
│  • Custom domain (acenta.com.tr) — DNS yönetim dahil          │
│  • 10 alt kullanıcı (çalışan hesapları)                       │
│  • MLS — YETKİLİ konum (kendi ilanlarını paylaşır)            │
│  • PDF broşür — sınırsız                                       │
│  • AI içerik — sınırsız (blog, sosyal, YouTube)               │
│  • Müzayede ilan yetkisi                                       │
│  • Property Management modülü                                  │
│  • Depozito güvence sistemi                                    │
│  • Özel e-posta: @acenta.7fil.com.tr                          │
│  • Rekabetçi analiz (ilçe bazlı)                              │
│  • WhatsApp toplu — sınırsız                                   │
│  • Öne çıkarma: 20 ilan/ay dahil                               │
│  • Destek: WhatsApp + öncelikli (2 saat)                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ENTERPRİSE — 5.990 TL/ay  (görüşme üzerine)                  │
│  Hedef: Zincir ofisler, franchise, kurumsal firmalar           │
├─────────────────────────────────────────────────────────────────┤
│  • Kurumsal + tümü                                             │
│  • Sınırsız alt kullanıcı                                      │
│  • Multi-branch yönetimi (şubeler arası)                       │
│  • Özel AI eğitimi (şirket verileriyle fine-tuning)           │
│  • FILTERRA.AI API erişimi (kendi sistemlerine)               │
│  • CoStar tarzı ticari veri paketi (TicariMetre)              │
│  • SLA %99.9 uptime garantisi                                  │
│  • Dedicated account manager                                   │
│  • Beyaz etiket mobil uygulama (opsiyonel +3.000 TL/ay)       │
│  • 7/24 WhatsApp + telefon destek                              │
└─────────────────────────────────────────────────────────────────┘
```

### TicariMetre (LoopNet Karşılığı) — Ek Fiyatlandırma

```
TicariMetre Temel:  Pro plana dahil
TicariMetre Pro:    +500 TL/ay — CoStar tarzı piyasa raporu
TicariMetre API:    Enterprise — banka/sigorta entegrasyonu

Ticari ilan kategorileri:
  Ofis · Perakende · Endüstriyel/Depo · Arazi · Otel · Karma Kullanım
```

### Ek Gelir Kalemleri

```
Öne Çıkarma (Rightmove Boost modeli):
  7 gün    → 299 TL
  15 gün   → 499 TL
  30 gün   → 799 TL
  Homepage spotlight (haftalık) → 1.499 TL

Premium Hizmetler:
  Avukat incelemesi (tek seferlik)  → 1.500 TL
  Sertifikalı ilan rozeti            → 500 TL/ilan
  DASK + Konut sigorta teklifi       → %15 komisyon
  Mortgage yönlendirme               → %0.1 banka komisyon

Müzayede:
  Platform ücreti: Kapanış bedelinin %1.5'i (min 500 TL)

B2B Veri (Zoopla/CoStar modeli):
  Banka değerleme API               → 5.000 TL/ay (1.000 sorgu)
  Sigorta risk API                  → Görüşme
  Yatırımcı piyasa raporu paketi    → 2.500 TL/rapor
```

---

## 5. 10 Şehir · 100 Acenta Pilot Planı

### Seçilen Pilot Şehirler

```
Tier 1 — Büyük Pazar (3 şehir, 50 acenta):
  🏙 İstanbul  → 25 acenta (Kadıköy, Beşiktaş, Şişli, Maltepe, Ümraniye)
  🏙 Ankara    → 15 acenta (Çankaya, Keçiören, Sincan, Yenimahalle)
  🏙 İzmir     → 10 acenta (Konak, Bornova, Karşıyaka, Buca)

Tier 2 — Büyüyen Pazar (4 şehir, 35 acenta):
  🏙 Antalya   → 10 acenta (turistik + expat + yabancı alıcı)
  🏙 Bursa     → 10 acenta (sanayi + konut, yakın pazar)
  🏙 Gaziantep →  8 acenta (hızlı büyüyen ekonomi)
  🏙 Kocaeli   →  7 acenta (İstanbul yakını, endüstriyel TicariMetre fırsatı)

Tier 3 — Keşif Pazarı (3 şehir, 15 acenta):
  🏙 Trabzon   → 5 acenta (sahil + yatırım + Gürcü alıcı)
  🏙 Mersin    → 5 acenta (liman + ticari + yabancı yatırımcı)
  🏙 Eskişehir → 5 acenta (üniversite + genç + kiralık ağırlıklı)
```

### Onboarding Akışı (Rightmove Kurulum Süreci Gibi)

```
HAFTA 1–2: Hazırlık
  ✓ Şehir bazlı landing sayfaları: 7fil.com.tr/istanbul, /ankara ...
  ✓ Her şehir için koordinatör belirle (freelance, bölge uzmanı)
  ✓ Demo ortamı hazır: canlı demo linki
  ✓ Onboarding paketi: "7fil ile Kazanmaya Başla" PDF kılavuzu

HAFTA 3–4: İlk Temas
  ✓ 20–30 acentaya segmentli WhatsApp + e-posta kampanyası
  ✓ Mesaj: "Sahibinden'e ayda X TL mi veriyorsunuz?
            7fil ile aynı fiyata: CRM + AI + Kendi siteniz. Ücretsiz başlayın."
  ✓ İlk referans acentadan video testimonial

AY 2: Aktivasyon
  ✓ İlk 100 acentaya "Kurucu Üye" paketi:
    - İlk 6 ay %50 indirim
    - "7fil Kurucu Ortağı" rozeti (viral)
    - Platformun şekillendirilmesinde söz hakkı
  ✓ Her şehirde mini "Emlakçılar Buluşması" (çay, 2 saat)

AY 3: Büyüme
  ✓ Referral: "Bir acenta getir, 1 ay ücretsiz kazan"
  ✓ İlk 100 acentanın başarı hikayeleri → içerik + PR
  ✓ Google My Business optimizasyonu (SCRIBE ajanı)
```

### Şehir Koordinatörü Programı

```
Kim: Bölgede yaşayan, emlak sektörünü tanıyan freelancer

Görevler:
  • Acentaları yüz yüze ziyaret, demo göster
  • Onboarding sürecini yönet
  • Şikayetleri filtrele, platforma ilet
  • Yerel etkinlikleri organize et

Ücret:
  • Sabit: 5.000 TL/ay
  • Komisyon: Getirdiği her Pro+ acenta için 500 TL/ay (aktif kaldıkça)
  • Hedef bonus: 10 acenta = +3.000 TL
```

---

## 6. Platform Mimarisi — Konut · Ticari · SaaS Panel

### 6.1 Konut Portalı (7fil.com.tr) — Rightmove Modeli

```
Ana Sayfa:
  → Hero arama: şehir/ilçe/mahalle + tip + fiyat
  → AI Modu toggle: "Kadıköy'de metroya 5 dk 4M'a kadar daire" (NLS)
  → Öne çıkan ilanlar (acenta öne çıkarma ile ödeme)
  → İstatistik bar: aktif ilan, ajans, müzayede sayısı
  → Şehir bazlı keşif kartları
  → Özellik blokları: AI · Hukuki · Finans · Müzayede · White-label
  → Fiyatlandırma planları

İlan Listesi (/ilanlar):
  → Filtre sidebar: tip, oda, fiyat, m², özellikler, ilçe
  → Grid + Harita görünümü (geçiş)
  → PostGIS coğrafi filtre
  → AI öneri chip'leri: "Bu kriterlere yakın alternatifler"
  → Öne çıkan ilanlar (altın border + "ÖZEL" etiketi)

İlan Detay (/ilanlar/:id):
  → Hero galeri (tam genişlik + thumbnail şerit)
  → Özellik tablosu (m², oda, kat, ısıtma, aidat, yapı yaşı)
  → FILTERRA.AI Mahalle Raporu (3 metrik kart)
  → 7 Adım progress indicator
  → Sticky sağ sütun: fiyat + acenta kartı + WhatsApp + Teklif
  → Benzer ilanlar (yatay scroll)
  → Acenta profil linki

Değerleme (/degerim):
  → Adres gir → FILTERRA.AI değer tahmini → e-posta ile rapor
  → Lead capture → CAMPAIGNER ajanı başlar

Mahalle Raporu (/mahalle/:slug):
  → m² ortalama · satış hızı · kira getirisi · okul puanı
  → Harita katmanları: gürültü, taşkın riski, ulaşım
  → Rakip acentalar bu bölgede (B2B rekabetçi analiz)
```

### 6.2 TicariMetre — Ticari Gayrimenkul (LoopNet Modeli)

```
7fil.com.tr/ticari  →  Ana ticari portal

Kategoriler:
  Ofis · Perakende Mağaza · Endüstriyel/Depo · Arazi
  Otel/Konaklama · Karma Kullanım · Yatırım Portföyü

Özel Özellikler:
  → Ticari ilan formu: kira dönemi, DASK, iskan, kira getirisi
  → Finansal metrikler: NOI, cap rate, GLA, işgal oranı
  → CoStar tarzı piyasa raporu (TicariMetre Pro)
  → Kurumsal alıcı için NDA imzalı detaylı paket
  → Teaser PDF otomasyonu (gizlilik korumalı)

Hedef kitle:
  Bireysel yatırımcı · KOBİ · Kurumsal kiracı · GYO · Banka
```

### 6.3 Acenta SaaS Panel — Tam Route Listesi

```
Mevcut ✅ (16 Haziran 2026 itibarıyla — hi-fi tasarım entegre edildi):
  /                      → Ana sayfa (hero NLS, stats, RitualStrip, öne çıkan ilanlar, features grid)
  /ilanlar               → İlan listesi (filtre sidebar, harita/grid toggle, Atlas AI filtreleri)
  /ilanlar/[id]          → İlan detayı (galeri, Atlas AI mahalle raporu, RitualVertical sidebar)
  /panel                 → Partner dashboard (dark theme, KPI kartları, MLS toggle, kebab menü, Atlas AI optimize)
  /atlas                 → Atlas AI chat (NLS arama, inline listing kartları, suggest chips)
  /admin                 → Admin panel (kullanıcı, ajans, ödemeler)
  /muzayede              → Canlı müzayede

  Teknik altyapı ✅:
  lib/data.ts            → TypeScript LISTINGS (9), STEPS, fmtTRY, Listing/Step interface
  components/icons.tsx   → 40+ SVG ikon + BrandMark fil logosu + BrandSilhouette
  components/photos.tsx  → Photo bileşeni (6 sahne × 6 palet SVG)
  components/ui.tsx      → RitualStrip, RitualVertical, Pill, ListingCard
  app/globals.css        → 1714-satır tasarım sistemi (CSS vars, tüm bileşenler)

Sprint 3 — Eklenecek ❌:
  /panel/crm                   → Lead pipeline (Kanban)
  /panel/crm/:leadId           → Lead detayı
  /panel/mls                   → MLS havuzu
  /panel/mls/havuz             → Açık MLS ilanları
  /panel/mls/ilanlarim         → Paylaştığım ilanlar
  /panel/mls/isbirliklerim     → Aktif işbirliklerim
  /panel/icerik                → AI içerik merkezi
  /panel/icerik/blog           → Blog yaz/düzenle/yayınla
  /panel/icerik/sosyal         → Instagram/Twitter/LinkedIn post
  /panel/icerik/youtube        → YouTube script + SEO paketi
  /panel/pdf-brosur            → PDF broşür oluştur + indir
  /panel/whatsapp              → Toplu WA kampanyası
  /panel/takvim                → Randevu + görev takvimi
  /panel/raporlar              → Aylık PDF performans raporu
  /panel/odemeler              → Ödeme geçmişi + fatura
  /panel/destek                → Destek talebi (ticket)
  /panel/egitim                → Video eğitimler, kılavuzlar
  /panel/property-mgmt         → Mülk yönetimi
  /panel/depozito              → Depozito güvence akışı

Sprint 3 — Admin Eksikleri ❌:
  /admin/sehirler              → 10 şehir, koordinatör atama
  /admin/mls                   → Platform geneli MLS takibi
  /admin/icerik                → AI içerik onay/red kuyruğu
  /admin/reklam                → Öne çıkarma gelir yönetimi
  /admin/koordinatorler        → Koordinatör performansı
  /admin/finans                → Gelir dashboard, iyzico
  /admin/ai-ajanlar            → Ajan kontrol paneli
  /admin/youtube               → YouTube içerik kuyruğu
  /admin/onboarding            → Acenta kayıt durumu
  /admin/kampanyalar           → Toplu e-posta/WA kampanyası
```

---

## 7. AI Katmanı — Atlas AI · FILTERRA.AI · SCOUT

### Atlas AI — Kullanıcı Asistanı (Zoopla Arama + ChatGPT UX)

```typescript
// Doğal Dil Arama (NLS) — Sprint 3 öncelik
const ATLAS_PARSE_SYSTEM = `
Sen 7fil gayrimenkul platformunun arama asistanısın.
Türkçe doğal dil sorgusundan JSON çıkar. Sadece JSON döndür.
{
  "district": string|null,
  "city": string|null,
  "listingType": "satilik"|"kiralik"|null,
  "propertyType": "daire"|"villa"|"arsa"|"ofis"|"depo"|null,
  "maxPrice": number|null,
  "minRooms": number|null,
  "maxMetro": number|null,    // metroya dakika
  "features": string[],
  "intent": "search"|"analysis"|"finance"|"legal"
}
`;

// Prompt caching — maliyet %80 azalır
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-6',
  system: [{ type: 'text', text: ATLAS_PARSE_SYSTEM,
             cache_control: { type: 'ephemeral' } }],
  messages: [{ role: 'user', content: userMessage }],
});
```

### FILTERRA.AI — Değerleme + Mahalle + Risk Motoru

```
Modüller:
  1. Değerleme Motoru    → Adres → m² tahmini (karşılaştırmalı analiz)
  2. Mahalle Raporu      → 10+ metrik: fiyat trendi, okul, ulaşım, gürültü
  3. Hukuki Risk Skoru   → Tapu belge analizi → risk 0–100
  4. Mülk Sağlık Skoru  → Fotoğraf karşılaştırma → hasar tespiti
  5. Kira Getirisi       → Cap rate, brüt/net getiri tahmini

B2B API (Zoopla/CoStar modeli):
  GET /api/v1/filterra/valuation
  GET /api/v1/filterra/neighborhood/:slug
  GET /api/v1/filterra/risk/:caseId
  POST /api/v1/filterra/inspection/compare
```

### SCRIBE — AI İçerik Fabrikası (Acenta SaaS Değeri)

```
Her acente için otomatik:
  → Her ilan yayınlandığında: 7 platform sosyal medya paketi
  → Her Pazartesi: "Bu Haftanın Piyasası" raporu
  → Her ayın 1'i: Blog yazısı (5 konu rotasyonu)
  → YouTube script paketi (aylık 4 video): 
     Mahalle turu · Piyasa raporu · Müşteri hikayesi · Eğitim

Desteklenen çıktılar:
  Instagram caption + hashtag · Twitter · LinkedIn · Facebook
  TikTok script · YouTube script + SEO + Shorts · Blog post
  PDF broşür metin · WhatsApp mesajı · E-posta bülteni
```

### SCOUT — Proaktif Keşif Ajanı (Zoopla Alert Modeli)

```
Kullanıcı kriterleri kaydeder → SCOUT arka planda çalışır
  → Yeni ilan match → anlık push + WA bildirimi
  → "Dün aradığın kriterlerde 3 yeni ilan — bak bakalım 🐘"
  → Fiyat değişimi → otomatik bildirim
  → Mahalle raporu güncellemesi → haftalık özet
```

---

## 8. Büyüme Motorları & Growth Hacking

### Motor 1: Ağ Etkisi (Rightmove Modeli)

```
Ne kadar çok acenta → ne kadar çok ilan
Ne kadar çok ilan → ne kadar çok alıcı
Ne kadar çok alıcı → acentalar ayrılamaz

Kritik eşik: 10.000 aktif ilan
Bu noktadan sonra Sahibinden'i bypass edebilirler.
```

### Motor 2: Ücretsiz AI Araçlar (Zoopla Lead Magnet)

```
7fil.com.tr/degerim      → Ücretsiz mülk değerleme
7fil.com.tr/mahalle/:slug → Ücretsiz mahalle raporu
7fil.com.tr/kredi-hesapla → Mortgage simülasyonu
7fil.com.tr/kira-getirisi → Yatırım getirisi hesabı

Her araç → e-posta yakaları → SCOUT ajanı devreye girer
Organik trafik motoru → Google SEO + sosyal paylaşım
```

### Motor 3: MLS Network Effect

```
Acentalar MLS'e katılır → birbirinin ilanını satar
Ne kadar çok acenta → o kadar değerli MLS ağı
Komisyon paylaşımı → herkesin kazanması → platform bağımlılığı
```

### Motor 4: "Sahibinden Göçmen" Kampanyası

```
Hedef: Sahibinden'deki aktif acentaların public verileri
Kişiselleştirilmiş mesaj:
  "[Acenta Adı], Sahibinden'de X ilanınızı gördük.
   Ayda Y TL ödüyorsunuz. 7fil'de aynı fiyata:
   CRM + AI + Kendi web siteniz. 3 ay ücretsiz deneyin."

Otomasyon: CAMPAIGNER ajanı → 1.000 acentaya haftalık
```

### Motor 5: Viral Mekanizmalar

```
Hack 1: "7fil Fiyat Garantisi"
  "Sahibinden faturanı getir, o fiyatın %70'ine al" (3 aylık)

Hack 2: Mahalle Karşılaştırma Tool
  7fil.com.tr/mahalle-karsilastir — ücretsiz public
  "Kadıköy mü Üsküdar mı?" → sosyal paylaşım → 7fil logo watermark

Hack 3: Acenta Leaderboard
  "İstanbul'un En Aktif 10 Emlakçısı — Bu Ay"
  Aylık duyuru → acentaların kendi ağında paylaşması

Hack 4: "7fil Sertifikalı İlan" Viral
  Her sertifikalı ilan sosyal medyada otomatik paylaşılır
  SHA-256 doğrulama kodu → güven sinyali

Hack 5: Sektör Raporu → Ücretsiz PR
  "7fil 2026 Türkiye Kira Endeksi"
  Hürriyet Emlak, Milliyet, Bloomberg HT → "7fil verilerine göre..."
```

---

## 9. Gelir Modeli & Projeksiyon

### 100 Acenta Pilot — Konservatif Projeksiyon

```
Acenta mix:
  40 adet Başlangıç (ücretsiz)    →         0 TL
  40 adet Pro (990 TL/ay)         →  39.600 TL/ay
  15 adet Kurumsal (2.490 TL/ay)  →  37.350 TL/ay
   5 adet Enterprise (5.990 TL/ay)→  29.950 TL/ay
                                    ─────────────
  Abonelik toplam                 → 106.900 TL/ay

Ek gelirler:
  Öne çıkarma (100 ilan × 499 TL) →  49.900 TL/ay
  Sigorta + Mortgage komisyon      →  15.000 TL/ay
  Müzayede (10 adet × 750 TL)      →   7.500 TL/ay
  B2B veri API (2 banka)           →  10.000 TL/ay
                                    ─────────────
  TOPLAM AYLIK (Pilot)             → ~189.300 TL/ay
  YILLIK PROJEKSİYON               →   ~2.27M TL/yıl

Tam büyüme (1.000 acenta, 50 şehir):
  → ~20–25M TL/yıl abonelik
  → +8–12M TL/yıl ek gelirler
  → TOPLAM: ~28–37M TL/yıl
```

### Uzun Vadeli — B2B Veri Katmanı (Zoopla/CoStar Modeli)

```
Hedef (2028):
  • 10 banka ile FILTERRA.AI API anlaşması  → 50.000 TL/ay
  • 5 sigorta şirketi veri paketi           → 25.000 TL/ay
  • GYO portföy analiz raporları            → proje bazlı
  • Belediye kentsel dönüşüm veri satışı    → sözleşme bazlı
```

---

## 10. Sprint Takvimi — Haziran → Eylül 2026

### Sprint 3 — Haziran 2026 (4 Hafta)

> **Tamamlanan (Sprint 3 Başı):**
> - ✅ Hi-fi tasarım prototipi Next.js'e port edildi (16 Haz 2026)
> - ✅ Tam komponent kütüphanesi oluşturuldu (icons, photos, ui, data)
> - ✅ Branch `claude/friendly-curie-d64CC` → PR #1 açıldı

```
Hafta 1: Temel SaaS Altyapısı
  Dev-01: CRM modülü (entity + Kanban UI) ← SONRAKİ ÖNCELIK
  Dev-02: /panel/mls sayfaları
  Dev-03: Admin şehir + koordinatör yönetimi
  Dev-04: Acenta onboarding magic link akışı

Hafta 2: AI İçerik Fabrikası
  Dev-05: SCRIBE ajanı (blog + sosyal medya paketi)
  Dev-06: YT-DIRECTOR ajanı (YouTube script paketi)
  Dev-07: /panel/icerik sayfaları (Next.js)
  Dev-08: content_items DB tablosu

Hafta 3: Büyüme Araçları
  Dev-09: ADS-ENGINE (öne çıkarma altyapısı)
  Dev-10: CAMPAIGNER (drip kampanya + lead nurturing)
  Dev-11: Şehir bülteni (newsletter.service.ts)
  Dev-12: PDF Broşür Motoru (Puppeteer)

Hafta 4: TicariMetre + Lansman
  Dev-13: TicariMetre ticari ilan kategorileri
  Dev-14: 10 şehir landing sayfaları
  Dev-15: Pilot acenta onboarding testi (10 acenta)
  Dev-16: Güvenlik taraması + performans testi
```

### Sprint 4 — Temmuz 2026

```
  Dev-01: Depozito Güvence Sistemi (tam akış)
  Dev-02: e-Güven e-imza entegrasyonu
  Dev-03: INSPECTOR Ajanı (Vision AI, mülk fotoğraf karşılaştırma)
  Dev-04: SCOUT Ajanı (NLS + anlık uyarı sistemi)
  Dev-05: Atlas AI NLS arama (Modül 21 tam implementasyon)
  Dev-06: Harita katman filtreleri (gürültü, okul, ulaşım, taşkın)
  Dev-07: 100 acentaya ulaş
  Dev-08: A/B testler başlat
```

### Sprint 5 — Ağustos 2026

```
  Dev-01: AI Multimodal Arama (fotoğrafla ara)
  Dev-02: HERALD kişisel bülten motoru
  Dev-03: TicariMetre Pro (CoStar tarzı piyasa raporu)
  Dev-04: Acenta mobile app özel CRM ekranları
  Dev-05: FILTERRA.AI B2B API (banka pilot)
  Dev-06: YouTube kanalı lansman (ilk 10 video)
  Dev-07: "Sahibinden Göçmen" kampanyası
  Dev-08: Medya / basın bülteni servis et
```

### Başarı Metrikleri — Eylül 2026 Pilot Sonu

```
  ✓ 100 aktif acenta (10 şehirde)
  ✓ 2.000+ aktif ilan (konut + ticari)
  ✓ 10.000+ aylık aktif ziyaretçi
  ✓ 150.000+ TL aylık abonelik geliri
  ✓ NPS ≥ 50
  ✓ Acenta tutma oranı ≥ %80 (3. ay)
  ✓ 500+ YouTube abone (B2B kanal)
  ✓ 5+ medya koverağı
  ✓ Sahibinden'den geçen acenta ≥ 30
  ✓ 1 banka ile FILTERRA.AI API pilot
```

---

## Teknik Bağımlılık Haritası

```
Yeni npm Paketleri (apps/api):
  puppeteer              → PDF broşür motoru
  bullmq                 → Ajan iş kuyruğu (Redis tabanlı)
  @anthropic-ai/sdk      → Tüm AI ajanları (zaten var)
  handlebars             → E-posta + PDF şablonları
  sharp                  → Görüntü işleme (mülk fotoğraf)
  @nestjs/schedule       → Cron scheduler (zaten var)
  socket.io              → Canlı müzayede (zaten var)

Yeni npm Paketleri (apps/web-7fil):
  @dnd-kit/core          → CRM Kanban sürükle-bırak
  react-quill            → Blog editörü (SCRIBE çıktısı)
  recharts               → Analitik + TicariMetre grafikler
  date-fns               → Takvim / randevu yönetimi
  maplibre-gl            → Harita (PostGIS + katman filtreleri)

Altyapı:
  Cloudflare R2          → Medya (fotoğraf, PDF, broşür)
  Meilisearch            → Full-text ilan arama
  PostGIS                → Coğrafi sorgular
  Redis                  → BullMQ + session cache
  Iyzico                 → Ödeme + escrow (depozito)
```

---

*Connective Hub Dijital Teknolojiler Ltd. Şti. — 7fil.com.tr*
*"Sahibinden ilan satar. 7fil sizi zengin eder."*
*MARKET ATTACK PLAN v5.0 — Haziran 2026 · Son güncelleme: 16 Haziran 2026*
*Rightmove + Zoopla + LoopNet → Türkiye'nin entegre gayrimenkul SaaS ekosistemi*
