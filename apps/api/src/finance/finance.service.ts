import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InjectDataSource } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { MortgageLead } from './entities/mortgage-lead.entity'
import { InsuranceQuote } from './entities/insurance-quote.entity'
import { PaymentOrder } from './entities/payment-order.entity'
import { MailService } from '../mail/mail.service'

// ─── BDDK Limits ─────────────────────────────────────────────────────────────
const BDDK_LTV: Record<string, number> = {
  first_residential: 0.80,
  other_residential: 0.60,
  commercial: 0.50,
  land: 0.50,
}

// ─── DASK Risk Zones (city → zone 1-5, 1=highest risk) ───────────────────────
const DASK_ZONES: Record<string, number> = {
  'Adana': 1, 'Adıyaman': 1, 'Afyonkarahisar': 2, 'Ağrı': 2,
  'Amasya': 3, 'Ankara': 3, 'Antalya': 2, 'Artvin': 2,
  'Aydın': 2, 'Balıkesir': 2, 'Bilecik': 2, 'Bingöl': 1,
  'Bitlis': 2, 'Bolu': 1, 'Burdur': 2, 'Bursa': 2,
  'Çanakkale': 2, 'Çankırı': 3, 'Çorum': 3, 'Denizli': 2,
  'Diyarbakır': 2, 'Düzce': 1, 'Edirne': 4, 'Elazığ': 1,
  'Erzincan': 1, 'Erzurum': 2, 'Eskişehir': 3, 'Gaziantep': 1,
  'Giresun': 2, 'Gümüşhane': 2, 'Hakkari': 2, 'Hatay': 1,
  'Iğdır': 2, 'Isparta': 2, 'İstanbul': 1, 'İzmir': 1,
  'Kahramanmaraş': 1, 'Karabük': 3, 'Karaman': 3, 'Kars': 2,
  'Kastamonu': 3, 'Kayseri': 2, 'Kırıkkale': 3, 'Kırklareli': 4,
  'Kırşehir': 3, 'Kilis': 1, 'Kocaeli': 1, 'Konya': 3,
  'Kütahya': 2, 'Malatya': 1, 'Manisa': 2, 'Mardin': 2,
  'Mersin': 2, 'Muğla': 2, 'Muş': 1, 'Nevşehir': 3,
  'Niğde': 3, 'Ordu': 3, 'Osmaniye': 1, 'Rize': 3,
  'Sakarya': 1, 'Samsun': 3, 'Siirt': 2, 'Sinop': 4,
  'Sivas': 3, 'Şanlıurfa': 2, 'Şırnak': 2, 'Tekirdağ': 2,
  'Tokat': 2, 'Trabzon': 3, 'Tunceli': 1, 'Uşak': 2,
  'Van': 1, 'Yalova': 1, 'Yozgat': 3, 'Zonguldak': 3,
}

// Base rates per m² per year by zone (TSB 2024 tariff, TRY)
const DASK_BASE_RATE: Record<number, number> = {
  1: 2.20, 2: 1.50, 3: 0.90, 4: 0.60, 5: 0.40,
}

const CONSTRUCTION_FACTOR: Record<string, number> = {
  betonarme: 1.00,
  yigma: 1.40,
  hafif_celik: 0.85,
  wood: 1.60,
}

const AGE_FACTOR = (age: number): number => {
  if (age <= 5) return 0.85
  if (age <= 15) return 1.00
  if (age <= 30) return 1.15
  return 1.35
}

// ─── Service ─────────────────────────────────────────────────────────────────

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(MortgageLead) private leads: Repository<MortgageLead>,
    @InjectRepository(InsuranceQuote) private quotes: Repository<InsuranceQuote>,
    @InjectRepository(PaymentOrder) private orders: Repository<PaymentOrder>,
    @InjectDataSource() private ds: DataSource,
    private readonly mail: MailService,
  ) {}

  // ── Mortgage Calculator ───────────────────────────────────────────────────

  calculateMortgage(input: {
    propertyPrice: number
    downPayment: number
    loanTermYears: number
    annualInterestRate: number
    isFirstHome: boolean
    propertyType: 'residential' | 'commercial' | 'land'
    loanType: 'conventional' | 'islamic'
  }) {
    const { propertyPrice, downPayment, loanTermYears, annualInterestRate, isFirstHome, propertyType, loanType } = input

    const loanAmount = propertyPrice - downPayment
    const ltvRatio = (loanAmount / propertyPrice) * 100

    // BDDK LTV check
    const ltvKey = propertyType === 'residential'
      ? (isFirstHome ? 'first_residential' : 'other_residential')
      : propertyType
    const maxLtv = BDDK_LTV[ltvKey] ?? 0.80
    const maxLoanAmount = propertyPrice * maxLtv

    if (loanAmount > maxLoanAmount) {
      throw new BadRequestException(
        `BDDK limiti aşıldı. Bu mülk için maksimum kredi tutarı: ${maxLoanAmount.toLocaleString('tr-TR')} TRY (LTV %${(maxLtv * 100).toFixed(0)})`
      )
    }

    if (loanType === 'islamic') {
      return this.calculateIslamicFinance({ loanAmount, loanTermYears, profitRate: annualInterestRate, ltvRatio })
    }

    return this.calculateConventionalMortgage({ loanAmount, loanTermYears, annualInterestRate, ltvRatio, propertyPrice, downPayment })
  }

  private calculateConventionalMortgage(p: {
    loanAmount: number
    loanTermYears: number
    annualInterestRate: number
    ltvRatio: number
    propertyPrice: number
    downPayment: number
  }) {
    const months = p.loanTermYears * 12
    const monthlyRate = p.annualInterestRate / 100 / 12

    let monthlyPayment: number
    if (monthlyRate === 0) {
      monthlyPayment = p.loanAmount / months
    } else {
      const factor = Math.pow(1 + monthlyRate, months)
      monthlyPayment = (p.loanAmount * monthlyRate * factor) / (factor - 1)
    }

    const totalPayment = monthlyPayment * months
    const totalInterest = totalPayment - p.loanAmount
    const apr = p.annualInterestRate // simplified; real APR includes fees

    return {
      loanType: 'conventional',
      loanAmount: Math.round(p.loanAmount),
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      ltvRatio: Math.round(p.ltvRatio * 10) / 10,
      annualInterestRate: p.annualInterestRate,
      loanTermYears: p.loanTermYears,
      apr,
      // BDDK amortization table (first 6 + last 6 months for preview)
      schedule: this.buildAmortizationPreview(p.loanAmount, monthlyRate, monthlyPayment, months),
    }
  }

  private calculateIslamicFinance(p: {
    loanAmount: number
    loanTermYears: number
    profitRate: number
    ltvRatio: number
  }) {
    // Murabaha: flat profit share, no compounding
    const totalProfit = p.loanAmount * (p.profitRate / 100) * p.loanTermYears
    const totalPayment = p.loanAmount + totalProfit
    const months = p.loanTermYears * 12
    const monthlyPayment = totalPayment / months

    return {
      loanType: 'islamic',
      loanAmount: Math.round(p.loanAmount),
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalProfit: Math.round(totalProfit),
      ltvRatio: Math.round(p.ltvRatio * 10) / 10,
      profitRate: p.profitRate,
      loanTermYears: p.loanTermYears,
      schedule: [],
    }
  }

  private buildAmortizationPreview(
    principal: number,
    monthlyRate: number,
    monthlyPayment: number,
    totalMonths: number,
  ) {
    const preview: { month: number; payment: number; principal: number; interest: number; balance: number }[] = []
    let balance = principal
    const monthsToShow = [1, 2, 3, totalMonths - 2, totalMonths - 1, totalMonths].filter(m => m >= 1 && m <= totalMonths)

    for (let m = 1; m <= totalMonths; m++) {
      const interest = balance * monthlyRate
      const principalPaid = monthlyPayment - interest
      balance -= principalPaid
      if (monthsToShow.includes(m)) {
        preview.push({
          month: m,
          payment: Math.round(monthlyPayment),
          principal: Math.round(principalPaid),
          interest: Math.round(interest),
          balance: Math.max(0, Math.round(balance)),
        })
      }
    }
    return preview
  }

  // ── Mortgage Lead ─────────────────────────────────────────────────────────

  async saveMortgageLead(data: {
    listingId?: string
    userId?: string
    loanType: 'conventional' | 'islamic'
    propertyPrice: number
    downPayment: number
    loanAmount: number
    loanTermYears: number
    interestRate: number
    monthlyPayment: number
    ltvRatio: number
    contactName: string
    contactPhone: string
    contactEmail: string
    city?: string
    propertyType?: string
    isFirstHome: boolean
  }) {
    const lead = this.leads.create({ ...data })
    const saved = await this.leads.save(lead)

    // Tüm banka kullanıcılarına bildirim gönder
    this.notifyBankUsers(saved).catch(() => undefined)

    return saved
  }

  private async notifyBankUsers(lead: MortgageLead) {
    const banks = await this.ds.query(
      `SELECT u.email, u.full_name FROM users u WHERE u.role = 'bank' AND u.is_active = true LIMIT 20`,
    ) as { email: string; full_name: string }[]

    const listingTitle = lead.listingId
      ? (await this.ds.query(`SELECT title FROM listings WHERE id = $1`, [lead.listingId]))[0]?.title ?? 'İlan'
      : 'Genel Talep'

    await Promise.all(banks.map((b) =>
      this.mail.sendMortgageLead(b.email, b.full_name, {
        contactName: lead.contactName,
        contactPhone: lead.contactPhone,
        loanAmount: lead.loanAmount,
        loanTermYears: lead.loanTermYears,
        listingTitle,
        loanType: lead.loanType,
      }),
    ))
  }

  async getBankLeads(bankUserId: string, filters: {
    city?: string
    minLoan?: number
    maxLoan?: number
    status?: string
    page?: number
    limit?: number
  }) {
    const { city, minLoan, maxLoan, status, page = 1, limit = 20 } = filters

    const qb = this.leads.createQueryBuilder('l')
      .orderBy('l.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    if (city) qb.andWhere('l.city ILIKE :city', { city: `%${city}%` })
    if (status) qb.andWhere('l.status = :status', { status })
    if (minLoan) qb.andWhere('l.loanAmount >= :minLoan', { minLoan })
    if (maxLoan) qb.andWhere('l.loanAmount <= :maxLoan', { maxLoan })

    const [leads, total] = await qb.getManyAndCount()
    return {
      data: leads.map(l => this.maskLeadContact(l, bankUserId)),
      total,
      page,
      limit,
    }
  }

  private maskLeadContact(lead: MortgageLead, bankUserId: string) {
    // Only reveal contact if bank has claimed this lead
    const isClaimed = lead.bankUserId === bankUserId
    return {
      id: lead.id,
      loanType: lead.loanType,
      propertyPrice: lead.propertyPrice,
      downPayment: lead.downPayment,
      loanAmount: lead.loanAmount,
      loanTermYears: lead.loanTermYears,
      monthlyPayment: lead.monthlyPayment,
      ltvRatio: lead.ltvRatio,
      city: lead.city,
      propertyType: lead.propertyType,
      isFirstHome: lead.isFirstHome,
      status: lead.status,
      isClaimed,
      contactName: isClaimed ? lead.contactName : null,
      contactPhone: isClaimed ? lead.contactPhone : '***',
      contactEmail: isClaimed ? lead.contactEmail : '***',
      createdAt: lead.createdAt,
    }
  }

  async claimLead(leadId: string, bankUserId: string) {
    const lead = await this.leads.findOne({ where: { id: leadId } })
    if (!lead) throw new BadRequestException('Lead bulunamadı')
    if (lead.bankUserId && lead.bankUserId !== bankUserId) {
      throw new BadRequestException('Bu lead zaten başka bir banka tarafından talep edilmiş')
    }
    lead.bankUserId = bankUserId
    lead.status = 'contacted'
    return this.leads.save(lead)
  }

  async updateLeadStatus(leadId: string, bankUserId: string, status: string) {
    const lead = await this.leads.findOne({ where: { id: leadId, bankUserId } })
    if (!lead) throw new BadRequestException('Lead bulunamadı')
    lead.status = status as MortgageLead['status']
    return this.leads.save(lead)
  }

  // ── DASK Insurance Quote ──────────────────────────────────────────────────

  calculateDASK(input: {
    areaM2: number
    city: string
    constructionType: 'betonarme' | 'yigma' | 'hafif_celik' | 'wood'
    buildingAge: number
    floorCount?: number
  }) {
    const { areaM2, city, constructionType, buildingAge } = input

    const zone = DASK_ZONES[city] ?? 3
    const baseRate = DASK_BASE_RATE[zone] ?? 0.90
    const consFactor = CONSTRUCTION_FACTOR[constructionType] ?? 1.00
    const ageFactor = AGE_FACTOR(buildingAge)

    // DASK coverage (teminat bedeli): rebuilding cost ~₺25,000/m² average
    const rebuildCostPerM2 = 30_000
    const coverageAmount = areaM2 * rebuildCostPerM2

    // Annual premium
    const annualPremium = ((coverageAmount * baseRate) / 1000) * consFactor * ageFactor

    return {
      zone,
      coverageAmount: Math.round(coverageAmount),
      annualPremium: Math.round(annualPremium),
      monthlyPremium: Math.round(annualPremium / 12),
      breakdown: {
        baseRate,
        constructionFactor: consFactor,
        ageFactor: Math.round(ageFactor * 100) / 100,
        zoneLabel: `Deprem Risk Bölgesi ${zone}`,
      },
    }
  }

  calculateKonutSigortasi(input: {
    areaM2: number
    city: string
    buildingAge: number
    coverageType: 'basic' | 'comprehensive'
  }) {
    const { areaM2, buildingAge, coverageType } = input

    // Estimated home value for contents + structure coverage
    const homeValuePerM2 = 45_000
    const contentValue = areaM2 * homeValuePerM2 * 0.3

    const baseRate = coverageType === 'comprehensive' ? 1.8 : 1.2
    const ageFactor = AGE_FACTOR(buildingAge)
    const annualPremium = ((contentValue * baseRate) / 1000) * ageFactor

    return {
      coverageType,
      contentValue: Math.round(contentValue),
      annualPremium: Math.round(annualPremium),
      monthlyPremium: Math.round(annualPremium / 12),
    }
  }

  async saveInsuranceQuote(data: {
    listingId?: string
    userId?: string
    insuranceType: 'dask' | 'konut' | 'both'
    areaM2: number
    city: string
    district?: string
    constructionType: string
    buildingAge: number
    floorCount?: number
    daskPremium?: number
    konutPremium?: number
    daskCoverage?: number
    contactEmail?: string
  }) {
    const validUntil = new Date()
    validUntil.setDate(validUntil.getDate() + 30)
    const quote = this.quotes.create({ ...data, validUntil })
    return this.quotes.save(quote)
  }

  async getAgencyByUserId(userId: string): Promise<{ id: string }> {
    const rows = await this.ds.query(
      `SELECT id FROM agencies WHERE user_id = $1 LIMIT 1`, [userId],
    ) as { id: string }[]
    if (!rows[0]) throw new BadRequestException('Bu hesaba bağlı ajans bulunamadı.')
    return rows[0]
  }

  async getBankLeadStats(bankUserId: string) {
    const total = await this.leads.count()
    const claimed = await this.leads.count({ where: { bankUserId } })
    const qualified = await this.leads.count({ where: { bankUserId, status: 'qualified' } })
    const converted = await this.leads.count({ where: { bankUserId, status: 'converted' } })
    return { total, claimed, qualified, converted }
  }
}
