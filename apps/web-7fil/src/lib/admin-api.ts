const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

async function req<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
    ...init,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string }
    throw new Error(err.message ?? `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

export interface AdminStats {
  users: { total: number; active: number; new_7d: number; agencies: number; buyers: number }
  listings: { total: number; active: number; pending: number; new_7d: number }
  agencies: { total: number; verified: number }
  subscriptions: { total: number; active: number }
  mortgageLeads: number
  auctions: { total: number; live: number }
}

export interface AdminUser {
  id: string
  email: string
  full_name: string | null
  role: string
  is_active: boolean
  phone: string | null
  created_at: string
  agency_id: string | null
  company_name: string | null
  plan: string | null
  is_verified: boolean | null
}

export interface AdminAgency {
  id: string
  company_name: string
  license_no: string | null
  plan: string
  is_verified: boolean
  city: string | null
  subdomain: string | null
  created_at: string
  email: string
  full_name: string | null
  is_active: boolean
  listing_count: number
  active_listings: number
  sub_plan: string | null
  sub_expires: string | null
}

export interface AdminListing {
  id: string
  title: string
  status: string
  listing_type: string
  property_type: string
  city: string
  district: string
  price: number | null
  currency: string
  view_count: number
  whatsapp_clicks: number
  favorite_count: number
  created_at: string
  published_at: string | null
  agency_name: string | null
  owner_email: string | null
  cover_url: string | null
}

export interface AdminSubscription {
  id: string
  plan: string
  status: string
  amount: number
  currency: string
  starts_at: string
  ends_at: string | null
  created_at: string
  company_name: string
  city: string | null
  email: string
}

interface Paginated<T> { data: T[]; total: number; page: number; limit: number }

export const adminApi = {
  getStats: (token: string) =>
    req<AdminStats>('/admin/stats', token),

  // Users
  listUsers: (token: string, opts: { page: number; limit: number; role?: string; q?: string; isActive?: boolean }) => {
    const p = new URLSearchParams({ page: String(opts.page), limit: String(opts.limit) })
    if (opts.role) p.set('role', opts.role)
    if (opts.q) p.set('q', opts.q)
    if (opts.isActive !== undefined) p.set('isActive', String(opts.isActive))
    return req<Paginated<AdminUser>>(`/admin/users?${p}`, token)
  },

  getUser: (token: string, id: string) =>
    req<AdminUser>(`/admin/users/${id}`, token),

  updateUser: (token: string, id: string, body: { isActive?: boolean; role?: string }) =>
    req<void>(`/admin/users/${id}`, token, { method: 'PATCH', body: JSON.stringify(body) }),

  // Agencies
  listAgencies: (token: string, opts: { page: number; limit: number; plan?: string; q?: string; isVerified?: boolean }) => {
    const p = new URLSearchParams({ page: String(opts.page), limit: String(opts.limit) })
    if (opts.plan) p.set('plan', opts.plan)
    if (opts.q) p.set('q', opts.q)
    if (opts.isVerified !== undefined) p.set('isVerified', String(opts.isVerified))
    return req<Paginated<AdminAgency>>(`/admin/agencies?${p}`, token)
  },

  verifyAgency: (token: string, id: string, verified: boolean) =>
    req<void>(`/admin/agencies/${id}/verify`, token, { method: 'PATCH', body: JSON.stringify({ verified }) }),

  updateAgencyPlan: (token: string, id: string, plan: string) =>
    req<void>(`/admin/agencies/${id}/plan`, token, { method: 'PATCH', body: JSON.stringify({ plan }) }),

  // Listings
  listListings: (token: string, opts: { page: number; limit: number; status?: string; q?: string; city?: string }) => {
    const p = new URLSearchParams({ page: String(opts.page), limit: String(opts.limit) })
    if (opts.status) p.set('status', opts.status)
    if (opts.q) p.set('q', opts.q)
    if (opts.city) p.set('city', opts.city)
    return req<Paginated<AdminListing>>(`/admin/listings?${p}`, token)
  },

  updateListingStatus: (token: string, id: string, status: string) =>
    req<void>(`/admin/listings/${id}/status`, token, { method: 'PATCH', body: JSON.stringify({ status }) }),

  deleteListing: (token: string, id: string) =>
    req<void>(`/admin/listings/${id}`, token, { method: 'DELETE' }),

  // Subscriptions
  listSubscriptions: (token: string, opts: { page: number; limit: number; status?: string }) => {
    const p = new URLSearchParams({ page: String(opts.page), limit: String(opts.limit) })
    if (opts.status) p.set('status', opts.status)
    return req<Paginated<AdminSubscription>>(`/admin/subscriptions?${p}`, token)
  },

  upsertSubscription: (token: string, agencyId: string, plan: string, months: number) =>
    req<void>(`/admin/agencies/${agencyId}/subscription`, token, {
      method: 'PATCH',
      body: JSON.stringify({ plan, months }),
    }),
}
