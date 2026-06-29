import Constants from 'expo-constants'

const BASE: string =
  process.env.EXPO_PUBLIC_API_URL ??
  (Constants.expoConfig?.extra as Record<string, string> | undefined)?.apiUrl ??
  'http://localhost:4000/api/v1'

async function req<T>(path: string, init?: RequestInit, token?: string | null): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init?.headers ?? {}),
  }
  const res = await fetch(`${BASE}${path}`, { ...init, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as Record<string, string>
    throw new Error(err['message'] ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export type AuthUser = {
  id: string; email: string; name: string; role: string
  phone: string | null; avatarUrl: string | null
}

export type AuthResponse = {
  user: AuthUser; accessToken: string; refreshToken: string
}

export const authApi = {
  login: (email: string, password: string) =>
    req<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (body: { email: string; password: string; name: string; phone?: string; role: string }) =>
    req<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  refresh: (refreshToken: string) =>
    req<AuthResponse>('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
}

// ── Listings ──────────────────────────────────────────────────────────────────

export type ListingPhoto = { id: string; url: string; isCover: boolean }

export type Listing = {
  id: string
  title: string
  description: string | null
  listingType: 'sale' | 'rent'
  propertyType: string
  status: string
  price: number
  currency: string
  city: string
  district: string
  neighborhood: string | null
  areaM2: number | null
  roomCount: string | null
  floorNo: number | null
  totalFloors: number | null
  buildingAge: number | null
  hasParking: boolean
  hasElevator: boolean
  latitude: number | null
  longitude: number | null
  viewCount: number
  whatsappClicks: number
  favoriteCount: number
  whatsappLink: string | null
  photos: ListingPhoto[]
  publishedAt: string | null
  createdAt: string
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
  page?: number
  perPage?: number
}

export type SearchResponse = {
  data: Listing[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export const listingsApi = {
  search: (params: SearchParams, token?: string | null) => {
    const qs = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => { if (v != null) qs.set(k, String(v)) })
    return req<SearchResponse>(`/search?${qs.toString()}`, undefined, token)
  },

  get: (id: string, token?: string | null) =>
    req<{ data: Listing }>(`/listings/${id}`, undefined, token),

  getFavorites: (token: string) =>
    req<{ data: Listing[] }>('/favorites', undefined, token),

  addFavorite: (listingId: string, token: string) =>
    req<void>('/favorites', { method: 'POST', body: JSON.stringify({ listingId }) }, token),

  removeFavorite: (listingId: string, token: string) =>
    req<void>(`/favorites/${listingId}`, { method: 'DELETE' }, token),

  trackView: (id: string) =>
    req<void>(`/listings/${id}/view`, { method: 'POST' }).catch(() => undefined),

  trackWaClick: (id: string) =>
    req<void>(`/listings/${id}/whatsapp`, { method: 'POST' }).catch(() => undefined),
}

// ── Agency panel ──────────────────────────────────────────────────────────────

export type AgencyListingRow = {
  id: string; title: string; status: string; listingType: string
  city: string; price: number; currency: string
  viewCount: number; whatsappClicks: number; favoriteCount: number
  createdAt: string; photos: ListingPhoto[]
}

export const agencyApi = {
  getListings: (token: string, page = 1, limit = 20) =>
    req<{ data: AgencyListingRow[]; total: number }>(
      `/agency/listings?page=${page}&limit=${limit}`, undefined, token,
    ),

  getStats: (token: string) =>
    req<{ data: unknown }>('/analytics/agency', undefined, token),

  updateListingStatus: (id: string, status: string, token: string) =>
    req<void>(`/listings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, token),
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function formatPrice(price: number, currency: string): string {
  const sym = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₺'
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(2).replace('.', ',')} M ${sym}`
  if (price >= 1_000) return `${(price / 1_000).toFixed(0)} B ${sym}`
  return `${price.toLocaleString('tr-TR')} ${sym}`
}

export function listingTypeLabel(t: string): string {
  return t === 'sale' ? 'Satılık' : 'Kiralık'
}

export function propertyTypeLabel(t: string): string {
  const m: Record<string, string> = {
    apartment: 'Daire', house: 'Müstakil Ev', land: 'Arsa',
    office: 'Ofis', shop: 'Dükkan', villa: 'Villa',
    warehouse: 'Depo', hotel: 'Otel',
  }
  return m[t] ?? t
}
