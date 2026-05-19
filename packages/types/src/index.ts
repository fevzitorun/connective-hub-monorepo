// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole =
  | 'buyer'
  | 'agency'
  | 'agent_person'
  | 'lawyer'
  | 'bank'
  | 'insurer'
  | 'admin'

export interface User {
  id: string
  email: string
  phone?: string
  tcKimlik?: string
  role: UserRole
  isVerified: boolean
  createdAt: Date
}

// ─── Agency & Subscription ───────────────────────────────────────────────────

export type AgencyPlan = 'free' | 'pro' | 'corporate'

export interface Agency {
  id: string
  userId: string
  companyName: string
  licenseNo?: string
  plan: AgencyPlan
  subdomain?: string
  createdAt: Date
}

export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing'

// ─── Listings ────────────────────────────────────────────────────────────────

export type PropertyType = 'residential' | 'commercial' | 'land' | 'industrial'

export type ListingType = 'sale' | 'rent'

export type ListingStatus = 'draft' | 'active' | 'passive' | 'sold' | 'rented'

export type ResidentialCategory =
  | 'apartment'   // Daire
  | 'villa'
  | 'detached'    // Müstakil
  | 'studio'      // Stüdyo
  | 'duplex'
  | 'penthouse'
  | 'land'        // Arsa
  | 'building'    // Bina

export type CommercialCategory =
  | 'office'
  | 'retail'      // Dükkan/mağaza
  | 'warehouse'   // Depo
  | 'factory'     // Fabrika
  | 'hotel'
  | 'showroom'
  | 'land'
  | 'plaza'

export interface GeoPoint {
  lat: number
  lng: number
}

export interface ListingPhoto {
  id: string
  url: string
  r2Key: string
  sortOrder: number
  isCover: boolean
}

export interface Listing {
  id: string
  agencyId?: string
  ownerUserId: string
  title: string
  description?: string
  price?: number
  currency: 'TRY' | 'USD' | 'EUR' | 'GBP'
  propertyType: PropertyType
  listingType: ListingType
  category: string
  status: ListingStatus
  // Location
  coordinates?: GeoPoint
  addressText?: string
  city: string
  district: string
  neighborhood?: string
  // Specs
  areaM2?: number
  roomCount?: string      // '1+1' | '2+1' | '3+1' | '4+1' | '5+'
  floorNo?: number
  totalFloors?: number
  buildingAge?: number
  isFurnished?: boolean
  hasParking?: boolean
  hasElevator?: boolean
  hasBalcony?: boolean
  // WhatsApp
  whatsappLink?: string
  whatsappQrUrl?: string
  // Stats
  viewCount: number
  whatsappClicks: number
  photos: ListingPhoto[]
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ListingFilters {
  city?: string
  district?: string
  neighborhood?: string
  propertyType?: PropertyType
  listingType?: ListingType
  category?: string
  priceMin?: number
  priceMax?: number
  areaMin?: number
  areaMax?: number
  roomCount?: string[]
  buildingAgeMax?: number
  isFurnished?: boolean
  hasParking?: boolean
  hasElevator?: boolean
  hasBalcony?: boolean
  // Geo search
  lat?: number
  lng?: number
  radiusKm?: number
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface SearchResult {
  listings: Listing[]
  total: number
  page: number
  perPage: number
}

export type AlertChannel = 'email' | 'whatsapp'

export interface SearchAlert {
  id: string
  userId: string
  filters: ListingFilters
  channel: AlertChannel
  isActive: boolean
  createdAt: Date
}

// ─── FILTERRA.AI ──────────────────────────────────────────────────────────────

export interface FilterraValuation {
  listingId: string
  estimatedPriceMin: number
  estimatedPriceMax: number
  pricePerM2: number
  confidenceScore: number  // 0-100
  comparablesCount: number
  generatedAt: Date
}

export interface FilterraLegalReport {
  listingId: string
  riskScore: number          // 0-100 (0 = no risk, 100 = high risk)
  redFlags: string[]
  reportText: string         // Claude-generated Turkish text
  checklist: LegalCheckItem[]
  issuedAt: Date
  expiresAt: Date
  lawyerId?: string
}

export interface LegalCheckItem {
  label: string
  status: 'ok' | 'warning' | 'danger' | 'unknown'
  detail?: string
}

// ─── Legal / Lawyer ───────────────────────────────────────────────────────────

export type CertificateStatus = 'pending' | 'issued' | 'expired' | 'revoked'

export interface PropertyCertificate {
  id: string
  listingId: string
  lawyerId: string
  qrCode: string
  status: CertificateStatus
  issuedAt: Date
  expiresAt: Date
}

// ─── Finance ─────────────────────────────────────────────────────────────────

export type FinanceType = 'conventional' | 'islamic'

export interface MortgageCalculation {
  propertyPrice: number
  downPaymentPercent: number
  termMonths: number
  annualRatePercent: number
  financeType: FinanceType
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  bankName: string
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface ApiError {
  statusCode: number
  message: string
  error?: string
}
