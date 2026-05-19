const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export type SearchParams = {
  q?: string
  city?: string
  district?: string
  propertyType?: string
  listingType?: string
  priceMin?: number
  priceMax?: number
  areaMin?: number
  areaMax?: number
  roomCount?: string
  hasParking?: boolean
  hasElevator?: boolean
  page?: number
  perPage?: number
  sortBy?: string
}

export type SearchResponse = {
  data: SearchHit[]
  total: number
  page: number
  perPage: number
  totalPages: number
  query?: string
}

export type SearchHit = {
  id: string
  title: string
  price: number | null
  currency: string
  propertyType: string
  listingType: string
  city: string
  district: string
  neighborhood: string
  roomCount: string
  areaM2: number | null
  hasParking: boolean
  hasElevator: boolean
  coverPhoto: string | null
  whatsappLink: string | null
  publishedAt: number | null
  pricePerM2: number | null
  _formatted?: Record<string, string>
}

export type MapPin = {
  id: string
  title: string
  price: number | null
  currency: string
  listingType: string
  lat: number
  lng: number
}

export const api = {
  search: (params: SearchParams) => {
    const qs = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') qs.set(k, String(v))
    })
    return request<SearchResponse>(`/search?${qs}`)
  },

  mapPins: (params: { city?: string; listingType?: string; propertyType?: string }) => {
    const qs = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => { if (v) qs.set(k, v) })
    return request<MapPin[]>(`/search/map?${qs}`)
  },

  autocomplete: (q: string) =>
    request<SearchResponse>(`/search/autocomplete?q=${encodeURIComponent(q)}`),

  getListing: (id: string) =>
    request<{ data: import('@7fil/types').Listing }>(`/listings/${id}`),

  getFeatured: () =>
    request<{ data: import('@7fil/types').Listing[]; total: number }>(`/listings?perPage=6&sortBy=newest`),
}
