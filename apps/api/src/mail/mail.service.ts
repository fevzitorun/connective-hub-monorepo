import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'
import {
  tplWelcome, tplPasswordReset, tplMortgageLead, tplLegalCase,
  tplAuctionOutbid, tplAuctionWon, tplListingExpiry, tplSubscriptionRenewal,
} from './mail.templates'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  private readonly resend: Resend | null = null
  private readonly from: string

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('RESEND_API_KEY')
    if (apiKey) {
      this.resend = new Resend(apiKey)
    } else {
      this.logger.warn('RESEND_API_KEY tanımlı değil — e-postalar gönderilmeyecek.')
    }
    this.from = this.config.get<string>('MAIL_FROM') ?? 'noreply@7fil.com.tr'
  }

  private async send(to: string, subject: string, html: string) {
    if (!this.resend) {
      this.logger.debug(`[MAIL-DEV] To: ${to} | Subject: ${subject}`)
      return
    }
    try {
      await this.resend.emails.send({ from: `7fil <${this.from}>`, to, subject, html })
    } catch (e) {
      this.logger.error(`E-posta gönderilemedi [${to}]: ${e instanceof Error ? e.message : e}`)
    }
  }

  // ── Public send methods ────────────────────────────────────────────────────

  async sendWelcome(to: string, name: string) {
    const { subject, html } = tplWelcome(name)
    await this.send(to, subject, html)
  }

  async sendPasswordReset(to: string, name: string, token: string) {
    const base = this.config.get<string>('NEXT_PUBLIC_APP_URL') ?? 'https://7fil.com.tr'
    const link = `${base}/sifre-sifirla?token=${token}`
    const { subject, html } = tplPasswordReset(name, link)
    await this.send(to, subject, html)
  }

  async sendMortgageLead(to: string, bankUserName: string, lead: {
    contactName: string; contactPhone: string; loanAmount: number
    loanTermYears: number; listingTitle: string; loanType: string
  }) {
    const { subject, html } = tplMortgageLead(bankUserName, lead)
    await this.send(to, subject, html)
  }

  async sendLegalCase(to: string, lawyerName: string, caseInfo: {
    listingTitle: string; city: string; requestType: string; description: string
  }) {
    const { subject, html } = tplLegalCase(lawyerName, caseInfo)
    await this.send(to, subject, html)
  }

  async sendAuctionOutbid(to: string, userName: string, auction: {
    title: string; id: string; newPrice: number; yourBid: number
  }) {
    const { subject, html } = tplAuctionOutbid(userName, auction)
    await this.send(to, subject, html)
  }

  async sendAuctionWon(to: string, userName: string, auction: {
    title: string; id: string; finalPrice: number
  }) {
    const { subject, html } = tplAuctionWon(userName, auction)
    await this.send(to, subject, html)
  }

  async sendListingExpiry(to: string, agencyName: string, listings: { title: string; expiresAt: string }[]) {
    const { subject, html } = tplListingExpiry(agencyName, listings)
    await this.send(to, subject, html)
  }

  async sendSubscriptionRenewal(to: string, agencyName: string, plan: string, renewsAt: string) {
    const { subject, html } = tplSubscriptionRenewal(agencyName, plan, renewsAt)
    await this.send(to, subject, html)
  }
}
