import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { MailService } from './mail.service'

@Injectable()
export class MailScheduler {
  private readonly logger = new Logger(MailScheduler.name)

  constructor(
    private readonly mail: MailService,
    @InjectDataSource() private readonly ds: DataSource,
  ) {}

  // Her sabah 09:00 — süresi 7 gün içinde dolacak ilanları kontrol et
  @Cron('0 9 * * *')
  async sendListingExpiryWarnings() {
    // Ajans bazlı grupla
    const rows = await this.ds.query(`
      SELECT
        l.id, l.title, l.expires_at,
        a.id AS agency_id,
        u.email AS agency_email,
        u.full_name AS agency_name
      FROM listings l
      JOIN agencies a ON a.id = l.agency_id
      JOIN users u ON u.id = a.user_id
      WHERE l.status = 'active'
        AND l.expires_at BETWEEN NOW() AND NOW() + INTERVAL '7 days'
      ORDER BY a.id, l.expires_at
    `) as {
      id: string; title: string; expires_at: string
      agency_id: string; agency_email: string; agency_name: string
    }[]

    // Agency bazında grupla
    const byAgency = new Map<string, typeof rows>()
    for (const row of rows) {
      const existing = byAgency.get(row.agency_id) ?? []
      existing.push(row)
      byAgency.set(row.agency_id, existing)
    }

    for (const [, agencyRows] of byAgency) {
      const first = agencyRows[0]
      if (!first) continue
      await this.mail.sendListingExpiry(
        first.agency_email,
        first.agency_name,
        agencyRows.map((r) => ({ title: r.title, expiresAt: r.expires_at })),
      ).catch(() => undefined)
      this.logger.log(`Expiry warning sent to ${first.agency_email} for ${agencyRows.length} listings`)
    }
  }

  // Her gün gece yarısı — abonelik yenileme hatırlatması (7 gün öncesi)
  @Cron('0 0 * * *')
  async sendSubscriptionRenewalReminders() {
    const rows = await this.ds.query(`
      SELECT
        s.plan, s.ends_at,
        u.email, u.full_name
      FROM subscriptions s
      JOIN agencies a ON a.id = s.agency_id
      JOIN users u ON u.id = a.user_id
      WHERE s.status = 'active'
        AND s.ends_at BETWEEN NOW() + INTERVAL '6 days' AND NOW() + INTERVAL '7 days'
    `) as { plan: string; ends_at: string; email: string; full_name: string }[]

    for (const row of rows) {
      await this.mail.sendSubscriptionRenewal(row.email, row.full_name, row.plan, row.ends_at)
        .catch(() => undefined)
    }
    if (rows.length > 0) this.logger.log(`Subscription renewal reminders: ${rows.length}`)
  }
}
