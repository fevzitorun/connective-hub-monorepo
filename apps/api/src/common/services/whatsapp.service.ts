import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as QRCode from 'qrcode'
import { StorageService } from '../../storage/storage.service'

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name)

  constructor(
    private readonly config: ConfigService,
    private readonly storage: StorageService,
  ) {}

  /**
   * Emlakçı telefon numarası + ilan bilgisinden WhatsApp deep link üretir
   * ve QR kod görselini R2'ye yükler
   */
  async generateForListing(params: {
    agentPhone: string    // '905321234567' (başında 90)
    listingId: string
    listingTitle: string
    city: string
  }): Promise<{ link: string; qrUrl: string }> {
    const message = encodeURIComponent(
      `Merhaba, 7fil.com.tr'deki "${params.listingTitle}" ilanı (${params.city}) hakkında bilgi almak istiyorum. İlan No: ${params.listingId}`
    )

    const link = `https://wa.me/${params.agentPhone}?text=${message}`

    // QR kod görselini PNG buffer olarak üret
    const qrBuffer = await QRCode.toBuffer(link, {
      type: 'png',
      width: 400,
      margin: 2,
      color: { dark: '#1a1a2e', light: '#f8f4ee' },  // 7fil --ink + --cream renkleri
    })

    // R2'ye yükle
    const { url: qrUrl } = await this.storage.upload(qrBuffer, {
      folder: `whatsapp-qr/${params.listingId}`,
      filename: 'qr',
      mimeType: 'image/png',
    })

    return { link, qrUrl }
  }

  /** Telefon numarasını Türkiye formatına normalize et: 05XX → 905XX */
  static normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, '')
    if (digits.startsWith('90')) return digits
    if (digits.startsWith('0'))  return `9${digits}`
    return `90${digits}`
  }
}
