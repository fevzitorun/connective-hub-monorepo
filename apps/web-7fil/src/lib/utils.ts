export function formatPrice(price: number | null | undefined, currency = 'TRY'): string {
  if (price == null) return 'Fiyat Belirtilmemiş'
  const symbols: Record<string, string> = { TRY: '₺', USD: '$', EUR: '€', GBP: '£' }
  const sym = symbols[currency] ?? currency
  if (price >= 1_000_000) return `${sym}${(price / 1_000_000).toFixed(1)} Milyon`
  if (price >= 1_000) return `${sym}${(price / 1_000).toFixed(0)} Bin`
  return `${sym}${price.toLocaleString('tr-TR')}`
}

export function formatArea(m2: number | null | undefined): string {
  if (m2 == null) return ''
  return `${m2} m²`
}

export function listingTypeLabel(type: string): string {
  return type === 'sale' ? 'Satılık' : type === 'rent' ? 'Kiralık' : type
}

export function propertyTypeLabel(type: string): string {
  const map: Record<string, string> = {
    residential: 'Konut',
    commercial: 'İş Yeri',
    land: 'Arsa/Tarla',
    industrial: 'Endüstriyel',
  }
  return map[type] ?? type
}

export function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    apartment: 'Daire', villa: 'Villa', detached: 'Müstakil',
    studio: 'Stüdyo', duplex: 'Dubleks', penthouse: 'Penthouse',
    land: 'Arsa', building: 'Bina', office: 'Ofis', retail: 'Dükkan',
    warehouse: 'Depo', factory: 'Fabrika', hotel: 'Otel',
  }
  return map[cat] ?? cat
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ı/g, 'i').replace(/İ/g, 'i')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function timeAgo(date: Date | string): string {
  const d = new Date(date)
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 60) return 'Az önce'
  if (diff < 3600) return `${Math.floor(diff / 60)} dakika önce`
  if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`
  if (diff < 2592000) return `${Math.floor(diff / 86400)} gün önce`
  return d.toLocaleDateString('tr-TR')
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
