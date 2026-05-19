import Link from 'next/link'

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana']

export function Footer() {
  return (
    <footer className="bg-ink text-white/70 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-2xl font-bold text-white">
              7<span className="text-gold">fil</span>
            </span>
            <p className="mt-3 text-sm leading-relaxed">
              Türkiye&apos;nin entegre gayrimenkul ekosistemi.
              AI destekli değerleme, hukuki doğrulama ve finansman çözümleri.
            </p>
            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 text-xs bg-teal/20 text-teal px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                FILTERRA.AI — Aktif
              </span>
            </div>
          </div>

          {/* Şehirler */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Popüler Şehirler</h3>
            <ul className="space-y-2 text-sm">
              {CITIES.map((city) => (
                <li key={city}>
                  <Link
                    href={`/ara?city=${city}`}
                    className="hover:text-gold transition-colors"
                  >
                    {city} İlanları
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Kurumsal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/hakkimizda" className="hover:text-gold transition-colors">Hakkımızda</Link></li>
              <li><Link href="/basin" className="hover:text-gold transition-colors">Basın</Link></li>
              <li><Link href="/kariyer" className="hover:text-gold transition-colors">Kariyer</Link></li>
              <li><Link href="/iletisim" className="hover:text-gold transition-colors">İletişim</Link></li>
            </ul>
          </div>

          {/* Yardım */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Yardım</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/nasil-calisir" className="hover:text-gold transition-colors">Nasıl Çalışır?</Link></li>
              <li><Link href="/emlakci-ol" className="hover:text-gold transition-colors">Emlakçı Ol</Link></li>
              <li><Link href="/gizlilik" className="hover:text-gold transition-colors">Gizlilik Politikası</Link></li>
              <li><Link href="/kullanim-kosullari" className="hover:text-gold transition-colors">Kullanım Koşulları</Link></li>
              <li><Link href="/kvkk" className="hover:text-gold transition-colors">KVKK Aydınlatma</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Connective Hub Dijital Teknolojiler Ltd. Şti. Tüm hakları saklıdır.</p>
          <p>7fil.com.tr · FILTERRA.AI</p>
        </div>
      </div>
    </footer>
  )
}
