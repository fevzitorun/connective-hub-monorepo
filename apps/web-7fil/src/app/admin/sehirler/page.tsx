'use client'
import { useState } from 'react'

const PILOT_CITIES = [
  { name: 'İstanbul',   target: 25, enrolled: 0,  coordinator: '', active: true,  region: 'Marmara'    },
  { name: 'Ankara',     target: 15, enrolled: 0,  coordinator: '', active: true,  region: 'İç Anadolu' },
  { name: 'İzmir',      target: 10, enrolled: 0,  coordinator: '', active: true,  region: 'Ege'        },
  { name: 'Antalya',    target: 10, enrolled: 0,  coordinator: '', active: true,  region: 'Akdeniz'    },
  { name: 'Bursa',      target: 10, enrolled: 0,  coordinator: '', active: true,  region: 'Marmara'    },
  { name: 'Gaziantep',  target: 8,  enrolled: 0,  coordinator: '', active: false, region: 'Güneydoğu'  },
  { name: 'Kocaeli',    target: 7,  enrolled: 0,  coordinator: '', active: false, region: 'Marmara'    },
  { name: 'Trabzon',    target: 5,  enrolled: 0,  coordinator: '', active: false, region: 'Karadeniz'  },
  { name: 'Mersin',     target: 5,  enrolled: 0,  coordinator: '', active: false, region: 'Akdeniz'    },
  { name: 'Eskişehir',  target: 5,  enrolled: 0,  coordinator: '', active: false, region: 'İç Anadolu' },
]

export default function SehirlerPage() {
  const [cities, setCities] = useState(PILOT_CITIES)
  const totalTarget   = cities.reduce((s, c) => s + c.target, 0)
  const totalEnrolled = cities.reduce((s, c) => s + c.enrolled, 0)

  return (
    <div className="p-8">
      {/* Başlık */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-ink">Şehirler & Pilot Program</h1>
        <p className="text-ink/60 mt-1">10 şehir · 100 acenta hedefi · Sprint 3 (Haziran 2026)</p>
      </div>

      {/* Özet kartlar */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Toplam Şehir',    value: '10',           sub: 'Pilot program' },
          { label: 'Acenta Hedefi',   value: totalTarget,    sub: 'Toplam hedef' },
          { label: 'Kayıtlı Acenta',  value: totalEnrolled,  sub: 'Şu an aktif' },
          { label: 'Doluluk',
            value: totalTarget > 0 ? `%${Math.round(totalEnrolled / totalTarget * 100)}` : '%0',
            sub: 'Hedefe ulaşma oranı' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <p className="text-sm text-ink/50">{card.label}</p>
            <p className="text-3xl font-bold text-ink mt-1">{card.value}</p>
            <p className="text-xs text-ink/40 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Şehir tablosu */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-semibold text-ink">Pilot Şehirler</h2>
          <button className="text-sm bg-gold text-ink font-semibold px-4 py-2 rounded-lg hover:bg-gold/80 transition-colors">
            + Şehir Ekle
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-stone-50">
            <tr>
              {['Şehir', 'Bölge', 'Hedef', 'Kayıtlı', 'Doluluk', 'Koordinatör', 'Durum', 'İşlem'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-ink/50 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {cities.map((city, i) => {
              const pct = city.target > 0 ? Math.round(city.enrolled / city.target * 100) : 0
              return (
                <tr key={city.name} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-ink">{city.name}</td>
                  <td className="px-4 py-3 text-ink/60">{city.region}</td>
                  <td className="px-4 py-3 text-ink/80">{city.target}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{city.enrolled}</td>
                  <td className="px-4 py-3 w-36">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-stone-200 rounded-full h-1.5">
                        <div
                          className="bg-gold h-1.5 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-ink/50 w-8">{pct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink/50">{city.coordinator || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      city.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-stone-100 text-stone-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${city.active ? 'bg-green-500' : 'bg-stone-400'}`} />
                      {city.active ? 'Aktif' : 'Beklemede'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-gold hover:underline font-medium">Düzenle</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Landing page durumu */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
        <h2 className="font-semibold text-ink mb-4">Landing Page Durumu</h2>
        <div className="grid grid-cols-5 gap-3">
          {cities.map((city) => (
            <div key={city.name} className="border border-stone-200 rounded-xl p-4 text-center">
              <p className="font-semibold text-ink text-sm">{city.name}</p>
              <p className="text-xs text-ink/40 mt-1">7fil.com.tr/{city.name.toLowerCase().replace('İ','i').replace('ı','i').replace('ö','o').replace('ü','u').replace('ş','s').replace('ç','c').replace('ğ','g')}</p>
              <span className="mt-2 inline-block text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                Yapılacak
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
