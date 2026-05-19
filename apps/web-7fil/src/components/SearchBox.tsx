'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep']

export function SearchBox() {
  const router = useRouter()
  const [listingType, setListingType] = useState<'sale' | 'rent'>('sale')
  const [city, setCity] = useState('')
  const [q, setQ] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams({ listingType })
    if (city) params.set('city', city)
    if (q) params.set('q', q)
    router.push(`/ara?${params}`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-2 sm:p-3 max-w-3xl mx-auto">
      {/* Satılık / Kiralık toggle */}
      <div className="flex gap-1 p-1 bg-cream rounded-xl mb-3">
        {(['sale', 'rent'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setListingType(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              listingType === t
                ? 'bg-white text-ink shadow-sm'
                : 'text-muted hover:text-ink'
            }`}
          >
            {t === 'sale' ? 'Satılık' : 'Kiralık'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        {/* Şehir */}
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="input-base sm:w-44 flex-shrink-0 bg-white cursor-pointer"
        >
          <option value="">Tüm Şehirler</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Serbest arama */}
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="İlçe, mahalle veya anahtar kelime..."
          className="input-base flex-1"
        />

        <button type="submit" className="btn-primary flex-shrink-0 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Ara
        </button>
      </form>
    </div>
  )
}
