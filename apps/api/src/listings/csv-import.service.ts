import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { parse } from 'csv-parse/sync'
import { ListingsService } from './listings.service'
import { PropertyType, ListingType } from './entities/listing.entity'

export interface CsvImportResult {
  total:    number
  success:  number
  failed:   number
  errors:   { row: number; message: string }[]
}

/**
 * Pilot ajanslar için CSV import servisi.
 *
 * Beklenen CSV sütunları (Türkçe başlık, büyük/küçük harf fark etmez):
 * baslik, fiyat, para_birimi, ilan_turu, kategori, sehir, ilce, mahalle,
 * adres, alan_m2, oda_sayisi, kat, bina_katlari, bina_yasi, esyali,
 * otopark, asansor, balkon, bahce, havuz, lat, lng, agent_telefon
 */
@Injectable()
export class CsvImportService {
  private readonly logger = new Logger(CsvImportService.name)

  constructor(private readonly listingsService: ListingsService) {}

  async importFromBuffer(buffer: Buffer, userId: string): Promise<CsvImportResult> {
    let rows: Record<string, string>[]

    try {
      rows = parse(buffer, {
        columns:          true,
        skip_empty_lines: true,
        trim:             true,
        bom:              true,
      })
    } catch {
      throw new BadRequestException('CSV dosyası okunamadı. UTF-8 formatında olduğundan emin olun.')
    }

    if (rows.length === 0) throw new BadRequestException('CSV dosyası boş')
    if (rows.length > 500) throw new BadRequestException('Tek seferde en fazla 500 ilan yüklenebilir')

    const result: CsvImportResult = { total: rows.length, success: 0, failed: 0, errors: [] }

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]!
      const rowNum = i + 2  // 1-indexed + başlık satırı

      try {
        const dto = this.rowToDto(row, rowNum)
        await this.listingsService.create(dto, userId)
        result.success++
      } catch (err: any) {
        result.failed++
        result.errors.push({ row: rowNum, message: err.message ?? 'Bilinmeyen hata' })
        this.logger.warn(`CSV satır ${rowNum} hatası: ${err.message}`)
      }
    }

    return result
  }

  private rowToDto(row: Record<string, string>, rowNum: number) {
    const get = (key: string) => row[key]?.trim() ?? ''

    const title = get('baslik') || get('başlık') || get('title')
    if (!title) throw new Error('Başlık zorunludur')

    const city = get('sehir') || get('şehir') || get('city')
    if (!city) throw new Error('Şehir zorunludur')

    const listingTypeRaw = get('ilan_turu') || get('ilan_türü') || 'sale'
    const listingType = listingTypeRaw.toLowerCase().includes('kira')
      ? ListingType.RENT
      : ListingType.SALE

    const priceRaw = get('fiyat') || get('price')
    const price    = priceRaw ? parseFloat(priceRaw.replace(/[.,\s]/g, '').replace(',', '.')) : undefined

    const lat = get('lat') ? parseFloat(get('lat')) : undefined
    const lng = get('lng') || get('lon') ? parseFloat(get('lng') || get('lon')) : undefined

    const bool = (val: string) => ['evet', 'yes', '1', 'true', 'var'].includes(val.toLowerCase())

    return {
      title,
      price,
      currency:     get('para_birimi') || 'TRY',
      propertyType: PropertyType.RESIDENTIAL,
      listingType,
      category:     get('kategori') || get('category') || 'apartment',
      city,
      district:     get('ilce') || get('ilçe') || get('district') || undefined,
      neighborhood: get('mahalle') || get('neighborhood') || undefined,
      addressText:  get('adres') || get('address') || undefined,
      areaM2:       get('alan_m2') ? parseFloat(get('alan_m2')) : undefined,
      roomCount:    get('oda_sayisi') || get('oda_sayısı') || undefined,
      floorNo:      get('kat') ? parseInt(get('kat')) : undefined,
      totalFloors:  get('bina_katlari') ? parseInt(get('bina_katlari')) : undefined,
      buildingAge:  get('bina_yasi') ? parseInt(get('bina_yasi')) : undefined,
      isFurnished:  get('esyali') || get('eşyalı') ? bool(get('esyali') || get('eşyalı')) : undefined,
      hasParking:   bool(get('otopark')),
      hasElevator:  bool(get('asansor') || get('asansör')),
      hasBalcony:   bool(get('balkon')),
      hasGarden:    bool(get('bahce') || get('bahçe')),
      lat,
      lng,
      agentPhone:   get('agent_telefon') || get('telefon') || undefined,
    }
  }

  /** Pilot ajanslar için indirilebilir şablon CSV içeriği */
  static templateCsv(): string {
    const headers = [
      'baslik', 'fiyat', 'para_birimi', 'ilan_turu', 'kategori',
      'sehir', 'ilce', 'mahalle', 'adres', 'alan_m2', 'oda_sayisi',
      'kat', 'bina_katlari', 'bina_yasi', 'esyali',
      'otopark', 'asansor', 'balkon', 'bahce', 'lat', 'lng', 'agent_telefon',
    ]
    const example = [
      'Kadıköy\'de 3+1 Daire', '4500000', 'TRY', 'satilik', 'apartment',
      'İstanbul', 'Kadıköy', 'Moda', 'Moda Cad. No:12', '120', '3+1',
      '3', '8', '5', 'evet',
      'evet', 'evet', 'evet', 'hayır', '40.9877', '29.0225', '05321234567',
    ]
    return [headers.join(','), example.join(',')].join('\n')
  }
}
