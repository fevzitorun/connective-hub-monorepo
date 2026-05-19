'use client'
import { useSearchStore } from '../store/search'

const ROOM_OPTIONS = ['1+1', '2+1', '3+1', '4+1', '5+']

export function FilterPanel() {
  const { params, setParams } = useSearchStore()

  return (
    <aside className="bg-white rounded-xl border border-border p-5 space-y-6 sticky top-20">
      <h2 className="font-semibold text-ink text-sm">Filtreler</h2>

      {/* İlan tipi */}
      <div>
        <label className="block text-xs font-medium text-muted mb-2">İlan Tipi</label>
        <div className="flex gap-2">
          {(['sale', 'rent'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setParams({ listingType: params.listingType === t ? undefined : t })}
              className={`flex-1 text-sm py-2 rounded-lg border transition-colors ${
                params.listingType === t
                  ? 'border-gold bg-gold/10 text-gold font-medium'
                  : 'border-border text-muted hover:border-gold/50'
              }`}
            >
              {t === 'sale' ? 'Satılık' : 'Kiralık'}
            </button>
          ))}
        </div>
      </div>

      {/* Mülk tipi */}
      <div>
        <label className="block text-xs font-medium text-muted mb-2">Mülk Tipi</label>
        <select
          value={params.propertyType ?? ''}
          onChange={(e) => setParams({ propertyType: e.target.value || undefined })}
          className="input-base text-sm"
        >
          <option value="">Tümü</option>
          <option value="residential">Konut</option>
          <option value="commercial">İş Yeri</option>
          <option value="land">Arsa / Tarla</option>
          <option value="industrial">Endüstriyel</option>
        </select>
      </div>

      {/* Oda sayısı */}
      <div>
        <label className="block text-xs font-medium text-muted mb-2">Oda Sayısı</label>
        <div className="flex flex-wrap gap-2">
          {ROOM_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => setParams({ roomCount: params.roomCount === r ? undefined : r })}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                params.roomCount === r
                  ? 'border-teal bg-teal/10 text-teal font-medium'
                  : 'border-border text-muted hover:border-teal/50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Fiyat aralığı */}
      <div>
        <label className="block text-xs font-medium text-muted mb-2">Fiyat Aralığı (₺)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={params.priceMin ?? ''}
            onChange={(e) => setParams({ priceMin: e.target.value ? Number(e.target.value) : undefined })}
            className="input-base text-sm w-1/2"
          />
          <input
            type="number"
            placeholder="Max"
            value={params.priceMax ?? ''}
            onChange={(e) => setParams({ priceMax: e.target.value ? Number(e.target.value) : undefined })}
            className="input-base text-sm w-1/2"
          />
        </div>
      </div>

      {/* Alan */}
      <div>
        <label className="block text-xs font-medium text-muted mb-2">Alan (m²)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={params.areaMin ?? ''}
            onChange={(e) => setParams({ areaMin: e.target.value ? Number(e.target.value) : undefined })}
            className="input-base text-sm w-1/2"
          />
          <input
            type="number"
            placeholder="Max"
            value={params.areaMax ?? ''}
            onChange={(e) => setParams({ areaMax: e.target.value ? Number(e.target.value) : undefined })}
            className="input-base text-sm w-1/2"
          />
        </div>
      </div>

      {/* Özellikler */}
      <div>
        <label className="block text-xs font-medium text-muted mb-2">Özellikler</label>
        <div className="space-y-2">
          {[
            { key: 'hasParking', label: 'Otopark' },
            { key: 'hasElevator', label: 'Asansör' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!(params as Record<string, unknown>)[key]}
                onChange={(e) => setParams({ [key]: e.target.checked || undefined } as Partial<typeof params>)}
                className="w-4 h-4 rounded border-border text-teal focus:ring-teal/50"
              />
              <span className="text-sm text-ink">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}
