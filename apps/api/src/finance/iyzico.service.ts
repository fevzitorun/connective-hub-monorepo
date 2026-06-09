import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { InjectDataSource } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { createHash, randomBytes } from 'crypto'
import { PaymentOrder } from './entities/payment-order.entity'

const PLAN_PRICES: Record<string, number> = {
  free: 0, pro: 499, corporate: 999, enterprise: 2499,
}

const SANDBOX_BASE = 'https://sandbox.iyzipay.com'
const PROD_BASE = 'https://api.iyzipay.com'

@Injectable()
export class IyzicoService {
  private readonly logger = new Logger(IyzicoService.name)
  private readonly baseUrl: string
  private readonly apiKey: string
  private readonly secretKey: string
  private readonly callbackBase: string
  private readonly frontendBase: string

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(PaymentOrder) private readonly orders: Repository<PaymentOrder>,
    @InjectDataSource() private readonly ds: DataSource,
  ) {
    const isProd = config.get('IYZICO_MODE') === 'production'
    this.baseUrl = isProd ? PROD_BASE : SANDBOX_BASE
    this.apiKey = config.get('IYZICO_API_KEY') ?? 'sandbox-1NWpEMsMJCHnHg0j9jRvxRTHEePJCNp2'
    this.secretKey = config.get('IYZICO_SECRET_KEY') ?? 'sandbox-jaTGxVRTXj6WBVXSnkKa7RRiRz98aQwR'
    this.callbackBase = config.get('API_BASE_URL') ?? 'http://localhost:4000/api/v1'
    this.frontendBase = config.get('FRONTEND_URL') ?? 'http://localhost:3001'
  }

  // ── Authorization header ───────────────────────────────────────────────────

  private buildHeaders(body: object): Record<string, string> {
    const randomKey = randomBytes(12).toString('base64url')
    const pkiStr = this.buildPkiString(body)
    const hash = createHash('sha1')
      .update(this.apiKey + randomKey + pkiStr + this.secretKey)
      .digest('base64')
    return {
      Authorization: `IYZWS ${this.apiKey}:${hash}`,
      'x-iyzi-rnd': randomKey,
      'x-iyzi-client-version': '7fil-iyzipay-1.0',
    }
  }

  private buildPkiString(obj: unknown, prefix = ''): string {
    if (obj === null || obj === undefined) return ''
    if (typeof obj !== 'object') return prefix ? `${prefix}=${obj}` : String(obj)

    const parts: string[] = []

    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const inner = this.buildPkiString(obj[i], `${prefix}[${i}]`)
        if (inner) parts.push(inner)
      }
      return parts.join(',')
    }

    for (const key of Object.keys(obj as Record<string, unknown>).sort()) {
      const val = (obj as Record<string, unknown>)[key]
      const fullKey = prefix ? `${prefix}.${key}` : key
      if (val === null || val === undefined) continue
      if (typeof val === 'object') {
        const inner = this.buildPkiString(val, fullKey)
        if (inner) parts.push(inner)
      } else {
        parts.push(`${fullKey}=${val}`)
      }
    }
    return prefix ? '[' + parts.join(',') + ']' : parts.join(',')
  }

  // ── Initialize checkout form ───────────────────────────────────────────────

  async initializeCheckout(opts: {
    agencyId: string
    userId: string
    userEmail: string
    userName: string
    plan: string
    months: number
    userIp: string
  }): Promise<{ orderId: string; checkoutFormContent: string; token: string }> {
    const unitPrice = PLAN_PRICES[opts.plan] ?? 0
    const totalPrice = unitPrice * opts.months

    if (totalPrice === 0) {
      throw new BadRequestException('Ücretsiz plan ödeme gerektirmez.')
    }

    const order = this.orders.create({
      agencyId: opts.agencyId,
      userId: opts.userId,
      plan: opts.plan,
      months: opts.months,
      amount: totalPrice,
      currency: 'TRY',
      status: 'pending',
    })
    const saved = await this.orders.save(order)

    const nameParts = opts.userName.trim().split(/\s+/)
    const firstName = nameParts[0] ?? 'Kullanıcı'
    const lastName = nameParts.slice(1).join(' ') || firstName
    const priceStr = totalPrice.toFixed(2)

    const requestBody = {
      locale: 'tr',
      conversationId: saved.id,
      price: priceStr,
      paidPrice: priceStr,
      currency: 'TRY',
      basketId: saved.id,
      paymentGroup: 'SUBSCRIPTION',
      callbackUrl: `${this.callbackBase}/finance/payment/callback`,
      enabledInstallments: [1, 2, 3, 6, 9, 12],
      buyer: {
        id: opts.userId,
        name: firstName,
        surname: lastName,
        email: opts.userEmail,
        identityNumber: '11111111111',
        registrationAddress: 'Türkiye',
        city: 'Istanbul',
        country: 'Turkey',
        ip: opts.userIp || '85.34.78.112',
      },
      shippingAddress: {
        contactName: opts.userName,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Türkiye',
      },
      billingAddress: {
        contactName: opts.userName,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Türkiye',
      },
      basketItems: [
        {
          id: `${opts.plan}-${opts.months}mo`,
          name: `7fil ${opts.plan.charAt(0).toUpperCase() + opts.plan.slice(1)} Plan (${opts.months} ay)`,
          category1: 'SaaS Abonelik',
          itemType: 'VIRTUAL',
          price: priceStr,
        },
      ],
    }

    const headers = this.buildHeaders(requestBody)
    const res = await fetch(`${this.baseUrl}/payment/iyzipos/initialize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(requestBody),
    })

    const result = await res.json() as {
      status: string
      errorMessage?: string
      checkoutFormContent?: string
      token?: string
    }

    if (result.status !== 'success' || !result.token) {
      this.logger.warn(`İyzico init failed (order ${saved.id}): ${result.errorMessage}`)
      await this.orders.update(saved.id, { status: 'failed', errorMsg: result.errorMessage ?? 'İyzico hatası' })
      throw new BadRequestException(result.errorMessage ?? 'Ödeme formu başlatılamadı.')
    }

    await this.orders.update(saved.id, { iyzicoToken: result.token })

    return {
      orderId: saved.id,
      checkoutFormContent: result.checkoutFormContent ?? '',
      token: result.token,
    }
  }

  // ── Callback (POST from İyzico after 3DS) ─────────────────────────────────

  async handleCallback(token: string): Promise<string> {
    if (!token) return `${this.frontendBase}/panel/abonelik?odeme=hata`
    const order = await this.orders.findOne({ where: { iyzicoToken: token } })
    if (!order) {
      this.logger.warn(`İyzico callback: unknown token ${token}`)
      return `${this.frontendBase}/panel/abonelik?odeme=hata`
    }

    // Already processed (idempotency)
    if (order.status === 'success') {
      return `${this.frontendBase}/panel/abonelik?odeme=basarili`
    }

    const requestBody = { locale: 'tr', conversationId: order.id, token }
    const headers = this.buildHeaders(requestBody)

    const res = await fetch(`${this.baseUrl}/payment/iyzipos/check-payment/detail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(requestBody),
    })

    const result = await res.json() as {
      status: string
      paymentStatus?: string
      paymentId?: string
      errorMessage?: string
    }

    const success = result.status === 'success' && result.paymentStatus === 'SUCCESS'

    if (success) {
      await this.orders.update(order.id, {
        status: 'success',
        iyzicoRef: result.paymentId ?? null,
      })
      await this.activateSubscription(order.agencyId, order.plan, order.months ?? 1, order.amount)
      this.logger.log(`Payment success — order ${order.id}, agency ${order.agencyId}, plan ${order.plan}`)
      return `${this.frontendBase}/panel/abonelik?odeme=basarili`
    }

    await this.orders.update(order.id, {
      status: 'failed',
      errorMsg: result.errorMessage ?? 'Ödeme onaylanmadı',
    })
    return `${this.frontendBase}/panel/abonelik?odeme=hata`
  }

  private async activateSubscription(agencyId: string, plan: string, months: number, amount: number) {
    const expiresAt = new Date(Date.now() + months * 30 * 24 * 3_600_000).toISOString()
    await this.ds.query(
      `UPDATE subscriptions SET status = 'cancelled' WHERE agency_id = $1 AND status = 'active'`,
      [agencyId],
    )
    await this.ds.query(`
      INSERT INTO subscriptions (agency_id, plan, status, amount, currency, starts_at, ends_at)
      VALUES ($1, $2, 'active', $3, 'TRY', NOW(), $4)
    `, [agencyId, plan, amount, expiresAt])
    await this.ds.query(`UPDATE agencies SET plan = $1, updated_at = NOW() WHERE id = $2`, [plan, agencyId])
  }

  // ── Order status polling ───────────────────────────────────────────────────

  async getOrderStatus(orderId: string, agencyId: string) {
    const order = await this.orders.findOne({ where: { id: orderId, agencyId } })
    if (!order) return null
    return { status: order.status, plan: order.plan, amount: Number(order.amount), months: order.months }
  }
}
