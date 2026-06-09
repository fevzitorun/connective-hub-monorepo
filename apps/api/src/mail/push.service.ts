import { Injectable, Logger } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

// Expo push API — no SDK needed, plain HTTP
const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'

type ExpoPushMessage = {
  to: string
  title: string
  body: string
  data?: Record<string, unknown>
  sound?: 'default'
  badge?: number
}

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name)

  constructor(@InjectDataSource() private readonly ds: DataSource) {}

  // ── Token yönetimi ────────────────────────────────────────────────────────

  async registerToken(userId: string, token: string, platform: 'ios' | 'android' | 'web') {
    await this.ds.query(`
      INSERT INTO push_tokens (user_id, token, platform)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, token) DO UPDATE SET platform = $3
    `, [userId, token, platform])
  }

  async removeToken(userId: string, token: string) {
    await this.ds.query(
      `DELETE FROM push_tokens WHERE user_id = $1 AND token = $2`, [userId, token],
    )
  }

  // ── Gönderme ──────────────────────────────────────────────────────────────

  async sendToUser(userId: string, title: string, body: string, data?: Record<string, unknown>) {
    const rows = await this.ds.query(
      `SELECT token FROM push_tokens WHERE user_id = $1`, [userId],
    ) as { token: string }[]
    if (rows.length === 0) return

    await this.sendBatch(rows.map((r) => ({
      to: r.token, title, body, sound: 'default' as const, data,
    })))
  }

  async sendToRole(role: string, title: string, body: string, data?: Record<string, unknown>) {
    const rows = await this.ds.query(`
      SELECT pt.token FROM push_tokens pt
      JOIN users u ON u.id = pt.user_id
      WHERE u.role = $1 AND u.is_active = true
    `, [role]) as { token: string }[]
    if (rows.length === 0) return

    await this.sendBatch(rows.map((r) => ({ to: r.token, title, body, sound: 'default' as const, data })))
  }

  private async sendBatch(messages: ExpoPushMessage[]) {
    // Expo chunk limit 100
    for (let i = 0; i < messages.length; i += 100) {
      const chunk = messages.slice(i, i + 100)
      try {
        const res = await fetch(EXPO_PUSH_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(chunk),
        })
        if (!res.ok) this.logger.warn(`Expo push HTTP ${res.status}`)
      } catch (e) {
        this.logger.error(`Push gönderme hatası: ${e instanceof Error ? e.message : e}`)
      }
    }
  }
}
