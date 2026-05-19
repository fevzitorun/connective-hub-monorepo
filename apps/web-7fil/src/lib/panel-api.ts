const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'

async function authRequest<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
    ...init,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export type DashboardStats = {
  totalListings: number
  activeListings: number
  draftListings: number
  expiredListings: number
  totalViews: number
  totalWhatsappClicks: number
  plan: string
  subscription: { plan: string; status: string; endsAt: string | null } | null
}

export type AgencyProfile = {
  id: string
  companyName: string
  licenseNo?: string
  phone?: string
  address?: string
  city?: string
  description?: string
  subdomain?: string
  logoUrl?: string
  plan: string
  isVerified: boolean
}

export type PlanPricing = Record<string, {
  monthly: number
  maxListings: number
  features: string[]
}>

export type PanelListing = {
  id: string
  title: string
  status: string
  price: number | null
  currency: string
  city: string
  district: string
  listingType: string
  propertyType: string
  viewCount: number
  whatsappClicks: number
  createdAt: string
  expiresAt: string | null
  photos: { url: string; isCover: boolean }[]
}

export const panelApi = {
  getStats: (token: string) =>
    authRequest<{ data: DashboardStats }>('/agency/stats', token),

  getProfile: (token: string) =>
    authRequest<{ data: AgencyProfile }>('/agency/me', token),

  updateProfile: (token: string, body: Partial<AgencyProfile>) =>
    authRequest<{ data: AgencyProfile }>('/agency/me', token, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  getMyListings: (token: string, page = 1, perPage = 20) =>
    authRequest<{ data: { data: PanelListing[]; total: number; page: number; totalPages: number } }>(
      `/agency/listings?page=${page}&perPage=${perPage}`, token
    ),

  getPlans: (token: string) =>
    authRequest<{ data: PlanPricing }>('/agency/plans', token),

  subscribe: (token: string, plan: string) =>
    authRequest<{ data: unknown }>('/agency/subscribe', token, {
      method: 'POST',
      body: JSON.stringify({ plan }),
    }),

  login: (email: string, password: string) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then((r) => r.json()),

  register: (body: { email: string; password: string; fullName?: string; role?: string }) =>
    fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((r) => r.json()),

  me: (token: string) =>
    authRequest<{ data: { user: import('./panel-api').AgencyProfile & { role: string; email: string } } }>('/auth/me', token),
}
