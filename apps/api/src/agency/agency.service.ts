import {
  Injectable, NotFoundException, ConflictException, ForbiddenException,
} from '@nestjs/common'
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { Agency, AgencyPlan } from '../users/entities/agency.entity'
import { Subscription, SubStatus } from './entities/subscription.entity'
import { UpdateAgencyDto } from './dto/update-agency.dto'

export interface DashboardStats {
  totalListings: number
  activeListings: number
  draftListings: number
  expiredListings: number
  totalViews: number
  totalWhatsappClicks: number
  plan: AgencyPlan
  subscription: Subscription | null
}

// Türkiye fiyatları (TRY/ay)
export const PLAN_PRICING: Record<AgencyPlan, { monthly: number; maxListings: number; features: string[] }> = {
  [AgencyPlan.FREE]: {
    monthly: 0,
    maxListings: 5,
    features: ['5 aktif ilan', 'WhatsApp deep link', 'Temel arama', 'CSV şablonu'],
  },
  [AgencyPlan.PRO]: {
    monthly: 499,
    maxListings: 100,
    features: ['100 aktif ilan', 'CSV toplu yükleme', 'FILTERRA.AI değerleme', 'Öncelikli listeleme', 'WhatsApp QR'],
  },
  [AgencyPlan.CORPORATE]: {
    monthly: 1499,
    maxListings: -1,  // Sınırsız
    features: ['Sınırsız ilan', 'Beyaz etiket subdomain', 'Tüm Pro özellikler', 'Öncelikli destek', 'API erişimi'],
  },
}

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(Agency)
    private readonly agencyRepo: Repository<Agency>,
    @InjectRepository(Subscription)
    private readonly subRepo: Repository<Subscription>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getProfile(userId: string): Promise<Agency> {
    const agency = await this.agencyRepo.findOne({ where: { userId } })
    if (!agency) throw new NotFoundException('Ajans profili bulunamadı')
    return agency
  }

  async updateProfile(userId: string, dto: UpdateAgencyDto): Promise<Agency> {
    const agency = await this.getProfile(userId)

    // Subdomain çakışması kontrolü
    if (dto.subdomain && dto.subdomain !== agency.subdomain) {
      const conflict = await this.agencyRepo.findOne({ where: { subdomain: dto.subdomain } })
      if (conflict) throw new ConflictException('Bu subdomain zaten kullanımda')
    }

    Object.assign(agency, dto)
    return this.agencyRepo.save(agency)
  }

  async getStats(userId: string): Promise<DashboardStats> {
    const agency = await this.getProfile(userId)

    const rows = await this.dataSource.query(
      `SELECT
         COUNT(*)::int                                            AS total_listings,
         COUNT(*) FILTER (WHERE status = 'active')::int          AS active_listings,
         COUNT(*) FILTER (WHERE status = 'draft')::int           AS draft_listings,
         COUNT(*) FILTER (WHERE status = 'expired')::int         AS expired_listings,
         COALESCE(SUM(view_count)::int, 0)                       AS total_views,
         COALESCE(SUM(whatsapp_clicks)::int, 0)                  AS total_whatsapp_clicks
       FROM listings
       WHERE agency_id = $1`,
      [agency.id]
    )

    const r = rows[0]

    const subscription = await this.subRepo.findOne({
      where: { agencyId: agency.id, status: SubStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    })

    return {
      totalListings: r.total_listings,
      activeListings: r.active_listings,
      draftListings: r.draft_listings,
      expiredListings: r.expired_listings,
      totalViews: r.total_views,
      totalWhatsappClicks: r.total_whatsapp_clicks,
      plan: agency.plan,
      subscription,
    }
  }

  async getMyListings(userId: string, page = 1, perPage = 20) {
    const agency = await this.getProfile(userId)

    const [data, total] = await this.dataSource
      .getRepository('Listing')
      .createQueryBuilder('l')
      .select(['l.id', 'l.title', 'l.status', 'l.price', 'l.currency', 'l.city', 'l.district',
               'l.listingType', 'l.propertyType', 'l.viewCount', 'l.whatsappClicks', 'l.createdAt', 'l.expiresAt'])
      .leftJoinAndSelect('l.photos', 'photos', 'photos.isCover = true')
      .where('l.agencyId = :agencyId', { agencyId: agency.id })
      .orderBy('l.createdAt', 'DESC')
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount()

    return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) }
  }

  async subscribe(userId: string, plan: AgencyPlan): Promise<Subscription> {
    const agency = await this.getProfile(userId)

    if (plan === AgencyPlan.FREE) {
      // Free'ye geçiş — mevcut aktif aboneliği iptal et
      await this.subRepo.update(
        { agencyId: agency.id, status: SubStatus.ACTIVE },
        { status: SubStatus.CANCELLED }
      )
      await this.agencyRepo.update(agency.id, { plan: AgencyPlan.FREE })
      return this.subRepo.create({
        agencyId: agency.id,
        plan: AgencyPlan.FREE,
        status: SubStatus.ACTIVE,
        amount: 0,
        startsAt: new Date(),
      })
    }

    // Pro/Corporate — Iyzico entegrasyonu burada başlayacak (Modül 10)
    // Şimdilik direkt kayıt (demo amaçlı)
    const endsAt = new Date()
    endsAt.setMonth(endsAt.getMonth() + 1)

    const pricing = PLAN_PRICING[plan]

    const sub = this.subRepo.create({
      agencyId: agency.id,
      plan,
      status: SubStatus.ACTIVE,
      amount: pricing.monthly,
      currency: 'TRY',
      startsAt: new Date(),
      endsAt,
    })

    await this.agencyRepo.update(agency.id, { plan })
    return this.subRepo.save(sub)
  }

  getPlanPricing() {
    return PLAN_PRICING
  }
}
