import { Injectable, BadRequestException, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

const OTP_TTL_MS     = 300_000   // 5 dakika
const OTP_PREFIX     = 'otp:'

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name)
  private redisClient: import('redis').RedisClientType | null = null
  private readonly memStore = new Map<string, { code: string; expiresAt: number }>()

  constructor(private readonly config: ConfigService) {
    this.initRedis()
  }

  private async initRedis() {
    const url = this.config.get<string>('REDIS_URL')
    if (!url) {
      this.logger.warn('REDIS_URL tanımlı değil — OTP in-memory modda çalışıyor')
      return
    }
    try {
      const { createClient } = await import('redis')
      const client = createClient({ url }) as import('redis').RedisClientType
      await client.connect()
      this.redisClient = client
      this.logger.log('Redis bağlantısı kuruldu')
    } catch (err) {
      this.logger.warn(`Redis bağlanamadı — in-memory fallback: ${(err as Error).message}`)
    }
  }

  async generate(identifier: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const key = `${OTP_PREFIX}${identifier}`

    if (this.redisClient) {
      await this.redisClient.setEx(key, OTP_TTL_MS / 1000, otp)
    } else {
      this.memStore.set(key, { code: otp, expiresAt: Date.now() + OTP_TTL_MS })
    }
    return otp
  }

  async verify(identifier: string, otp: string): Promise<boolean> {
    const key = `${OTP_PREFIX}${identifier}`

    if (this.redisClient) {
      const stored = await this.redisClient.get(key)
      if (!stored || stored !== otp) throw new BadRequestException('Geçersiz veya süresi dolmuş doğrulama kodu')
      await this.redisClient.del(key)
    } else {
      const entry = this.memStore.get(key)
      if (!entry || entry.code !== otp || Date.now() > entry.expiresAt) {
        throw new BadRequestException('Geçersiz veya süresi dolmuş doğrulama kodu')
      }
      this.memStore.delete(key)
    }
    return true
  }
}
