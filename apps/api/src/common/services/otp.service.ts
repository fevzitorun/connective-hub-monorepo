import { Injectable, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, RedisClientType } from 'redis'

const OTP_TTL_SECONDS = 300   // 5 dakika
const OTP_PREFIX      = 'otp:'

@Injectable()
export class OtpService {
  private client: RedisClientType

  constructor(private readonly config: ConfigService) {
    this.client = createClient({ url: config.get<string>('REDIS_URL', 'redis://localhost:6379') }) as RedisClientType
    this.client.connect()
  }

  /** 6 haneli OTP üretip Redis'e kaydet */
  async generate(phone: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await this.client.setEx(`${OTP_PREFIX}${phone}`, OTP_TTL_SECONDS, otp)
    return otp
  }

  /** OTP doğrula ve sil */
  async verify(phone: string, otp: string): Promise<boolean> {
    const stored = await this.client.get(`${OTP_PREFIX}${phone}`)
    if (!stored || stored !== otp) {
      throw new BadRequestException('Geçersiz veya süresi dolmuş doğrulama kodu')
    }
    await this.client.del(`${OTP_PREFIX}${phone}`)
    return true
  }
}
