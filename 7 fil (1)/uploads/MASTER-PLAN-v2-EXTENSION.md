# 7fil Master Plan — v2 Extension
**Connective Hub Dijital Teknolojiler Ltd. Şti.**  
**Versiyon:** 2.0 Eki — Mayıs 2026  
**Antigravity Sprint Referansı & Claude Design Brief Hazırlığı**

> Bu doküman, `Master-Plan.md` v1.0'ı tamamlar ve iptal etmez.  
> Yeni modüller, mimari kararlar ve AI araçları için prompt şablonları içerir.

---

## İçindekiler (v2 Eki)

18. [Yeni Vizyon Katmanı: 7 Fil Ritüeli & Atlas AI Felsefesi](#18)
19. [Modül 16 — SaaS Subdomain Builder (White-Label)](#19)
20. [Modül 17 — MLS Komisyon Paylaşım Sistemi](#20)
21. [Modül 18 — Property Management & Mülk Sağlık Skoru](#21)
22. [Modül 19 — Depozito Güvence & FinTech Escrow](#22)
23. [Modül 20 — Otomatik PDF Broşür Motoru](#23)
24. [Modül 21 — Doğal Dil Arama (NLS) & Atlas AI Eşleştirme](#24)
25. [Modül 22 — Avukat Portalı Dashboard](#25)
26. [Yeni Nesil Arama Mimarisi (Google I/O 2026 İlhamı)](#26)
27. [Veritabanı Şeması Ekleri (v2)](#27)
28. [Bilinen Bug'lar & Teknik Borç](#28)
29. [Antigravity İçin Sprint Prompt Paketi](#29)
30. [Claude Design Brief — Marka & Kimlik Çalışması](#30)

---

<a name="18"></a>
## 18. Yeni Vizyon Katmanı: 7 Fil Ritüeli & Atlas AI Felsefesi

### 18.1 Ritüelin Köküne Dönüş

7 Fil, dünya genelinde kapı üstüne asılan, vitrinde sergilenen seramik, ahşap, mermer, cam objelerdir.  
Fil hortumunun **yukarıya dönük** olması bereket getirir; **aşağıya dönük** olması ise enerji akışını temsil eder.  
Türkiye, Hindistan, Güneydoğu Asya ve Orta Doğu'da ev sahibi olmanın, yeni bir kapı açmanın **ritüelidir.**

**Platform Felsefesine Entegrasyonu:**

| Fil Adımı | Platform Karşılığı | Atlas AI / FILTERRA.AI Katkısı |
|-----------|-------------------|-------------------------------|
| 1. Niyet — Arayış | Arama & Keşif | Doğal dil arama, lokasyon tavsiyesi |
| 2. Gözlem — Değerleme | AI piyasa analizi | FILTERRA.AI değerleme motoru |
| 3. Koruma — Hukuki doğrulama | Tapu & ipotek kontrolü | Risk skoru 0-100 |
| 4. Bolluk — Finansman | Mortgage & katılım karşılaştırma | NESTLING.AI eşleştirme |
| 5. Yol — Sözleşme | e-İmza & dijital kontrat | Avukat onaylı akış |
| 6. Ev — Taşınma | Tadilat, nakliye, sigorta | Partner ekosistemi |
| 7. Bereket — Mülk Yönetimi | Uzun vadeli değer koruma | Periyodik sağlık skoru |

> **UI/UX Notu:** Onboarding akışında 7 fil animasyonu. Her adım tamamlandığında bir fil figürü altın rengine döner. Bu, kullanıcıyı platforma bağlayan duygusal imza.

### 18.2 Atlas AI — Yeni Nesil Asistan Felsefesi

Atlas AI sadece bir chatbot değil; **ev almanın spiritüel rehberi** ve **veri analistinin birleşimi.**

Konuşma tonu:
- **Sakin, bilge, güvenilir** — bir büyükbaba avukat gibi konuşur
- **Asla satıcı gibi davranmaz** — kullanıcının gerçek çıkarını söyler
- **Lokasyon hafızası vardır** — kullanıcının ilgi alanlarını hatırlar (localStorage → backend session)
- **Proaktif uyarı verir** — "Bu bölgede son 6 ayda %12 fiyat artışı var, aceleci olmaya gerek yok"

---

<a name="19"></a>
## 19. Modül 16 — SaaS Subdomain Builder (White-Label)

### Vizyon
Pro emlakçılar `ajansiadi.7fil.com.tr` üzerinden kendi markalı web sitelerine sahip olur.  
Bu, Rightmove/Zoopla modelinin Türkiye'deki eksik halkasıdır.

### Teknik Mimari

```
Next.js middleware.ts → subdomain tespit → tenant config fetch → render
```

```typescript
// apps/web-7fil/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];
  
  // Ana domain ve www'yi geç
  if (['7fil', 'www', 'ticarimetre'].includes(subdomain)) {
    return NextResponse.next();
  }
  
  // Tenant slug'ı URL'e ekle — API'den tenant config çekilecek
  const url = request.nextUrl.clone();
  url.pathname = `/tenant/${subdomain}${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### Veritabanı

```sql
CREATE TABLE agency_tenants (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  subdomain     VARCHAR(63) UNIQUE NOT NULL,   -- ajansiadi
  custom_domain TEXT,                           -- isteğe bağlı: kendi.com
  brand_config  JSONB DEFAULT '{}',             -- logo, renkler, slogan
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
-- brand_config örnek: {"logo_url":"...", "primary_color":"#c9a84c", "tagline":"İstanbul'un uzmanı"}
```

### SaaS Gelir Etkisi
- Pro plan içinde dahil (1.499 TL/ay)
- Enterprise: özel domain + beyaz etiket kaldırma (teklif bazlı)

---

<a name="20"></a>
## 20. Modül 17 — MLS Komisyon Paylaşım Sistemi

### Vizyon
Amerikan/İngiliz MLS (Multiple Listing Service) modelini Türkiye'ye taşıyoruz.  
Emlakçılar ilanlarını birbirleriyle paylaşır, satışta komisyonu böler.

### Akış

```
Emlakçı A ilan yükler → [x] MLS'e aç toggle → %50/%50 oran girer
Emlakçı B partner portalında MLS ilanlarını görür → müşterisine sunar
Satış gerçekleşir → platform komisyonu otomatik böler → her iki emlakçıya fatura
```

### Veritabanı

```sql
CREATE TABLE listing_mls_shares (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id      UUID REFERENCES listings(id) ON DELETE CASCADE,
  owner_agent_id  UUID REFERENCES users(id),
  is_shared       BOOLEAN DEFAULT FALSE,
  agent_share_pct DECIMAL(5,2) DEFAULT 50.00,
  co_agent_id     UUID REFERENCES users(id),  -- satışı gerçekleştiren ortak emlakçı
  status          VARCHAR(20) DEFAULT 'open',  -- 'open' | 'claimed' | 'sold'
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

<a name="21"></a>
## 21. Modül 18 — Property Management & Mülk Sağlık Skoru

### Vizyon
Kiralık mülk sahiplerini platforma **uzun vadeli** bağlayan özellik.  
Her 6 ayda bir kontrolör mülke gider, fotoğraf çeker, AI karşılaştırır.

### Akış

```
Kontrat imzalanır → "check_in" inspection oluşturulur (referans fotoğraflar)
→ 6 ay sonra sistem otomatik task oluşturur (emlakçı/kontrolör)
→ Mobil uygulama ile oda fotoğrafları yüklenir
→ FILTERRA.AI: referans vs güncel karşılaştırma → Mülk Sağlık Skoru (0-100)
→ Hasar varsa depozito akışına iletilir (Modül 19)
```

### Veritabanı

```sql
CREATE TABLE property_inspections (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id      UUID REFERENCES listings(id),
  contract_id     UUID,
  inspector_id    UUID REFERENCES users(id),
  inspection_type VARCHAR(50),  -- 'check_in' | '6_month_routine' | 'check_out'
  health_score    INTEGER CHECK (health_score BETWEEN 0 AND 100),
  ai_analysis     JSONB,         -- FILTERRA.AI'dan gelen detaylı rapor
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE inspection_photos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID REFERENCES property_inspections(id) ON DELETE CASCADE,
  url           TEXT NOT NULL,   -- Cloudflare R2
  room_tag      VARCHAR(100),    -- 'salon', 'mutfak', 'banyo', 'yatak_odasi'
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

---

<a name="22"></a>
## 22. Modül 19 — Depozito Güvence & FinTech Escrow

### Vizyon
Türkiye'deki kiracı-ev sahibi depozito kavgasını FinTech ile sonlandırıyoruz.

### Üç Depozito Modeli

| Model | Açıklama | Entegrasyon |
|-------|----------|-------------|
| **Cash Escrow** | Depozito platformun güvence havuzunda bekler | Iyzico escrow |
| **Banka Teminat Mektubu** | Kiracı bankadan teminat mektubu alır | Anlaşmalı banka API |
| **Depozito Kredisi** | Kiracı kredi çeker, faizsiz seçenek (katılım) | NESTLING.AI modülü |

### Akış

```
Kiracı depozito modelini seçer → Banka/platform onaylar → Kontrat imzalanır
→ Depozito kilitlenir (status: 'locked')
→ check_out inspection yapılır
→ Hasar yok: depozito kiracıya iade (status: 'released')
→ Hasar var: inspection_score baz alınır → hasar miktarı ev sahibine aktarılır
```

### Veritabanı

```sql
CREATE TABLE contract_deposits (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id      UUID NOT NULL,
  bank_id          UUID REFERENCES users(id),
  deposit_type     VARCHAR(50),  -- 'cash' | 'bank_guarantee_letter' | 'deposit_loan'
  amount           DECIMAL(14,2) NOT NULL,
  status           VARCHAR(50) DEFAULT 'locked',  -- 'locked' | 'disputed' | 'released'
  escrow_reference TEXT,
  release_notes    TEXT,         -- Avukat onay notu
  released_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
```

---

<a name="23"></a>
## 23. Modül 20 — Otomatik PDF Broşür Motoru

### Vizyon
İlan detay sayfasından tek tıkla "7fil Standartlarında Gayrimenkul Yatırım Broşürü" üretilir.  
İçerik: ilan fotoğrafları + FILTERRA.AI mahalle analizi + emlakçı iletişim bilgileri + QR kod.

### Teknik Çözüm

```
NestJS backend → Puppeteer servisi → PDF → Cloudflare R2'ye yükle → signed URL döndür
```

```typescript
// apps/api/src/pdf/pdf.service.ts
import puppeteer from 'puppeteer';

async generateListingBrochure(listingId: string): Promise<string> {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  // Özel broşür şablonu URL'i
  await page.goto(`${process.env.APP_URL}/brochure/${listingId}?print=true`);
  await page.waitForSelector('[data-ready="true"]');
  
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });
  
  await browser.close();
  
  // R2'ye yükle ve signed URL döndür
  return this.r2Service.uploadPdf(pdf, `brochures/${listingId}.pdf`);
}
```

---

<a name="24"></a>
## 24. Modül 21 — Doğal Dil Arama (NLS) & Atlas AI Eşleştirme

### Vizyon
Kullanıcı arama kutusuna istediği gibi yazar:  
_"Kadıköy'de metroya 5 dk, 4 milyona kadar balkonlu daire"_  
Atlas AI parametreleri söker, listings API'sine sorgu atar, kartları chat içinde gösterir.

### Teknik Akış

```
Kullanıcı mesajı → FILTERRA.AI (Claude claude-sonnet-4-20250514) parametreleri parse eder
→ Structured query JSON döner → listings API'sine sorgu → ilan kartları chat'e basılır
```

### Atlas AI Parse Prompt (Sistem Promptu — Cache'lenecek)

```typescript
const ATLAS_PARSE_SYSTEM = `
Sen 7fil gayrimenkul platformunun arama asistanısın.
Kullanıcının Türkçe doğal dil sorgusundan aşağıdaki JSON yapısını çıkar.
Eğer bir alan belirtilmemişse null döndür. Sadece JSON döndür, açıklama ekleme.

{
  "district": string | null,        // İlçe (örn: "Kadıköy")
  "city": string | null,            // Şehir (varsayılan: "İstanbul")
  "listingType": "satilik"|"kiralik"|null,
  "propertyType": "daire"|"villa"|"arsa"|"dukkan"|null,
  "maxPrice": number | null,        // TL cinsinden
  "minPrice": number | null,
  "minRooms": number | null,        // Oda sayısı
  "maxMetro": number | null,        // Metroya dakika uzaklık
  "features": string[],             // ["balkon","otopark","havuz"]
  "intent": "search"|"analysis"|"finance"|"legal"
}
`;
```

### Prompt Caching Entegrasyonu

```typescript
// packages/filterra-ai/src/atlas.service.ts
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1000,
  system: [
    {
      type: 'text',
      text: ATLAS_PARSE_SYSTEM,
      cache_control: { type: 'ephemeral' },  // ← Maliyet %80 azalır
    }
  ],
  messages: [{ role: 'user', content: userMessage }],
});
```

---

<a name="25"></a>
## 25. Modül 22 — Avukat Portalı Dashboard

### Vizyon
Platformun en güçlü farklılaştırıcısı: sertifikalı avukatlar için ayrı dashboard.  
Avukat tapu belgelerini inceler, Claude API'nin ürettiği hukuki risk checklist'ini onaylar, e-imza basar.

### Avukat Dashboard Ekranları

1. **Bekleyen Dosyalar** — Emlakçıların yüklediği tapu/belge kuyrukları
2. **Hukuki Risk Raporu** — FILTERRA.AI ön analizi (risk skoru + maddeler listesi)
3. **Onay / Revizyon** — Avukat notu ekler ve onaylar veya revizyon ister
4. **Dijital İmza** — e-Güven entegrasyonu (MVP: manuel onay + timestamp)
5. **Müvekkil Geçmişi** — Avukatın işlem yaptığı tüm dosyalar

### Hukuki Risk Prompt Şablonu

```typescript
const LEGAL_RISK_SYSTEM = `
Sen 7fil platformu için çalışan Türk gayrimenkul hukuku uzmanı bir yapay zeka asistanısın.
Sana verilen tapu, yetki belgesi veya sözleşme metnini analiz et.
Aşağıdaki JSON formatında yanıt ver:

{
  "risk_score": 0-100,  // 0: temiz, 100: kritik risk
  "risk_level": "temiz"|"dikkat"|"kritik",
  "issues": [
    {
      "category": "ipotek"|"imar"|"tapu"|"veraset"|"diger",
      "severity": "dusuk"|"orta"|"yuksek",
      "description": "Açıklama",
      "recommendation": "Önerilen aksiyon"
    }
  ],
  "summary": "Kısa özet (2-3 cümle)"
}
Sadece JSON döndür.
`;
```

---

<a name="26"></a>
## 26. Yeni Nesil Arama Mimarisi (Google I/O 2026 İlhamı)

Google'ın 2026 arama vizyonu "AI Mode" ile sorgu → yanıt → keşif döngüsünü kırıyor.  
7fil bu trende kendi sektöründe öncülük etmeli.

### 7fil Arama Vizyonu (3 Katman)

```
Katman 1 — Klasik Filtreli Arama (mevcut, iyileştirilecek)
  → Meilisearch full-text + PostGIS coğrafi filtre

Katman 2 — Doğal Dil Arama (Modül 21)
  → Atlas AI parse → structured query → anlık sonuçlar

Katman 3 — Proaktif Keşif (yeni vizyon)
  → Kullanıcı profilinden öğrenen, push notification ile önerileri
    geceden sabaha kullancının önünde hazır hale getiren sistem
  → "Dün aradığın kriterlerle 3 yeni ilan eklendi — bak bakalım 🐘"
```

### Harita Katman Filtreleri (Zoopla / Rightmove İlhami)

```typescript
// Harita üzerinde toggle edilebilir katmanlar
const MAP_LAYERS = [
  { id: 'noise', label: 'Gürültü Haritası', source: 'OSM Noise' },
  { id: 'schools', label: 'Okul Puanları', source: 'MEB API' },
  { id: 'transport', label: 'Ulaşım Aksları', source: 'IBB Open Data' },
  { id: 'flood', label: 'Su Baskını Riski', source: 'AFAD' },
  { id: 'price_heat', label: 'Fiyat Isı Haritası', source: 'FILTERRA.AI' },
];
```

---

<a name="27"></a>
## 27. Veritabanı Şeması Ekleri (v2)

v1 `init.sql`'e eklenecek tablolar — mevcut şemayı bozmaz:

```sql
-- Modül 16: SaaS White-Label
CREATE TABLE agency_tenants ( ... );  -- Bkz. Modül 16

-- Modül 17: MLS
CREATE TABLE listing_mls_shares ( ... );  -- Bkz. Modül 17

-- Modül 18: Property Management
CREATE TABLE property_inspections ( ... );
CREATE TABLE inspection_photos ( ... );  -- Bkz. Modül 18

-- Modül 19: Depozito
CREATE TABLE contract_deposits ( ... );  -- Bkz. Modül 19

-- Modül 21: Arama Geçmişi & Öneri Motoru
CREATE TABLE user_search_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  query_text  TEXT,
  parsed_params JSONB,
  result_count INTEGER,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Modül 22: Avukat İşlem Dosyaları
CREATE TABLE legal_cases (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id    UUID REFERENCES listings(id),
  lawyer_id     UUID REFERENCES users(id),
  agent_id      UUID REFERENCES users(id),
  status        VARCHAR(50) DEFAULT 'pending',  -- 'pending'|'in_review'|'approved'|'revision'
  risk_score    INTEGER CHECK (risk_score BETWEEN 0 AND 100),
  ai_report     JSONB,     -- FILTERRA.AI hukuki analiz
  lawyer_notes  TEXT,
  approved_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

---

<a name="28"></a>
## 28. Bilinen Bug'lar & Teknik Borç

Acil çözülmesi gerekenler (DEVELOPER_BRIEF.md ile uyumlu):

| # | Sorun | Etki | Çözüm |
|---|-------|------|-------|
| 1 | Subscription tablosunda enum hatası | Production patlar | TypeORM entity'sindeki `plan` kolonunu `VARCHAR(50)` yap, enum kaldır |
| 2 | WhatsApp deep link statik | Dinamik ilan ID içermeli | `https://wa.me/90${phone}?text=7fil+${listingId}+ilanı+hakkında` |
| 3 | Subdomain routing yok | SaaS Builder çalışmıyor | middleware.ts tenant routing (Modül 16) |
| 4 | Netgsm SMS OTP entegre değil | Kayıt akışı tamamlanamıyor | AuthModule → Netgsm SDK |
| 5 | Mobilde filter-panel kayboluyor | Kullanıcı filtre kullanamıyor | `lg:hidden` → mobile bottom sheet drawer |

---

<a name="29"></a>
## 29. Antigravity İçin Sprint Prompt Paketi

### Sprint 3 — Antigravity Ana Brief

```
Sen Connective Hub Dijital Teknolojiler Ltd. Şti. bünyesindeki 7fil gayrimenkul 
platformunun baş yazılım mimarısın. Görevin aşağıdaki 3 kritik modülü sırayla 
tamamlamak:

SPRINT 3 HEDEFLERİ:

1. SUBDOMAIN ROUTING (Modül 16 — Kritik Bug #3)
   - apps/web-7fil/middleware.ts dosyasını yaz
   - subdomain tespiti → /tenant/[slug] rewrite
   - agency_tenants tablosunu oluştur
   - /app/tenant/[slug]/page.tsx dinamik tenant sayfasını yaz
   - Test: localhost:3000 üzerinde subdomain simülasyonu (host header override)

2. DOĞAL DİL ARAMA — ATLAS AI (Modül 21)
   - packages/filterra-ai/src/atlas.service.ts içine parseSearchQuery() metodu ekle
   - System prompt'u cache_control: { type: 'ephemeral' } ile sabitle
   - apps/web-7fil/app/api/atlas/route.ts API endpoint'ini oluştur
   - Frontend: arama kutusuna "AI Modu" toggle'ı ekle
   - İlk 3 eşleşen ilanı chat içinde ListingCard bileşeni olarak render et

3. AVUKAT DASHBOARD (Modül 22)
   - apps/partner-portal/app/lawyer/page.tsx sayfasını oluştur
   - legal_cases tablosunu DB şemasına ekle
   - "Bekleyen Dosyalar" listesi + FILTERRA.AI risk raporu görünümü
   - Onay/Revizyon akışı (status update API)

KULLANILACAK STACK:
- Next.js 14 App Router + TypeScript strict
- NestJS backend (apps/api)
- Tailwind CSS + packages/ui token sistemi (--ink, --gold, --teal, --cream)
- Playfair Display + DM Sans tipografi
- claude-sonnet-4-20250514 (Anthropic SDK, prompt caching aktif)
- PostgreSQL + TypeORM

MONOREPO KURALI: Yeni bileşenler packages/ui altına gider. 
Sayfa-özel kodlar ilgili app klasörüne gider.
Her yeni TypeScript tipi packages/types altına eklenir.

Başlamadan önce mevcut middleware.ts ve atlas.service.ts dosyalarını oku.
```

### Sprint 4 — Property Management & Depozito Brief

```
Connective Hub Sprint 4:

1. PROPERTY MANAGEMENT (Modül 18)
   - property_inspections ve inspection_photos tablolarını migration olarak ekle
   - InspectionsModule oluştur (NestJS): CRUD + fotoğraf yükleme (Cloudflare R2)
   - Mobil uyumlu "Kontrol Formu" arayüzü: oda bazlı fotoğraf yükleme + notlar
   - FILTERRA.AI entegrasyonu: check_in vs check_out fotoğraf karşılaştırma
     → Mülk Sağlık Skoru (0-100) üretimi
   - Partner portalda emlakçı için "Aktif Kontroller" sekmesi

2. DEPOZİTO GÜVENCE (Modül 19)
   - contract_deposits tablosunu ekle
   - Kontrat akışına "Depozito Modeli Seç" adımını ekle (3 seçenek: cash/teminat/kredi)
   - Iyzico escrow entegrasyonu (sandbox ile başla)
   - check_out sonrası otomatik iade/kesinti akışı

3. PDF BROŞÜR MOTORU (Modül 20)
   - NestJS'e PdfModule ekle (Puppeteer)
   - /brochure/[listingId] özel print template sayfası (Next.js)
   - İlan detay sayfasına "PDF Broşür İndir" butonu
   - R2'ye yükle → signed URL ile kullanıcıya sun
```

### Hızlı Fix Prompt (Bug #1 — Enum Hatası)

```
apps/api/src/subscriptions/entities/subscription.entity.ts dosyasını aç.
plan kolonu şu an @Column({ type: 'enum', enum: PlanType }) olarak tanımlı.
Bu TypeORM enum migration hatasına yol açıyor.

Düzeltme:
1. @Column({ type: 'varchar', length: 50 }) olarak değiştir
2. PlanType enum'ını kaldırma — sadece kolon tipini değiştir
3. Yeni bir migration oluştur: ALTER TABLE subscriptions ALTER COLUMN plan TYPE VARCHAR(50)
4. Migration'ı çalıştır ve test et
```

---

<a name="30"></a>
## 30. Claude Design Brief — Marka & Kimlik Çalışması

> Bu bölüm `https://claude.ai/design` için hazırlanmış prompt paketidir.  
> Her başlık ayrı bir design oturumu olarak kullanılabilir.

---

### 30.1 Marka Hikayesi & Ton Rehberi

**Claude Design için prompt:**

```
7fil, Türkiye'nin ilk tam entegre gayrimenkul ekosistemidir.

MARKA HİKAYESİ:
7 fil figürü; Türkiye, Hindistan, Güneydoğu Asya ve Orta Doğu'da yüzyıllardır 
kapı üstüne asılan, vitrinde sergilenen bereket ve koruma sembolüdür. Seramik, 
ahşap, mermer, cam, gümüş — her maddede var olan bu figür, ev edinmenin ritüelidir.
7fil platformu bu köklü inancı dijital çağa taşır.

7 fil = ev sahibi olmanın 7 adımı:
ARA → DEĞERLE → DOĞRULA → FİNANSE ET → SİGORTA ET → İMZALA → TAŞIN

MARKA KİŞİLİĞİ:
- Bilge ve güvenilir (deneyimli bir büyükbaba avukat gibi)
- Sıcak ama profesyonel
- Modern ama köklü
- Türkçe konuşur, dünya standartlarında düşünür

RENK PALETİ:
- --ink: #1a1a2e (derin gece mavisi — güven, derinlik)
- --gold: #c9a84c (antik altın — bereket, değer)  
- --teal: #2d6a6a (deniz mavisi-yeşili — huzur, denge)
- --cream: #f8f4ee (krem — sıcaklık, ev hissi)

TİPOGRAFİ:
- Başlıklar: Playfair Display (serif, lüks, köklü)
- Gövde: DM Sans (okunabilir, modern, samimi)

LOGO TASLAK BRIEF:
7 fil silüeti içinde soyutlanmış "7" rakamı veya "7f" harfleri.
Hortum yukarıya dönük. Altın ve lacivert renk kombinasyonu.
Hem dijital hem fiziksel baskıda net çalışmalı.
Eş zamanlı iki versiyon: tam logo + ikon/favicon versiyonu.
```

---

### 30.2 Satılık İlan Tasarımı

**Claude Design için prompt:**

```
7fil gayrimenkul platformu için "Satılık İlan" kartı ve detay sayfası tasarımı:

MARKA BAĞLAMI:
7fil = Türkiye'nin premium gayrimenkul platformu
Renk paleti: --ink (#1a1a2e), --gold (#c9a84c), --teal (#2d6a6a), --cream (#f8f4ee)
Tipografi: Playfair Display (başlıklar) + DM Sans (gövde)

İLAN KARTI (listing card) içermeli:
- Fotoğraf alanı (aspect ratio 4:3)
- Sol üst köşe: "SATILIK" etiketi (gold rengi)
- Fiyat: büyük, bold, altın rengi — Playfair Display
- Başlık: ilan adı (örn: "Kadıköy'de Deniz Manzaralı 3+1")
- Lokasyon satırı: 📍 ikon + mahalle, ilçe
- Özellik satırı: 🏠 m² | 🛏 oda sayısı | 🏢 kat
- Emlakçı küçük avatarı + adı (kart altında)
- Hover efekti: hafif yükselme + altın gölge
- "ATLAS AI Değerleme" küçük badge'i (teal rengi)

İLAN DETAY SAYFASI içermeli:
- Büyük galeri (ilk fotoğraf tam genişlik, altında küçük önizlemeler)
- Sol: tüm detaylar, özellikler, açıklama
- Sağ: sabit (sticky) contact card — fiyat + emlakçı + "WhatsApp'tan Sor" butonu
- "7 Adım" progress indicator (kullanıcı hangi adımda — Adım 1: Ara ✅)
- FILTERRA.AI mahalle analizi bölümü (skor + 3 önemli metrik)
- Benzer ilanlar (alt kısım)

Stil yönü: Lüks ama sıcak. Airbnb'nin samimiyeti + Sotheby's'in prestiji.
```

---

### 30.3 Kiralık İlan Tasarımı

**Claude Design için prompt:**

```
7fil için "Kiralık İlan" kartı tasarımı:

SATILIK kartından farkları:
- Etiket rengi: teal (#2d6a6a) — "KİRALIK"
- Fiyat sonuna "/ay" eklenir
- Ekstra özellik satırı: aidat bilgisi + depozito uyarısı
- "Depozito Güvence" badge'i (koruyucu kalkan ikonu, gold rengi)
  → Tıklandığında: "Bu ilan 7fil Depozito Güvence sistemi kapsamındadır" tooltip
- Kiralanma hızı göstergesi: "Bu bölgede ilanlar ortalama 12 günde kiranıyor"

Tüm diğer özellikler satılık kartla aynı.
```

---

### 30.4 Partner (Emlakçı) İlan Kartı

**Claude Design için prompt:**

```
7fil Partner Portal için "emlakçı ilan yönetim kartı" tasarımı:

Bu kart emlakçının kendi dashboard'unda görünür. Alıcı kartından farklı:
- Arka plan: --ink (dark mode)
- İlan durumu badge'i: "AKTİF" (yeşil) / "PASİF" (gri) / "ÖNE ÇIKARILMIŞ" (gold)
- Görüntülenme sayısı: 👁 1.247 görüntülenme
- WhatsApp tıklama sayısı: 💬 34 talep
- "MLS'e Aç" toggle switch (teal rengi)
- Sağ üst köşe: 3 nokta menü → Düzenle / Pasifleştir / PDF Broşür / Sil
- Süre göstergesi: "12 gün kaldı" (progress bar, gold rengi)
- Alt: "ATLAS AI Optimize Et" butonu → AI ilan başlığını iyileştirir
```

---

### 30.5 Kurumsal Kimlik Materyalleri

**Claude Design için prompt:**

```
7fil markaForConnective Hub Dijital Teknolojiler Ltd. Şti. için kurumsal kimlik paketi:

1. KARTVIZIT (85x55mm, iki yüz):
   Ön yüz: 
   - Sol: fil silüeti logosu (altın rengi, dikey çizgi ile ayrılmış)
   - Sağ: isim (Playfair Display, büyük), ünvan (DM Sans, küçük), iletişim
   - Arkaplan: --ink lacivert, altın detaylar
   
   Arka yüz:
   - Ortada büyük 7fil logosu
   - "7 adımda ev sahibi olmanın platformu"
   - Web: 7fil.com.tr
   - QR kod: profil sayfasına yönlendiren

2. ZARFI (DL zarf, 220x110mm):
   - Sol köşe: küçük 7fil logosu + adres
   - Zarfın alt kenarında ince altın şerit
   - Arkaplan: krem (#f8f4ee), minimal

3. DOSYA / KLASÖR (A4):
   - Kapak: full --ink arkaplan
   - Büyük fil silüeti (yarı saydam, sağ altta)
   - 7fil logosu sol üst
   - "Gayrimenkul Danışmanlık Dosyası" alt başlık
   - Altın kenarlık detayı

4. ANTETLI KAĞIT (A4):
   - Üst header: logo + iletişim bilgileri (ince, zarif)
   - Alt footer: web + sosyal medya + "Powered by FILTERRA.AI" (çok küçük)
   - Sol kenar: 3mm altın şerit

5. TIŞÖRT (ön ve arka):
   Ön: 
   - Göğüs sol: küçük 7fil logosu (nakış efekti)
   Arka:
   - Büyük fil silüeti (merkezde, tonal — aynı renk farklı ton)
   - Alt: "Evin için doğru adım." tagline
   - Renk seçenekleri: lacivert üzerine altın VEYA krem üzerine lacivert

6. ÇANTA (bez çanta, tote bag):
   - Ortada büyük fil illüstrasyonu (hand-drawn tarzı, minimalist çizgi)
   - Alt: 7fil.com.tr
   - Lacivert bez + altın baskı

Genel yön: Premium ama erişilebilir. Sotheby's ciddiyeti + Airbnb sıcaklığı.
Her materyal tek başına da, grup halinde de tutarlı görünmeli.
```

---

### 30.6 Sosyal Medya Şablonları

**Claude Design için prompt:**

```
7fil için sosyal medya şablon seti:

1. INSTAGRAM POST (1080x1080px) — "Yeni İlan Duyurusu":
   - Üst 60%: ilan fotoğrafı (tam kaplama)
   - Alt 40%: --ink arkaplan
   - Fiyat: büyük, altın, Playfair Display
   - Lokasyon + özellikler: küçük, beyaz, DM Sans
   - Sağ alt: 7fil logosu
   - Hafif şeffaf üstten alta gradient overlay

2. INSTAGRAM STORY (1080x1920px) — "Piyasa Analizi":
   - FILTERRA.AI mahalle raporu formatı
   - Büyük başlık: "Kadıköy Piyasa Raporu" 
   - 3 metrik kartı (ortalama fiyat / m² fiyatı / aylık değişim)
   - Atlas AI imzası (sol alt)
   - Swipe up: "7fil.com.tr'de incele"

3. LINKEDIN POST (1200x628px) — "Kurumsal / B2B":
   - TicariMetre markası (teal tonları)
   - "Ticari Gayrimenkul Analizi" başlığı
   - 2 sütun: istatistik kartları
   - "Powered by FILTERRA.AI" alt tag

Stil tutarlılığı: Her platformda aynı tipografi ve renk sistemi.
Her şablonda logo konumu tutarlı: sağ alt köşe.
```

---

### 30.7 Web & Mobil UI Sistemi

**Claude Design için prompt:**

```
7fil Design System — Temel UI Bileşenler:

Ana renk tokeni sistemi:
:root {
  --ink: #1a1a2e;
  --gold: #c9a84c;
  --teal: #2d6a6a;
  --cream: #f8f4ee;
  --white: #ffffff;
  --muted: #6b7280;
}

Tasarlanması istenen bileşenler:

1. BUTON SETİ (5 varyant):
   Primary: --gold arkaplan, --ink text, hafif yükselme hover
   Secondary: --ink arkaplan, --gold text, altın border
   Ghost: şeffaf arkaplan, --ink text, hover'da teal alt çizgi
   Danger: kırmızı ton (silme işlemleri için)
   Atlas AI: gradient (teal → ink), parlama efekti

2. FORM ELEMANLARI:
   Input: krem arkaplan, ink border, focus'ta gold border glow
   Select: aynı stil + chevron ikonu altın rengi
   Toggle switch: off = gri, on = teal

3. KART TİPLERİ:
   Listing card: (önceki brief'te detaylandırıldı)
   Stat card: büyük sayı (altın) + küçük açıklama + trend ikonu
   Alert card: 3 tip — info (teal), warning (gold), error (kırmızı)

4. NAVİGASYON:
   Desktop: sticky header, logo sol, nav orta, CTA sağ
   Mobil: hamburger → full screen menu, fil silüeti arka plan

5. 7 ADIM PROGRESS INDICATOR:
   7 fil ikonu, tamamlananlar altın rengi, aktif olan pulse animasyonu
   Tıklanabilir, her adım ilgili sayfaya yönlendirir

Çıktı: Figma değil, doğrudan HTML/CSS veya Tailwind kodlu bileşenler.
Shadcn/ui base üzerine 7fil token sistemi uygulanmış versiyon.
```

---

*7fil.com.tr — Türkiye'nin ilk entegre gayrimenkul ekosistemi*  
*Connective Hub Dijital Teknolojiler Ltd. Şti. — Dijital Teknokent*  
*Powered by FILTERRA.AI | v2.0 Extension — Mayıs 2026*
