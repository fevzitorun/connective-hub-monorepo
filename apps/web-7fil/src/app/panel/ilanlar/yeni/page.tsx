'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../../../store/auth'

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Mersin', 'Diyarbakır']
const ROOM_OPTIONS = ['Stüdyo', '1+1', '2+1', '3+1', '4+1', '5+']

interface FormData {
  title: string
  description: string
  price: number
  currency: string
  propertyType: string
  listingType: string
  category: string
  city: string
  district: string
  neighborhood: string
  areaM2: number
  roomCount: string
  floorNo: number
  totalFloors: number
  buildingAge: number
  hasParking: boolean
  hasElevator: boolean
  hasBalcony: boolean
  isFurnished: boolean
  agentPhone: string
  lat: number
  lng: number
}

export default function NewListingPage() {
  const router = useRouter()
  const { accessToken } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [csvMode, setCsvMode] = useState(false)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvLoading, setCsvLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: { currency: 'TRY', listingType: 'sale', propertyType: 'residential' }
  })

  const propertyType = watch('propertyType')

  async function onSubmit(data: FormData) {
    if (!accessToken) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'}/listings`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({
            ...data,
            price: Number(data.price),
            areaM2: data.areaM2 ? Number(data.areaM2) : undefined,
            floorNo: data.floorNo ? Number(data.floorNo) : undefined,
            totalFloors: data.totalFloors ? Number(data.totalFloors) : undefined,
            buildingAge: data.buildingAge ? Number(data.buildingAge) : undefined,
            lat: data.lat ? Number(data.lat) : undefined,
            lng: data.lng ? Number(data.lng) : undefined,
          }),
        }
      )
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? 'İlan oluşturulamadı')
      router.push(`/panel/ilanlar`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  async function handleCsvImport() {
    if (!accessToken || !csvFile) return
    setCsvLoading(true)
    setError(null)
    try {
      const buffer = await csvFile.arrayBuffer()
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'}/listings/csv/import`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ file: base64 }),
        }
      )
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? 'CSV yüklenemedi')
      router.push('/panel/ilanlar')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'CSV hatası')
    } finally {
      setCsvLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Yeni İlan</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setCsvMode(false)}
            className={`text-sm px-4 py-2 rounded-lg border transition-colors ${!csvMode ? 'border-gold bg-gold/10 text-gold' : 'border-border text-muted'}`}
          >
            Tek İlan
          </button>
          <button
            onClick={() => setCsvMode(true)}
            className={`text-sm px-4 py-2 rounded-lg border transition-colors ${csvMode ? 'border-gold bg-gold/10 text-gold' : 'border-border text-muted'}`}
          >
            CSV Toplu
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>
      )}

      {csvMode ? (
        /* CSV import modu */
        <div className="card p-8 text-center">
          <svg className="w-12 h-12 mx-auto text-muted/40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-ink font-semibold mb-2">CSV ile Toplu İlan Yükle</p>
          <p className="text-sm text-muted mb-4">Maks 500 satır. Excel uyumlu UTF-8 BOM formatında.</p>
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'}/listings/csv/template`}
            download
            className="text-sm text-teal hover:text-gold transition-colors font-medium"
          >
            ↓ Şablonu İndir
          </a>
          <div className="mt-6">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gold/10 file:text-gold file:font-medium hover:file:bg-gold/20 cursor-pointer"
            />
          </div>
          {csvFile && (
            <button
              onClick={handleCsvImport}
              disabled={csvLoading}
              className="btn-primary mt-4 w-full"
            >
              {csvLoading ? 'Yükleniyor...' : `"${csvFile.name}" Yükle`}
            </button>
          )}
        </div>
      ) : (
        /* Tekil form */
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Temel bilgiler */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-ink text-sm border-b border-border pb-3">Temel Bilgiler</h2>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Başlık *</label>
              <input {...register('title', { required: true })} className="input-base" placeholder="örn. Kadıköy'de 3+1 Satılık Daire" />
              {errors.title && <p className="text-xs text-red-500 mt-1">Zorunlu alan</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">İlan Tipi *</label>
                <select {...register('listingType')} className="input-base">
                  <option value="sale">Satılık</option>
                  <option value="rent">Kiralık</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Mülk Tipi *</label>
                <select {...register('propertyType')} className="input-base">
                  <option value="residential">Konut</option>
                  <option value="commercial">İş Yeri</option>
                  <option value="land">Arsa / Tarla</option>
                  <option value="industrial">Endüstriyel</option>
                </select>
              </div>
            </div>

            {propertyType === 'residential' && (
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Kategori</label>
                <select {...register('category')} className="input-base">
                  <option value="apartment">Daire</option>
                  <option value="villa">Villa</option>
                  <option value="detached">Müstakil</option>
                  <option value="studio">Stüdyo</option>
                  <option value="duplex">Dubleks</option>
                  <option value="penthouse">Penthouse</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Fiyat *</label>
                <input {...register('price', { required: true })} type="number" className="input-base" placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Para Birimi</label>
                <select {...register('currency')} className="input-base">
                  <option value="TRY">₺ TRY</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Açıklama</label>
              <textarea {...register('description')} rows={4} className="input-base resize-none" placeholder="İlan açıklaması..." />
            </div>
          </div>

          {/* Konum */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-ink text-sm border-b border-border pb-3">Konum</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Şehir *</label>
                <select {...register('city', { required: true })} className="input-base">
                  <option value="">Seçin</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">İlçe</label>
                <input {...register('district')} className="input-base" placeholder="İlçe" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Mahalle</label>
                <input {...register('neighborhood')} className="input-base" placeholder="Mahalle" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Enlem (lat)</label>
                <input {...register('lat')} type="number" step="any" className="input-base" placeholder="41.0082" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Boylam (lng)</label>
                <input {...register('lng')} type="number" step="any" className="input-base" placeholder="28.9784" />
              </div>
            </div>
          </div>

          {/* Özellikler */}
          {propertyType === 'residential' && (
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-ink text-sm border-b border-border pb-3">Özellikler</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Alan (m²)</label>
                  <input {...register('areaM2')} type="number" className="input-base" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Oda Sayısı</label>
                  <select {...register('roomCount')} className="input-base">
                    <option value="">Seçin</option>
                    {ROOM_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Bina Yaşı</label>
                  <input {...register('buildingAge')} type="number" className="input-base" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Kat</label>
                  <input {...register('floorNo')} type="number" className="input-base" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Toplam Kat</label>
                  <input {...register('totalFloors')} type="number" className="input-base" />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                {[
                  { key: 'hasParking', label: 'Otopark' },
                  { key: 'hasElevator', label: 'Asansör' },
                  { key: 'hasBalcony', label: 'Balkon' },
                  { key: 'isFurnished', label: 'Eşyalı' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register(key as keyof FormData)} className="w-4 h-4 rounded border-border text-teal focus:ring-teal/50" />
                    <span className="text-sm text-ink">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* İletişim */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-ink text-sm border-b border-border pb-3">İletişim</h2>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">WhatsApp Telefon</label>
              <input {...register('agentPhone')} className="input-base" placeholder="05XX XXX XX XX" />
              <p className="text-xs text-muted mt-1">Bu numara üzerinden WhatsApp deep link ve QR oluşturulur.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Kaydediliyor...' : 'İlan Oluştur (Taslak)'}
            </button>
            <button type="button" onClick={() => router.back()} className="btn-outline px-6">
              Vazgeç
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
