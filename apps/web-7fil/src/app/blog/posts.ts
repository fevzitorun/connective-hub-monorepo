export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  readMinutes: number
  publishedAt: string
  keywords: string[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'gayrimenkulde-yapay-zeka-donemi',
    title: 'Gayrimenkulde Yapay Zeka Dönemi: FILTERRA.AI ile Evinizin Değerini 30 Saniyede Öğrenin',
    excerpt: "Türkiye'de ilk kez 850.000+ satış kaydı üzerinde eğitilen FILTERRA.AI, m², oda sayısı ve bina yaşına göre gerçek piyasa değerini saniyeler içinde hesaplıyor.",
    category: 'Teknoloji',
    readMinutes: 5,
    publishedAt: '2026-06-29',
    keywords: ['gayrimenkulde yapay zeka', 'emlak değerleme ai', 'ev değeri hesaplama', 'filterra ai'],
    content: `## Yapay Zeka Emlak Sektörünü Nasıl Dönüştürüyor?

Türkiye'de her yıl 1,5 milyonu aşkın konut el değiştiriyor. Bu işlemlerin büyük çoğunluğunda alıcı ve satıcı, gerçek piyasa değerini bilmeden müzakere masasına oturuyor. Sonuç? Aşırı ödemeler, fırsatçılık ve güven kaybı.

FILTERRA.AI bu denklemi kökten değiştiriyor. 7fil.com.tr'nin özel AI değerleme motoru, Türkiye genelindeki **850.000'den fazla gerçek satış kaydı** üzerinde eğitildi. Sisteme m², oda sayısı, bina yaşı ve şehir bilgisini girdiğinizde, 30 saniye içinde piyasa değeri tahminini %94 doğruluk payıyla alabiliyorsunuz.

## FILTERRA.AI Nasıl Çalışır?

Geleneksel değerleme yöntemleri, eksper ziyaretlerini ve günlerce süren raporları gerektiriyor. FILTERRA.AI ise dört temel parametreyle anlık sonuç veriyor:

**1. Lokasyon Analizi:** Şehir ve ilçe bazında güncel satış fiyatlarını, altyapı puanlarını ve ulaşım verilerini birleştiriyor.

**2. Mülk Karakteristikleri:** Brüt alan, oda tipi (stüdyo'dan 5+'a kadar) ve bina yaşı, fiyatı doğrudan etkileyen değişkenler.

**3. Piyasa Trendleri:** Son 6 aylık fiyat değişimleri ve şehir bazlı talep endeksi modelin içine gömülü.

**4. Güven Aralığı:** Her tahmin için alt-üst sınır belirleniyor. "14.500.000 ₺ ± 12%" gibi şeffaf bir aralık sunuluyor.

## Pratik Kullanım Örneği

İstanbul Kadıköy'de 120 m², 3+1, 8 yaşında bir daire için FILTERRA.AI şunları döndürüyor:

- **Tahmin:** 16.200.000 – 20.900.000 ₺
- **Ortalama:** 18.550.000 ₺
- **m² birim fiyatı:** 154.583 ₺/m²
- **6 aylık trend:** ▲ +11.2%

Bu bilgilerle satıcı gerçekçi bir fiyat belirliyor, alıcı ise pazarlık için sağlam bir referans noktasına sahip oluyor.

## Geleneksel Yöntemlerle Karşılaştırma

| Yöntem | Süre | Maliyet | Doğruluk |
|--------|------|---------|----------|
| Eksper Raporu | 3-7 gün | 2.000-8.000 ₺ | %85-90 |
| Banka SPK Değerleme | 1-3 gün | 1.500-5.000 ₺ | %88-92 |
| FILTERRA.AI | 30 saniye | Ücretsiz | %94 |

## PDF Raporu ile Tam Analiz

Demo sonucunda "PDF Raporu İste" seçeneğiyle mahalle karşılaştırması, benzer satışlar ve gelecek 12 ay için fiyat projeksiyonu içeren detaylı raporu e-postanıza gönderiyoruz. Bu rapor, mortgage başvurunuzda veya satış teklifinizde somut bir referans belgesi olarak kullanılabilir.

7fil.com.tr ana sayfasındaki FILTERRA.AI demo bölümünden hemen deneyin — kayıt gerektirmez.`,
  },

  {
    slug: 'istanbul-ev-almak-2026-rehberi',
    title: 'İstanbul\'da Ev Almak 2026: İlçe İlçe Fiyat Analizi ve Mahalle Seçim Rehberi',
    excerpt: "2026 yılında İstanbul'da konut fiyatları hangi ilçelerde yükseliyor? Avrupa ve Anadolu yakasının en değerli mahalleleri, yatırım potansiyeli ve dikkat edilmesi gerekenler.",
    category: 'Piyasa Analizi',
    readMinutes: 7,
    publishedAt: '2026-06-25',
    keywords: ['istanbul ev almak', 'istanbul konut fiyatları 2026', 'istanbul emlak', 'istanbul ilçe fiyatları'],
    content: `## İstanbul Konut Piyasası 2026 Genel Görünümü

İstanbul'da 2026 yılının ilk yarısında konut fiyatları, önceki yıla kıyasla ortalama %18 artış gösterdi. Bu yükselişin arkasında artan yapı maliyetleri, göç baskısı ve sınırlı arzın yanı sıra yabancı yatırımcı talebi de yer alıyor. Peki hangi ilçeler öne çıkıyor?

## Avrupa Yakası: Yükselen Yıldızlar

**Beşiktaş ve Nişantaşı:** İstanbul'un en pahalı konutlarının bulunduğu bu bölgede ortalama m² fiyatı 180.000-220.000 ₺ arasında seyrediyor. Yabancı uyruklu alıcıların en fazla tercih ettiği bölge.

**Bakırköy ve Florya:** Deniz kenarı konumu ve gelişmiş ulaşım altyapısıyla m² başına 95.000-130.000 ₺ band'ında. Aile yaşamı için ideal.

**Esenyurt ve Beylikdüzü:** Uygun fiyatlı seçenek arayanların yöneldiği bu ilçelerde m² 35.000-55.000 ₺. Kiralık getiri oranları %4-5 ile dikkat çekiyor.

**Kağıthane:** Metro hattının uzanmasıyla son iki yılda %34 değer kazandı. Ofis dönüşümü projeleriyle birlikte yaşanabilir bir ilçeye dönüşüyor. Ortalama: 75.000-90.000 ₺/m².

## Anadolu Yakası: Sakin Büyüme

**Kadıköy:** İstanbul'un en dinamik ilçesi; kafe kültürü, müze ve sanatçı stüdyolarıyla cazip. m² başına 140.000-175.000 ₺. Son 6 ayda %11 artış.

**Ümraniye:** İş merkezlerine yakınlığı ve uygun fiyatıyla yatırımcıların radarında. 50.000-70.000 ₺/m². Marmara Üniversitesi etkisiyle kiralık talep yüksek.

**Maltepe ve Kartal:** İstanbul'un "yeni cazibe merkezi" olarak konumlandırılan bu iki ilçe, sahil projelerinin etkisiyle hızla değerleniyor. 65.000-85.000 ₺/m².

**Pendik:** Sabiha Gökçen yakınlığı ve Marmaray bağlantısıyla ulaşım avantajı sunuyor. 45.000-65.000 ₺/m² ile yatırım için dikkate değer.

## Yatırım mı, İkamet mi?

Bu soruya verilecek cevap, bütçe ve hedeflerinize göre değişiyor:

**Kira getirisi önceliği:** Ümraniye, Esenyurt, Beylikdüzü — %4.5-5.5 brüt getiri
**Değer artışı önceliği:** Kağıthane, Kartal, Maltepe — son 2 yılda %25-40 artış
**Prestij ve merkez:** Beşiktaş, Kadıköy, Şişli — uzun vadeli değer koruması
**Uygun fiyat:** Sultangazi, Esenler, Arnavutköy — deprem riski araştırması şart

## Mahalle Seçiminde Kritik Kontrol Listesi

İstanbul'da ev alırken şu sorulara yanıt alın:

1. **DASK ve deprem riski:** İlçenin zemin etüd raporunu mutlaka inceleyin.
2. **İmar durumu:** Tapu sicilinde kısıt var mı? 7fil Hukuki Sertifikası ile kontrol edin.
3. **Okul puanları:** 7fil ATLAS AI ile mahalle okul skoru sorgulayabilirsiniz.
4. **Toplu taşıma:** Metro/metrobüs mesafesi kira getirisini doğrudan etkiliyor.
5. **Sosyal tesisler:** Park, hastane, AVM yakınlığı fiyatı %8-15 yukarı çekiyor.

7fil.com.tr'nin mahalle analizi sayfasında tüm bu bilgileri tek ekranda görüntüleyebilirsiniz.`,
  },

  {
    slug: 'mortgage-hesaplama-banka-karsilastirma',
    title: 'Mortgage Hesaplama 2026: 20 Bankayı Karşılaştırın, En Düşük Faizi Bulun',
    excerpt: "Konut kredisi faizleri Haziran 2026'da nasıl seyrediliyor? Hangi bankalar en avantajlı teklifleri sunuyor? 7fil Mortgage Karşılaştırıcısı ile dakikalar içinde en iyi faiz oranını keşfedin.",
    category: 'Finans',
    readMinutes: 6,
    publishedAt: '2026-06-20',
    keywords: ['mortgage hesaplama', 'konut kredisi 2026', 'ev kredisi faiz oranları', 'banka mortgage karşılaştırma'],
    content: `## 2026 Konut Kredisi Faiz Ortamı

Merkez Bankası'nın 2025 sonunda başlattığı faiz indirimi süreciyle birlikte konut kredisi faizleri kademeli olarak geriledi. Haziran 2026 itibarıyla kamu bankaları **%2.89-3.25** arasında, özel bankalar **%3.10-3.70** arasında, katılım bankaları ise **%3.20-3.85** kâr payı oranlarıyla konut finansmanı sunuyor.

## Mortgage Hesaplama: Temel Kavramlar

Konut kredisi başvurusu yapmadan önce şu kavramları netleştirin:

**LTV (Loan-to-Value):** Banka, genellikle mülk değerinin %70-80'ine kadar kredi veriyor. 5 milyon TL değerinde bir konut için maksimum 4 milyon TL kredi alabileceğiniz anlamına gelir.

**Vade:** 1-10 yıl arası vade sunuluyor. Vade uzadıkça aylık taksit düşer, toplam faiz yükü artar.

**DSCR (Borç Servis Karşılama Oranı):** Net gelirinizin %50'si oranında aylık taksit ödeyebilirsiniz. 50.000 ₺ net maaş için maksimum 25.000 ₺/ay taksit.

## Örnek Hesaplama: 3 Milyon TL Konut Kredisi

| Banka Tipi | Faiz | Vade | Aylık Taksit | Toplam Ödeme |
|------------|------|------|------------|------------|
| Kamu Bankası | %2.89 | 120 ay | 38.200 ₺ | 4.584.000 ₺ |
| Özel Banka | %3.25 | 120 ay | 40.100 ₺ | 4.812.000 ₺ |
| Katılım Bankası | %3.50 | 120 ay | 41.500 ₺ | 4.980.000 ₺ |

Sadece faiz oranındaki **0.36 puanlık fark**, 10 yılda 228.000 ₺ fark yaratıyor. Bu yüzden karşılaştırma kritik.

## Hangi Banka Türü Size Uygun?

**Kamu Bankası (Ziraat, Halkbank, Vakıfbank):** Genellikle en düşük faiz, ancak belgeler daha kapsamlı. Onay süreci 5-10 iş günü.

**Özel Banka (Garanti, İş Bankası, Yapı Kredi vb.):** Daha hızlı onay (2-5 gün), dijital süreç. Faiz biraz daha yüksek ama esneklik fazla.

**Katılım Bankası (Ziraat Katılım, Kuveyt Türk vb.):** Faizsiz bankacılık prensibiyle çalışır, "kâr payı" adıyla işlem yapar. Bazı satın alımlar için vergi avantajı sunabilir.

**Yabancı Banka (HSBC, Denizbank vb.):** Dövize endeksli fırsatlar ve özel müşteri avantajları. EUR veya USD cinsinden geliri olanlar için değerlendirilebilir.

## 7fil Mortgage Karşılaştırıcısı Nasıl Çalışır?

7fil.com.tr'nin Finans modülüne giriş yapıp şu bilgileri girmeniz yeterli:

1. Kredi tutarı
2. Vade tercihi
3. Mülk değeri
4. Gelir bilgisi

Sistem, **20'den fazla bankadan anlık teklifleri** çekerek size sıralı bir karşılaştırma sunar. Ayrıca "Maksimum Kredi" hesaplaması ile ne kadar borçlanabileceğinizi de görebilirsiniz.

## Mortgage Başvurusunda Sık Yapılan Hatalar

1. **Sadece faize bakmak:** KKDF, BSMV ve dosya masrafları toplam maliyeti %0.3-0.8 artırabilir.
2. **Ön ödemenin ihmal edilmesi:** Peşinat arttıkça hem faiz hem taksit düşer.
3. **Tek bankaya başvurmak:** Birden fazla bankaya başvurmak kredi notunu olumsuz etkilemez, doğru bilgi.
4. **Sigorta masraflarını unutmak:** DASK zorunlu, konut sigortası ise bankaya göre değişiyor.`,
  },

  {
    slug: 'tapu-hatalari-hukuki-riskler',
    title: 'Tapu Hataları ve Hukuki Riskler: Ev Alırken Avukat Onaylı Sertifika Neden Şart?',
    excerpt: "Türkiye'de her 5 konut işleminden 1'inde hukuki sorun tespit ediliyor. İpotek kısıtı, imar yasağı, kat mülkiyeti eksikliği — bunları öğrenmeden sözleşme imzalamayın.",
    category: 'Hukuk',
    readMinutes: 8,
    publishedAt: '2026-06-15',
    keywords: ['tapu işlemleri', 'gayrimenkul hukuk', 'tapu hataları', 'konut alım hukuki kontrol', 'ipotek sorgulama'],
    content: `## Konut Alımında Hukuki Riskler Beklenenden Fazla

Türkiye'de gerçekleştirilen konut alım işlemlerinin %18-22'sinde sonradan hukuki bir sorun ortaya çıkıyor. Bu sorunların büyük çoğunluğu alım öncesi yapılacak basit bir kontrol ile önlenebilir. Ancak alıcılar çoğunlukla tapu senedinin "temiz" göründüğü varsayımıyla ilerliyor.

## En Sık Karşılaşılan Hukuki Sorunlar

**1. İpotek ve Haciz Kaydı**
Satıcının kredi borcu veya vergi borcundan kaynaklanan ipotek veya haciz, tapu kütüğünde kayıtlı olup alıcıya devredilir. Alım sonrası bu borçların sizden talep edilmesi yasal.

Kontrol yöntemi: Tapu Sicil Müdürlüğü veya 7fil Hukuki Sertifikası ile online sorgulama.

**2. Kat Mülkiyeti ve İskan Eksikliği**
Projeye ait yapı ruhsatı veya iskan belgesi yoksa banka mortgage vermez, elektrik-su aboneliği açılamaz. Türkiye'de 7,5 milyona yakın "kaçak" veya "ruhsatsız" konut bulunuyor.

**3. İmar Kısıtı ve Plan Değişikliği**
Parselin imar planında yeşil alan, yol güzergahı veya kamu kullanımına ayrıldığı durumlar mülkün değersizleşmesine yol açar. Bu bilgi tapu senedinde görünmez; imar durumu belgesi gerektirir.

**4. Kat İrtifakı / Kat Mülkiyeti Karmaşası**
Kat irtifaklı mülkler henüz inşaat aşamasındaki projeleri ifade eder ve bazı haklar kısıtlıdır. Kat mülkiyetine geçiş tamamlanmamışsa sigorta ve kredi prosedürleri güçleşir.

**5. Miras ve Ortak Mülkiyet Anlaşmazlıkları**
Satıcının birden fazla mirasçısı varsa, tüm mirasçıların onayı alınmadan yapılan satış iptalle karşılaşabilir. Tapu kütüğünde "hisseli" ibaresi bu riski işaret eder.

**6. Şerh ve Beyanlar**
Tapu kütüğüne işlenmiş ön alım hakkı (şuf'a), kira ve intifa hakkı gibi şerhler mülkü bağlar. Kiracının oturduğu bir konut satın aldığınızda, kiracıyı Borçlar Kanunu hükümleri çerçevesinde çıkarmak aylar sürebilir.

## 7fil Avukat Onaylı Hukuki Sertifika

7fil.com.tr'nin Hukuki Doğrulama modülü, Türkiye Barolar Birliği'ne kayıtlı ortaklık büroları aracılığıyla kapsamlı bir ön kontrol yapıyor:

**Tapu Sicil Kontrolü:** İpotek, haciz, şerh ve beyan taraması

**İmar Durumu:** Parsel bazında yapılaşma şartları ve kısıtlar

**Vergi Borcu Sorgulaması:** Satıcının birikmiş emlak vergisi kontrolü

**Yapı Ruhsatı ve İskan:** Binanın yasal statüsü ve uygunluğu

**Enerji Kimlik Belgesi:** A-G skalasında enerji performansı

Rapor 24-48 saat içinde teslim ediliyor, e-imzalı PDF formatında geçerliliği var.

## Sözleşme Öncesi Minimum Kontrol Listesi

Herhangi bir ön ödeme veya kapora vermeden önce şunları talep edin:

- [ ] Tapu fotokopisi (varsa kooperatif senedi)
- [ ] Yapı ruhsatı ve iskan belgesi
- [ ] Enerji kimlik belgesi (enerji sertifikası)
- [ ] Binanın son 5 yıllık aidat ödeme geçmişi
- [ ] İmar durum belgesi (belediyeden)
- [ ] Satıcının kimlik belgesi + tapu üzerindeki isimle eşleşme

7fil Hukuki Sertifikası bu belgelerin tamamını tek seferde analiz ederek avukat onaylı raporla sunuyor. Böylece hem zaman kazanıyor hem de hukuki güvence altına giriyorsunuz.`,
  },

  {
    slug: 'mls-sistemi-turkiye-acenta-agi',
    title: 'MLS Sistemi Nedir? Türkiye\'de Acenta Ağlarının Geleceği ve 7fil MLS Modeli',
    excerpt: "ABD ve Avrupa'da onlarca yıldır kullanılan MLS (Multiple Listing Service) sistemi Türkiye'ye geliyor. Acentaların portföy paylaşarak birlikte kazanacağı bu modeli anlayın.",
    category: 'Sektör',
    readMinutes: 6,
    publishedAt: '2026-06-10',
    keywords: ['MLS sistemi', 'multiple listing service türkiye', 'emlak acenta paylaşım sistemi', '7fil mls'],
    content: `## MLS Nedir?

MLS (Multiple Listing Service — Çoklu İlan Servisi), birden fazla gayrimenkul acentasının ortak bir veritabanında ilanlarını paylaşarak birlikte çalıştığı ve komisyonu paylaştığı kooperatif bir sistemdir. ABD'de 800'den fazla yerel MLS platformu var ve bu ağlar ülke genelinde yıllık 5 trilyon dolarlık işlem hacmi yaratıyor.

## Türkiye'deki Mevcut Sorun

Türk emlak sektörü parçalı bir yapıya sahip. Aynı mülk onlarca acentede listeleniyor, çoğu zaman farklı fiyatlarla. Alıcı hangi bilgiye güveneceğini bilemiyor. Acenteler birbirleriyle rekabet etmek yerine işbirliği yapabilseydi, tüm ekosistem daha verimli çalışırdı.

Bugün Türkiye'de **180.000'den fazla** lisanslı emlak danışmanı faaliyet gösteriyor. Ancak birlikte çalışmalarını sağlayan kurumsal bir altyapı yok.

## 7fil MLS Modeli Nasıl Çalışır?

7fil, Türkiye'nin ilk gerçek MLS altyapısını hayata geçirdi. Temel ilkeler şunlar:

**1. Ortak Portföy Havuzu**
Onaylı acenteler ilanlarını MLS havuzuna ekliyor. Diğer acenteler bu ilanları görebiliyor ve müşterileri adına işlem başlatabiliyorlar.

**2. Komisyon Bölüşümü**
Listeleyen acente (Listing Agent) ve satan acente (Buyer's Agent) komisyonu önceden belirlenen oranda paylaşıyor. Türkiye standartlarında bu genellikle %50-50 veya %60-40.

**3. Münhasırlık ve Şeffaflık**
Her mülk tek bir acente tarafından listelenir. Böylece fiyat karışıklığı önlenir, alıcıya doğru bilgi ulaşır.

**4. Veri Güvenliği**
MLS'e sadece kimliği doğrulanmış, ruhsatlı acenteler girebilir. Sahte ilan ve fırsatçılık önlenir.

## Acenta Açısından MLS'in Avantajları

**Portföy genişlemesi:** Kendi portföyünüzdeki 20 ilanın yanı sıra havuzdaki 5.000+ ilana erişim.

**Hız:** Müşterinize uygun evi bulmak için onlarca ajans kapısı çalmak yerine tek ekranda filtreleme.

**Gelir artışı:** Hem alıcı hem satıcı tarafında komisyon kazanma imkanı.

**Rekabet değil işbirliği:** Rakip yerine iş ortağı zihniyeti. Büyük işlemlerde güçleri birleştirme.

## Alıcı Açısından MLS'in Avantajları

Alıcılar için MLS, tek bir danışmanla tüm piyasaya erişim demek. Danışmanınız hangi ajansa bağlı olursa olsun, MLS üzerinden tüm listeli mülklere bakabilir ve sizin adınıza teklif verebilir.

## 7fil MLS'e Nasıl Katılabilirsiniz?

7fil MLS ağına dahil olmak için:

1. **7fil Acenta Üyeliği:** Lisanslı gayrimenkul danışmanı olduğunuzu belgeleyin.
2. **Onay Süreci:** 48 saat içinde hesabınız doğrulanır.
3. **İlan Yükleyin:** İlk ilanınızı MLS havuzuna ekleyin.
4. **Komisyon Oranı Belirleyin:** Buyer's Agent için ne kadar teklif ettiğinizi belirtin.

Eylül 2026 lansmanında ilk 500 acenteye özel kurucu üye koşulları sunulacak. Şimdiden listeye kaydolun.`,
  },
]

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}
