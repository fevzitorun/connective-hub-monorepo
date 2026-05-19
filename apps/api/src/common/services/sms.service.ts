import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name)

  constructor(private readonly config: ConfigService) {}

  async sendOtp(phone: string, otp: string): Promise<void> {
    const username = this.config.get<string>('NETGSM_USERNAME')
    const password = this.config.get<string>('NETGSM_PASSWORD')
    const header   = this.config.get<string>('NETGSM_HEADER', '7FIL')

    // Dev ortamında gerçek SMS gönderme
    if (this.config.get('NODE_ENV') !== 'production') {
      this.logger.log(`[DEV] SMS → ${phone} | OTP: ${otp}`)
      return
    }

    const message = `7fil güvenlik kodunuz: ${otp}. 5 dakika geçerlidir.`
    const url = `https://api.netgsm.com.tr/sms/send/get/?usercode=${username}&password=${password}&gsmno=${phone}&message=${encodeURIComponent(message)}&msgheader=${header}`

    try {
      const response = await fetch(url)
      const text = await response.text()
      // Netgsm başarıda "00 XXXXXXXX" döner
      if (!text.startsWith('00')) {
        this.logger.error(`Netgsm hata kodu: ${text}`)
        throw new InternalServerErrorException('SMS gönderilemedi')
      }
    } catch (err) {
      this.logger.error('SMS gönderim hatası', err)
      throw new InternalServerErrorException('SMS gönderilemedi')
    }
  }
}
