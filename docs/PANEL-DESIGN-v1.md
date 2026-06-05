# 7fil Acenta Paneli — Tasarım & Üstünlük Belgesi v1.0
### "Sahibinden Ofisim'i Her Sayfada Geçen Panel"
> **Tarih:** Haziran 2026  
> *Sahibinden Ofisim panel analizi + 7fil panel üstünlük haritası + geliştirme planı*

---

## 1. Sahibinden Ofisim Panel — Tam Analiz

### Navigation Yapısı (Ofisim)
```
Özet · İlanlar · Sanal Turlar · Mesajlar · Müşteri Yönetimi
Favoriler · Raporlar · Değerlendirmelerim · Satın Al · Hesabım
```

### Sayfa Bazlı Zayıflık Analizi

---

#### 1.1 ÖZET (Dashboard)

**Ne var:**
- Ziyaret Sayısı (Son 24 saat) — sayı + bar chart
- Mağaza Performansı — 7 günlük çizgi grafik
- Metrikler: Yayındaki İlan, Görüntülenme, Mesaj Adedi, Favoriye Alınma, Aranma (Mobil)
- Abonelik durumu (donut chart — kalan ilan hakkı)
- Talebi Olan Müşteri / Toplam Talep: 0/0 (boş widget)
- Müşteriye Uygun İlanlar: 0 (boş widget)

**Kritik Problemler:**
```
✗ "Talebi Olan Müşteri: 0" — CRM tamamen boş, manuel giriş gerekiyor
  → Hiçbir otomatik lead capture yok
  → WhatsApp'tan gelen müşteri sisteme girmiyor

✗ "Mesaj Adedi: ▼%100" — Platform içi mesajlaşma ölü
  → Herkes WhatsApp'a kaçıyor, platform bunu yakalayamıyor
  → WhatsApp entegrasyonu sıfır

✗ Grafik 7 günlük, çok yüzeysel
  → Hangi ilanın hangi saatte, nereden (mobil/desktop/şehir) trafik aldığı yok
  → Funnel analizi yok: kim baktı → kim favoriledi → kim sordu → kim geldi

✗ "Müşteriye Uygun İlanlar: 0" — AI eşleştirme yok
  → Müşteri profili (bütçe, oda, lokasyon) ile ilan eşleştirme manuel
  → Acenta bunu elle yapmak zorunda

✗ Abonelik widget'ı "75 ilanın 18'ini kullandın" diyor
  → Kota baskısı yaratıyor, acentayı upgrade'e zorluyor
  → Değer önerisi yok — neden upgrade yapayım?
```

---

#### 1.2 İLANLAR

**Ne var:**
- Yayında/Yayında Değil/Tümü tabları
- Her ilana: görüntülenme, favori, mesaj, bildirim sayısı
- "Doping Yap" butonu
- "İşlemler" dropdown (düzenle, pasifleştir, sil)
- "İlan tarihinin otomatik güncellenmesine X saat kaldı" uyarısı

**Kritik Problemler:**
```
✗ "İlan tarihinin otomatik güncellenmesine 4 saat kaldı"
  → Bu bir engagement trap: acentayı her gün platforma çekmek için yapay baskı
  → Acenta günde bir kez platforma girip "güncelle" basmak zorunda
  → SaaS değil, angaryaya benziyor

✗ "Doping Yap" = tek seçenek
  → Öne çıkarmak için sadece para var
  → AI başlık optimizasyonu yok
  → Fotoğraf kalite önerisi yok ("3. fotoğrafın çözünürlüğü düşük, değiştir")
  → SEO anahtar kelime önerisi yok
  → "Bu ilan %40 daha az görüntülenme alıyor, neden?" analizi yok

✗ "İşlemler" dropdown çok sınırlı
  → PDF broşür üret: YOK
  → Sosyal medya paylaş: YOK
  → WhatsApp ile paylaş: YOK
  → Atlas AI ile optimize et: YOK
  → Benzer ilanlarla karşılaştır: YOK
  → MLS'e aç: YOK

✗ İlan başlıkları BÜYÜK HARF — SEO kötü, okunabilirlik düşük
  → Platform uyarı bile vermiyor
  → "Başlığınızı düzeltin, %30 daha fazla tıklanır" önerisi yok

✗ Kullanıcı filtresi var ("Abdullah Turgut Aybulut ✕")
  → Çok kullanıcılı ofis için iyi ama UI kötü
  → Kimin hangi ilanı yönettiği net görünmüyor
```

---

#### 1.3 SANAL TURLAR

**Ne var:**
- İlana Ekli Olmayanlar / İlana Ekli Olanlar tabları
- Promosyon banner (sarı, dikkat dağıtıcı)

**Kritik Problemler:**
```
✗ Sanal tur oluşturmak ile ilana bağlamak ayrı workflow
  → "İlana Ekli Olmayanlar (0)" — acenta oluşturmuş ama bağlayamamış
  → UX kopuk, iki ayrı ekranda iş yapmak gerekiyor

✗ Müşteri Yönetimi dropdown içinde: Rehber · Talepler · Yer Gösterme · Sözleşmeler
  → Bunlar ayrı ayrı sayfalar, izole deneyim
  → Yer gösterme randevusu ≠ takvimde görünmüyor
  → Sözleşme ≠ imzalı doküman yönetimi değil
```

---

#### 1.4 MÜŞTERİ YÖNETİMİ

**Ne var:**
- Rehber (kişi listesi)
- Talepler
- Yer Gösterme
- Sözleşmeler

**Kritik Problemler:**
```
✗ Gerçek CRM pipeline yok
  → Lead aşamaları yok: İlgileniyor → Görüşme → Teklif → Kapandı → Kayıp
  → Conversion rate takibi yok
  → "Bu müşteriyle 3 aydır görüşüyorsunuz, neden kapanmadı?" analizi yok

✗ Lead kaynağı takibi yok
  → Bu müşteri WhatsApp'tan mı, formdan mı, referansla mı geldi?
  → Hangi kanaldan en iyi lead geliyor? Bilgi yok.

✗ Otomatik takip hatırlatması yok
  → "Ahmet Bey'i 7 gündür aramadınız" bildirimi yok
  → Atlas AI önerisi: "Bu müşteri Kadıköy arıyor, yeni ilan var" yok

✗ Sözleşmeler modülü var ama dijital imza yok
  → PDF upload + indirme var, hepsi bu
  → e-İmza entegrasyonu yok
```

---

#### 1.5 RAPORLAR

**Kritik Problemler:**
```
✗ Temel view/favori sayıları — çok yüzeysel
✗ Rekabetçi analiz yok (bölgedeki rakip acentaların performansı)
✗ Piyasa trendi yok (bu bölgede m² fiyatı nasıl değişiyor)
✗ Aylık PDF rapor yok (acentalar müvekkillere sunamıyor)
✗ Trafik kaynağı analizi yok (Google, sosyal medya, direkt)
✗ Hangi saatlerde daha fazla görüntülenme var? Yok.
✗ Ziyaretçi coğrafyası yok (hangi ilçeden bakıyorlar)
```

---

#### 1.6 GENEL EKSİKLER (Tüm Panelde)

```
❌ AI asistan yok (içerik üretme, başlık önerisi, değerleme)
❌ MLS / komisyon paylaşımı yok
❌ White-label subdomain yok (acenta kendi markasıyla site kuramıyor)
❌ PDF broşür üretme yok
❌ WhatsApp toplu mesaj yok
❌ Müzayede yok
❌ Depozito güvence yok
❌ Hukuki kontrol yok
❌ Gerçek takvim / randevu yönetimi yok
❌ Sosyal medya içerik otomasyonu yok (Instagram post üret vb.)
❌ YouTube script üretimi yok
❌ SEO rehberliği yok
❌ Mortgage / finans araçları yok
❌ Fotoğraf kalite kontrolü yok
❌ Dark mode yok
❌ Mobil uygulama çok zayıf
❌ Gerçek performans benchmarking yok
   (Ben bölgede ortalamanın üstünde miyim?)
```

---

## 2. 7fil Panel — Üstünlük Haritası

### Her Sahibinden Sayfasına Karşı 7fil'in Cevabı

---

### 2.1 7fil ÖZET — Sahibinden'den Nasıl Üstün

```
7fil Dashboard Farkları:

✅ Gerçek Funnel Analizi
   Gördü (X) → Favoriledi (Y) → WhatsApp'a tıkladı (Z) → Randevu aldı (W)
   Her adımda conversion rate → "Hangi ilanlarda funnel kırılıyor?"

✅ WhatsApp Entegrasyonu Dahil Dashboard'a
   WhatsApp'tan gelen her tıklama sisteme düşer
   Müşteri otomatik CRM'e eklenir (opsiyonel)
   "Bu hafta 34 WhatsApp tıklaması" — gerçek lead sayısı

✅ AI Lead Eşleştirme — Otomatik
   CRM'deki müşteri profiliyle yeni ilanlar eşleşince:
   "Ahmet Bey'in kriterleriyle eşleşen 3 yeni ilan: [göster]"
   Acenta "Kişi Ekle" yapmak zorunda kalmaz, sistem yapar

✅ Rekabetçi Benchmark
   "Bölge ortalamasının %18 üzerinde performans alıyorsunuz"
   "Rakipleriniz aylık ortalama 28 ilan yayınlıyor, siz 18"
   FILTERRA.AI verisiyle güçlendirilmiş

✅ Atlas AI Dashboard Önerileri
   "Bu hafta 3 ilanınız %40 az görüntüleniyor — optimize etmemi ister misiniz?"
   "Kadıköy'de kiralık talep arttı — bu bölgede ilanınız yok"
   Akıllı, proaktif öneri sistemi

✅ Abonelik Widget'ı — Değer Odaklı
   "Bu ay AI içerik: 12 post üretildi (değeri ~2.400 TL)"
   "MLS üzerinden 3 işbirliği talebi"
   Para değil, değer vurgusu

✅ Gerçek Zamanlı Bildirimler (değer katan)
   "Beşiktaş 3+1 ilanınız son 1 saatte 47 kez görüntülendi"
   "MLS: Bir acenta ilanınız için işbirliği talep etti"
   "SCOUT uyarısı: Kriterleri olan 2 müşteriniz için yeni ilan açıldı"
```

---

### 2.2 7fil İLAN YÖNETİMİ — Sahibinden'den Nasıl Üstün

```
İlan Kartı — 7fil Farkları:

✅ "Oto-Güncelleme" baskısı YOK
   7fil'de ilan kalitesi algoritmik: iyi içerik → görünür kalır
   Günlük "güncelle" angaryası yok

✅ "Atlas AI ile Optimize Et" — Her İlan Kartında
   Tıkla → AI analizi:
   - "Başlık BÜYÜK HARF, değiştirmenizi öneririz: [öneri]"
   - "3. fotoğraf bulanık, değiştirince %25 daha fazla tıklanır"
   - "Bu fiyat bölge ortalamasının %12 üzerinde — açıklama ekleyin"
   - "SEO: 'İzmit merkez' anahtar kelimesini başlığa ekleyin"

✅ "İşlemler" dropdown — 7fil versiyonu:
   ✏️  Düzenle
   🤖  Atlas AI ile Optimize Et          ← SAHIBINDEN'DE YOK
   📄  PDF Broşür Oluştur               ← SAHIBINDEN'DE YOK
   📱  Sosyal Medya Paketi Üret         ← SAHIBINDEN'DE YOK
   🔗  WhatsApp Paylaşım Linki          ← SAHIBINDEN'DE YOK
   🤝  MLS'e Aç / Kapat                 ← SAHIBINDEN'DE YOK
   📊  Detaylı İstatistikler
   🔨  Müzayedeye Çevir                 ← SAHIBINDEN'DE YOK
   ⏸  Pasifleştir
   🗑  Sil

✅ İlan Kartında Görünen Metrikler — Genişletilmiş:
   👁  Görüntülenme  |  💬 WhatsApp  |  ⭐ Favori  |  📞 Arama
   + Görüntülenme kaynağı: [Organik %60 | Öne Çıkarma %25 | MLS %15]
   + Funnel: "8 kişi baktı, 3'ü favoriledi, 1'i sordu" → conversion %12.5

✅ MLS Toggle — Her İlan Kartında
   Toggle açıkça görünür: "Komisyon Paylaşımına Aç"
   Açıkken: "%50 / %50" oran + "4 acenta bu ilanı gösteriyor"

✅ Fotoğraf Kalite Uyarısı
   Düşük çözünürlüklü fotoğraf → sarı uyarı ikonu
   "3 fotoğrafınız optimize değil — değiştirince %30 daha fazla tıklanır"
```

---

### 2.3 7fil CRM — Sahibinden'den Nasıl Üstün

Sahibinden: "Müşteri Yönetimi" = basit kişi listesi  
7fil: Gerçek Kanban CRM Pipeline

```
/panel/crm — Kanban Görünümü:

┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│  YENİ LEAD  │  İLETİŞİMDE  │  GÖRÜŞME    │  TEKLİF      │  KAPANDI ✓  │
│    (12)     │     (8)      │    (5)       │    (3)       │    (24)     │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ Ahmet K.    │ Fatma Y.     │ Kemal D.    │ Selin A.     │ ...         │
│ WhatsApp'tan│ 3. görüşme   │ Yarın 14:00 │ 3.2M TL     │             │
│ Beşiktaş 3+1│ Bütçe: 5M   │ randevu var │ beklemede    │             │
│ [Atlas AI ▼]│ [Öneri: ▸]  │ [Takvim ▸]  │ [Takip ▸]   │             │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘

Her Kart İçeriği:
  → Müşteri adı + kaynak (WhatsApp/Form/Referans/Yüz yüze)
  → İlgilendiği ilan(lar)
  → Bütçe, oda tercihi, lokasyon
  → Son iletişim tarihi + kaç gün geçti
  → Sonraki takip tarihi (uyarı: geçmişse kırmızı)
  → Atlas AI önerisi: "Bu müşteri için 3 uygun ilan var"

Atlas AI CRM Entegrasyonu:
  → Yeni ilan açıldığında → ilgili müşterilere otomatik önerir
  → "Ahmet Bey 5M TL bütçeyle Beşiktaş arıyor — yeni ilanınız uygun"
  → Lead nurturing: 7 gün sessizse → "Takip zamanı" bildirimi
  → Kayıp analizi: "Bu ay 4 lead kapanmadı — ortak neden: fiyat yüksek"
```

---

### 2.4 7fil RAPORLAR — Sahibinden'den Nasıl Üstün

```
Sahibinden Raporu:  Görüntülenme + Favori sayısı (7 günlük)
7fil Raporu:        Çok katmanlı analitik platformu

Katman 1 — Temel Metrikler (Sahibinden seviyesi, herkese ücretsiz):
  Görüntülenme · WhatsApp tıklama · Favori · Mesaj

Katman 2 — Funnel Analizi (Pro):
  Gördü → Favoriledi → Sordu → Randevu → Satış/Kiralama
  Her aşamada kayıp oranı → "Nerede kaybediyorsunuz?"

Katman 3 — Trafik Analizi (Pro):
  Kaynak: Organik arama · Sosyal medya · MLS · Direkt link · Öne çıkarma
  Cihaz: Mobil %68 · Desktop %28 · Tablet %4
  Saat bazlı: Hangi saatte en çok görüntülenme?
  Coğrafya: Hangi ilçeden bakıyorlar?

Katman 4 — Rekabetçi Analiz (Kurumsal):
  "Bölgenizdeki rakip acentaların ortalama performansı"
  "Sizin ilanlarınız vs bölge ortalaması" karşılaştırma
  "Bu ilçede fiyat trendi — son 3 ay" (FILTERRA.AI verisi)

Katman 5 — Aylık PDF Raporu (Kurumsal):
  Tüm verilerin profesyonel PDF formatında özeti
  Mülk sahiplerine sunmak için hazır format
  "Bu ay: 24.891 görüntülenme, 187 WhatsApp, 8 randevu, 2 satış"
  7fil marka kimliğiyle — Playfair Display + altın/lacivert
```

---

### 2.5 7fil İÇERİK FABRİKASI — Sahibinden'de Hiç Yok

```
/panel/icerik — 3 Alt Bölüm:

SOSYAL MEDYA:
  İlan seç → "Paket Üret" → 30 saniyede hazır:
  ├── Instagram caption + 15 hashtag + thumbnail brief
  ├── Twitter/X paylaşım metni
  ├── LinkedIn post (B2B ton)
  ├── Facebook post
  └── TikTok/Reels script (30 sn hook + CTA)

BLOG:
  Konu seç → SCRIBE ajanı yazar:
  ├── "Kadıköy'de Ev Alma Rehberi 2026"
  ├── "Bu Bölgede m² Fiyatı Neden Yükseliyor?"
  ├── "Kiracı Hakları: Bilmeniz Gerekenler"
  └── SEO optimize, 800-1.200 kelime, acenta adıyla imzalı

YOUTUBE:
  Konu seç → YT-DIRECTOR paketi:
  ├── Tam script (hook + gövde + CTA + outro)
  ├── Başlık önerileri (3 seçenek, tıklanabilirlik odaklı)
  ├── Açıklama (5.000 karakter, keyword rich)
  ├── 15 YouTube tag
  ├── Thumbnail brief (tasarımcıya verilecek)
  └── Shorts adaptasyonu (60 sn)
```

---

### 2.6 7fil SANAL TUR → 3D & VR — Sahibinden'den Nasıl Üstün

```
Sahibinden: Sanal tur oluştur → ilana bağla (2 ayrı ekran, kopuk UX)

7fil:
  İlan oluşturma akışında adım 4: "3D Tur Ekle"
  → Tek akış, kopukluk yok
  → Fotoğraf yükle → AI ile 360° tur oluştur (entegre araç)
  → İlan + tur = aynı sayfada önizleme
  → "Bu ilan 3D tur içeriyor" badge → %40 daha fazla tıklanma
  → Sanal tur linki WhatsApp'a tek tıkla gönder

Gelecek (Sprint 5):
  → INSPECTOR AI: Mülk fotoğraflarını analiz et
    "Mutfak eskimiş görünüyor — yenileme sonrası değer %15 artar"
    "Banyo fotoğrafı karanlık — yeniden çekin"
```

---

### 2.7 7fil HESABIM → MARKA — Sahibinden'den Nasıl Üstün

```
Sahibinden Hesabım:
  → Görünen ad seçimi (6 seçenek radio button)
  → Bildirim tercihleri
  → Elektronik ileti izni
  → Engellenenler
  Hepsi bu.

7fil /panel/marka:
  → Subdomain: acenta.7fil.com.tr — tek tıkla kur
  → Logo yükle + renk seç → subdomain siteniz canlı
  → Custom domain bağla (Kurumsal+): kendi.com.tr
  → Acenta profil sayfası önizleme
  → WhatsApp Business linki entegre et
  → Google My Business senkronizasyonu
  → E-imza profili (avukat onaylı sözleşmeler için)
  → "7fil Onaylı Acenta" rozeti durumu
  → Çalışan hesapları yönetimi (Kurumsal)
```

---

## 3. 7fil Panel — Tam Route & Özellik Listesi

### Navigation Karşılaştırması

| Sahibinden Ofisim | 7fil Panel |
|---|---|
| Özet | Dashboard (AI destekli) |
| İlanlar | İlanlar (AI optimize + MLS toggle) |
| Sanal Turlar | → İlan akışına entegre (ayrı sayfa yok) |
| Mesajlar | Mesajlar (WhatsApp entegre) |
| Müşteri Yönetimi | CRM (Kanban pipeline) |
| Favoriler | — (alıcı özelliği, panelde gereksiz) |
| Raporlar | Analitik (çok katmanlı) |
| Değerlendirmelerim | Değerlendirmeler (Google + platform) |
| Satın Al | Abonelik (değer odaklı) |
| Hesabım | Marka + Profil + Çalışanlar |
| — | **İçerik Fabrikası** ← YENİ |
| — | **MLS Havuzu** ← YENİ |
| — | **Property Management** ← YENİ |
| — | **Depozito Güvence** ← YENİ |
| — | **PDF Broşür** ← YENİ |
| — | **Atlas AI** ← YENİ |
| — | **Müzayede** ← YENİ |
| — | **Takvim** ← YENİ |
| — | **Eğitim Merkezi** ← YENİ |

---

## 4. İlan Yönetim Kartı — Tasarım Spesifikasyonu

Sahibinden'in ilan kartına kıyasla 7fil'in ilan yönetim kartı:

```
┌─────────────────────────────────────────────────────────────────────┐
│  [📸 Thumbnail]  CB-MARK'TAN İZMİT ÇARŞIDA 3+1 KİRALIK DAİRE      │
│    80×80 px      Kiralık → Daire → İzmit / Karabaş Mh.             │
│    rounded       Yayında: 05.06.2026 | Bitiş: 20.06.2026           │
│                                                                     │
│  [AKTİF 🟢]  [ÖNE ÇIKARILMIŞ ⭐ — 8 gün kaldı ████████░░]        │
│                                                                     │
│  👁 1.059  💬 WA: 34  ⭐ Favori: 12  📞 Arama: 8                   │
│  Funnel: 1.059 gördü → 12 favoriledi → 34 sordu (%3.2 conv.)       │
│  Kaynak: Organik %72 | Boost %20 | MLS %8                          │
│                                                                     │
│  🤝 MLS: [KAPALI toggle]  |  🔨 Müzayede: [Çevir]                  │
│                                                                     │
│  [🤖 Atlas AI ile Optimize Et]  [📄 PDF Broşür]  [⋮ İşlemler ▼]   │
└─────────────────────────────────────────────────────────────────────┘

Atlas AI Optimize Et — açıldığında:
  ⚠️  "Başlık tamamen büyük harf — %20 daha az tıklanıyor"
      Öneri: "İzmit Çarşı'da 3+1 Kiralık Daire | 22.000 TL"
      [Uygula]

  ⚠️  "2. fotoğraf bulanık (480px) — değiştirince %25 daha fazla etkileşim"
      [Fotoğraf Güncelle]

  ✅  "Fiyat bölge ortalamasında — rekabetçi"

  💡  "Bu ilan için Instagram post hazır — [Gör & Paylaş]"
```

---

## 5. Dashboard Wireframe — 7fil vs Sahibinden

### Sahibinden Özet:
```
[Ziyaret 349]  [Mağaza Performansı — çizgi grafik]  [Abonelik donut]
[Talebi Olan Müşteri: 0]  [Müşteriye Uygun İlanlar: 0]
```

### 7fil Dashboard (Sprint 3 hedef):
```
Row 1 — KPI Bar (4 kart):
  [👁 Toplam Görüntülenme: 24.891 ↑%18]
  [💬 WhatsApp Tıklama: 1.247 ↑%32]
  [🎯 Aktif Lead: 23 / Kanban'da]
  [📋 Aktif İlan: 23 / 50 hak]

Row 2 — Grafik + AI Öneri:
  [Görüntülenme Trendi — 8 haftalık sparkline bar chart]
  [Atlas AI Akıllı Öneriler — 3 öneri kartı]
    "Beşiktaş ilanınız %40 az görüntüleniyor — optimize et"
    "Ahmet Bey için 3 uygun ilan var — göster"
    "Bu hafta MLS'te 2 işbirliği talebi bekliyor"

Row 3 — İlan Performans Tablosu + Funnel:
  [Top 5 ilan — views / WA / favori / funnel / durum]
  [Hızlı aksiyonlar: AI Optimize | PDF | MLS]

Row 4 — CRM Özeti + İçerik Özeti:
  [CRM: 12 yeni lead | 3 takip gecikmiş | 2 teklif aşamasında]
  [İçerik: Bu ay 8 post üretildi | 4 YouTube script hazır]

Row 5 — Piyasa Verisi (FILTERRA.AI):
  [Bölgenizdeki ortalama m² fiyatı: +%3.2 bu ay]
  [Rakip ortalaması: 28 ilan — sizin: 23]
  [En aktif günler: Salı, Perşembe]
```

---

## 6. Teknik Geliştirme Öncelikleri (Sprint 3)

### Öncelik Sırası

```
P0 — Kritik (Hafta 1):
  1. CRM Kanban sayfası (/panel/crm)
     → entity: leads + lead_activities
     → UI: @dnd-kit/core Kanban board
     → Atlas AI lead-ilan eşleştirme

  2. İlan Kartı Yeniden Tasarımı (/panel/ilanlar)
     → Funnel metriği ekleme
     → Atlas AI optimize butonu
     → MLS toggle
     → İşlemler dropdown genişletme
     → "Güncelle" baskısını kaldır

  3. Dashboard Yeniden Tasarımı (/panel)
     → WhatsApp tıklama metriği
     → AI öneri kartları
     → CRM özet widget

P1 — Önemli (Hafta 2):
  4. AI İçerik Fabrikası (/panel/icerik)
     → SCRIBE ajanı: sosyal medya paketi
     → YT-DIRECTOR: YouTube script
     → Blog editörü (react-quill)

  5. MLS Sayfaları (/panel/mls)
     → Havuz görünümü
     → İşbirliği talep/kabul akışı

P2 — Değer Katan (Hafta 3-4):
  6. PDF Broşür (/panel/pdf-brosur)
     → Puppeteer servis
     → Branded şablon

  7. Analitik Derinleştirme (/panel/analitik)
     → Funnel analizi
     → Trafik kaynağı
     → Rekabetçi benchmark

  8. Takvim (/panel/takvim)
     → Randevu yönetimi
     → CRM entegrasyonu
```

---

## 7. UX Prensipleri — Sahibinden Tuzaklarından Kaçınma

```
✅ "Güncelle" angaryası yok
   İlan kalitesi algoritmik — iyi içerik görünür kalır
   Acenta günde bir kez zorla giriş yapmak zorunda değil

✅ Upsell değil, değer göster
   "50 ilanın 23'ünü kullandın" → endişe
   "Bu ay AI 12 post üretti, değeri ~2.400 TL" → memnuniyet

✅ Boş widget yok
   Sahibinden: "Talebi Olan Müşteri: 0" (boş, işe yaramaz)
   7fil: Boş CRM varsa → Atlas AI onboarding rehberi başlar
   "WhatsApp linkini alıcılara gönderin, leadler buraya düşsün"

✅ Her aksiyon tek tıkla
   PDF broşür → ilan kartından → 1 tık
   Sosyal medya paylaş → ilan kartından → 1 tık
   MLS aç → ilan kartından → 1 tık
   Sahibinden'de bunlar ya yok ya 5 tık uzaklıkta

✅ AI öneriler = akıllı, değer katan
   Sahibinden: "Doping Yap" (para ver)
   7fil: "Atlas AI analiz yaptı: Bu ilan şunları düzeltirse %30 daha iyi performans"
   Para harcamadan önce organik iyileştirme

✅ Dark mode opsiyonu
   Sahibinden: beyaz/sarı — göz yorucu
   7fil: --ink/#1a1a2e sidebar, --cream içerik alanı
   Profesyonel, göz dostu, marka uyumlu
```

---

*Connective Hub Dijital Teknolojiler Ltd. Şti. — 7fil.com.tr*
*Panel Design v1.0 — Haziran 2026*
*"Sahibinden Ofisim'in yaptığı her şeyi daha iyi, yapmadığı her şeyi de yapıyoruz."*
