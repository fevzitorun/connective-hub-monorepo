import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User, UserRole } from './entities/user.entity'
import { Agency } from './entities/agency.entity'
import { KvkkAuditLog } from './entities/kvkk-audit.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Agency)
    private readonly agencyRepo: Repository<Agency>,
    @InjectRepository(KvkkAuditLog)
    private readonly auditRepo: Repository<KvkkAuditLog>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id, isActive: true } })
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı')
    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } })
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { phone } })
  }

  async create(data: {
    email: string
    password: string
    phone?: string
    fullName?: string
    role?: UserRole
  }): Promise<User> {
    const existing = await this.findByEmail(data.email)
    if (existing) throw new ConflictException('Bu e-posta adresi zaten kayıtlı')

    if (data.phone) {
      const existingPhone = await this.findByPhone(data.phone)
      if (existingPhone) throw new ConflictException('Bu telefon numarası zaten kayıtlı')
    }

    const user = this.userRepo.create({
      ...data,
      role: data.role ?? UserRole.BUYER,
    })
    return this.userRepo.save(user)
  }

  async updateRefreshToken(userId: string, hash: string | null): Promise<void> {
    await this.userRepo.update(userId, { refreshTokenHash: hash })
  }

  async markVerified(userId: string): Promise<void> {
    await this.userRepo.update(userId, { isVerified: true })
  }

  async createAgency(userId: string, companyName: string): Promise<Agency> {
    const agency = this.agencyRepo.create({ userId, companyName })
    return this.agencyRepo.save(agency)
  }

  async findAgencyByUserId(userId: string): Promise<Agency | null> {
    return this.agencyRepo.findOne({ where: { userId } })
  }

  async audit(data: {
    userId?: string
    action: string
    resource?: string
    ipAddress?: string
    userAgent?: string
  }): Promise<void> {
    const log = this.auditRepo.create(data)
    await this.auditRepo.save(log)
  }
}
