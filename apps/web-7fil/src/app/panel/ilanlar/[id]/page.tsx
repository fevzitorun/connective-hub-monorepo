'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '../../../../store/auth'

interface ListingPhoto {
  id: string
  url: string
  order: number
}

interface ListingDetail {
  id: string
  title: string
  status: string
  city: string
  district?: string
  price: number
  currency: string
  listingType: string
  propertyType: string
  photos: ListingPhoto[]
  createdAt: string
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

export default function ListingEditPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { accessToken } = useAuthStore()

  const [listing, setListing] = useState<ListingDetail | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchListing = useCallback(async () => {
    if (!accessToken || !id) return
    try {
      const res = await fetch(`${BASE}/listings/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? 'İlan yüklenemedi')
      setListing(json.data ?? json)
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Hata')
    }
  }, [accessToken, id])

  useEffect(() => { void fetchListing() }, [fetchListing])

  async function uploadFiles(files: FileList | File[]) {
    if (!accessToken || !id) return
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    const valid = Array.from(files).filter((f) => allowed.includes(f.type))
    if (!valid.length) {
      setUploadError('Yalnızca JPEG, PNG veya WebP dosyaları yüklenebilir.')
      return
    }
    if (valid.length > 15) {
      setUploadError('En fazla 15 fotoğraf yükleyebilirsiniz.')
      return
    }
    setUploading(true)
    setUploadError(null)
    try {
      for (const file of valid) {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch(`${BASE}/listings/${id}/photos`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: fd,
        })
        if (!res.ok) {
          const j = await res.json()
          throw new Error(j.message ?? 'Yükleme hatası')
        }
      }
      await fetchListing()
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Yükleme hatası')
    } finally {
      setUploading(false)
    }
  }

  async function deletePhoto(photoId: string) {
    if (!accessToken) return
    setDeleteId(photoId)
    try {
      await fetch(`${BASE}/listings/photos/${photoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      await fetchListing()
    } finally {
      setDeleteId(null)
    }
  }

  async function publishListing() {
    if (!accessToken || !listing) return
    if (!listing.photos?.length) {
      setPublishError('En az 1 fotoğraf yüklemeniz gerekiyor.')
      return
    }
    setPublishing(true)
    setPublishError(null)
    try {
      const res = await fetch(`${BASE}/listings/${id}/publish`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? 'Yayına alınamadı')
      router.push('/panel/ilanlar')
    } catch (e) {
      setPublishError(e instanceof Error ? e.message : 'Yayın hatası')
    } finally {
      setPublishing(false)
    }
  }

  if (loadError) {
    return (
      <div className="p-8">
        <p className="text-red-600">{loadError}</p>
        <Link href="/panel/ilanlar" className="mt-4 text-teal text-sm hover:underline">← İlanlara Dön</Link>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="p-8 flex items-center gap-3 text-muted">
        <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <span>İlan yükleniyor...</span>
      </div>
    )
  }

  const isPublished = listing.status === 'active'
  const isDraft = listing.status === 'draft'

  return (
    <div className="p-8 max-w-3xl">
      {/* Başlık */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/panel/ilanlar" className="text-xs text-muted hover:text-ink transition-colors">← İlanlarım</Link>
          <h1 className="font-display text-2xl font-bold text-ink mt-1 line-clamp-2">{listing.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              isPublished ? 'bg-green-100 text-green-700' :
              isDraft ? 'bg-amber-100 text-amber-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {isPublished ? 'Yayında' : isDraft ? 'Taslak' : listing.status}
            </span>
            <span className="text-xs text-muted">{listing.city}{listing.district ? `, ${listing.district}` : ''}</span>
            <span className="text-xs text-muted">
              {listing.price.toLocaleString('tr-TR')} {listing.currency}
            </span>
          </div>
        </div>
        {isPublished && (
          <Link
            href={`/ilan/${listing.id}`}
            target="_blank"
            className="shrink-0 text-sm text-teal hover:underline font-medium"
          >
            İlanı Gör →
          </Link>
        )}
      </div>

      {/* Fotoğraflar */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-ink text-sm">Fotoğraflar</h2>
          <span className="text-xs text-muted">{listing.photos?.length ?? 0} / 15</span>
        </div>

        {uploadError && (
          <div className="mb-3 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
            {uploadError}
          </div>
        )}

        {/* Fotoğraf grid */}
        {listing.photos?.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {listing.photos.map((photo, i) => (
              <div key={photo.id} className="relative group aspect-video rounded-lg overflow-hidden bg-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={`Fotoğraf ${i + 1}`} className="w-full h-full object-cover" />
                {i === 0 && (
                  <span className="absolute top-1 left-1 text-[10px] font-bold bg-gold text-ink px-1.5 py-0.5 rounded">
                    KAPAK
                  </span>
                )}
                <button
                  onClick={() => deletePhoto(photo.id)}
                  disabled={deleteId === photo.id}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  {deleteId === photo.id ? '…' : '×'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Drag & drop yükleme alanı */}
        {(listing.photos?.length ?? 0) < 15 && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              if (e.dataTransfer.files.length) void uploadFiles(e.dataTransfer.files)
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragOver ? 'border-gold bg-gold/5' : 'border-stone-200 hover:border-gold/50 hover:bg-stone-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => { if (e.target.files) void uploadFiles(e.target.files) }}
            />
            {uploading ? (
              <div className="flex items-center justify-center gap-2 text-muted">
                <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Yükleniyor...</span>
              </div>
            ) : (
              <>
                <svg className="w-10 h-10 mx-auto text-muted/40 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-ink font-medium">Fotoğraf ekle</p>
                <p className="text-xs text-muted mt-1">Sürükle & bırak veya tıkla · JPEG, PNG, WebP · Maks 15 fotoğraf</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Yayına al */}
      {isDraft && (
        <div className="card p-6">
          <h2 className="font-semibold text-ink text-sm mb-2">Yayına Al</h2>
          <p className="text-xs text-muted mb-4">
            İlanınız incelendikten sonra aktif hale gelir. En az 1 fotoğraf gereklidir.
          </p>
          {publishError && (
            <div className="mb-3 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
              {publishError}
            </div>
          )}
          <button
            onClick={() => void publishListing()}
            disabled={publishing || uploading}
            className="btn-primary w-full"
          >
            {publishing ? 'Yayına alınıyor...' : 'İlanı Yayına Al'}
          </button>
        </div>
      )}

      {isPublished && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
          İlan aktif olarak yayında. Değişiklikler için destek ekibiyle iletişime geçin.
        </div>
      )}
    </div>
  )
}
