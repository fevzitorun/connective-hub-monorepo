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

export interface DashboardStats {
  referrals: { total: number; converted: number; last_30d: number }
  commissions: { total_earned: string; paid: string; pending: string }
  activeApiKeys: number
}

export interface Referral {
  id: string
  ref_type: string
  status: string
  contact_name: string
  contact_email: string
  contact_phone: string | null
  notes: string | null
  created_at: string
  converted_at: string | null
  agency_name: string | null
  commission_amount: number | null
  commission_status: string | null
}

export interface Commission {
  id: string
  amount: number
  currency: string
  status: string
  commission_type: string
  created_at: string
  paid_at: string | null
  contact_name: string | null
  ref_type: string | null
}

export interface ApiKey {
  id: string
  name: string
  key_prefix: string
  created_at: string
  last_used_at: string | null
  expires_at: string | null
  revoked_at: string | null
}

interface Paginated<T> { data: T[]; total: number; page: number; limit: number }

export const partnerApi = {
  login: (email: string, password: string) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(r => r.json()) as Promise<{ data?: { user: { role: string; email: string; fullName?: string; id: string }; accessToken: string }; statusCode?: number; message?: string }>,

  getDashboard: (token: string) =>
    req<{ data: DashboardStats }>('/partner/dashboard', token),

  getRates: (token: string) =>
    req<{ data: Record<string, number> }>('/partner/rates', token),

  // Referrals
  listReferrals: (token: string, opts?: { page?: number; status?: string }) => {
    const p = new URLSearchParams({ page: String(opts?.page ?? 1), limit: '20' })
    if (opts?.status) p.set('status', opts.status)
    return req<Paginated<Referral>>(`/partner/referrals?${p}`, token)
  },

  createReferral: (token: string, body: {
    refType: string; agencyId?: string; contactName: string;
    contactEmail: string; contactPhone?: string; notes?: string; estimatedValue?: number
  }) => req<{ data: { id: string } }>('/partner/referrals', token, {
    method: 'POST', body: JSON.stringify(body),
  }),

  // Commissions
  listCommissions: (token: string, page = 1) =>
    req<Paginated<Commission>>(`/partner/commissions?page=${page}&limit=20`, token),

  // API Keys
  listApiKeys: (token: string) =>
    req<{ data: ApiKey[] }>('/partner/api-keys', token),

  createApiKey: (token: string, name: string) =>
    req<{ data: { key: string; keyPrefix: string } }>('/partner/api-keys', token, {
      method: 'POST', body: JSON.stringify({ name }),
    }),

  revokeApiKey: (token: string, id: string) =>
    req<void>(`/partner/api-keys/${id}`, token, { method: 'DELETE' }),

  // Embed
  getEmbed: (token: string, opts: { type: string; agencyId?: string; theme?: string }) => {
    const p = new URLSearchParams({ type: opts.type })
    if (opts.agencyId) p.set('agencyId', opts.agencyId)
    if (opts.theme) p.set('theme', opts.theme)
    return req<{ data: { src: string; iframeCode: string; scriptCode: string } }>(`/partner/embed?${p}`, token)
  },
}
