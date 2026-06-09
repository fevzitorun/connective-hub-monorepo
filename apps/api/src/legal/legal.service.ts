import {
  Injectable, NotFoundException, ForbiddenException, ConflictException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, IsNull } from 'typeorm'
import { createHash } from 'crypto'
import { LegalCase, LegalDocument } from './entities/legal-case.entity'
import { PropertyCertificate } from './entities/property-certificate.entity'
import { UserRole } from '../users/entities/user.entity'
import {
  CreateCaseDto, AssignLawyerDto, SubmitReviewDto,
  AddDocumentDto, RevokeCertificateDto,
} from './dto/legal.dto'

@Injectable()
export class LegalService {
  constructor(
    @InjectRepository(LegalCase) private caseRepo: Repository<LegalCase>,
    @InjectRepository(LegalDocument) private docRepo: Repository<LegalDocument>,
    @InjectRepository(PropertyCertificate) private certRepo: Repository<PropertyCertificate>,
  ) {}

  // ── Cases ─────────────────────────────────────────────────────────────────

  async createCase(requesterId: string, dto: CreateCaseDto): Promise<LegalCase> {
    // Prevent duplicate open cases for same listing+requester
    const existing = await this.caseRepo.findOne({
      where: { listingId: dto.listingId, requesterId, status: 'pending' },
    })
    if (existing) throw new ConflictException('Bu ilan için zaten açık bir hukuki inceleme talebiniz var.')

    const c = this.caseRepo.create({
      listingId: dto.listingId,
      requesterId,
    })
    return this.caseRepo.save(c)
  }

  async getCasesForLawyer(lawyerId: string) {
    return this.caseRepo.find({
      where: { lawyerId },
      relations: ['listing', 'requester', 'documents'],
      order: { createdAt: 'DESC' },
    })
  }

  async getPendingCases() {
    return this.caseRepo.find({
      where: { status: 'pending', lawyerId: IsNull() },
      relations: ['listing', 'requester'],
      order: { createdAt: 'ASC' },
    })
  }

  async getMyCases(requesterId: string) {
    return this.caseRepo.find({
      where: { requesterId },
      relations: ['listing', 'lawyer', 'documents'],
      order: { createdAt: 'DESC' },
    })
  }

  async getCaseDetail(caseId: string, userId: string, userRole: UserRole) {
    const c = await this.caseRepo.findOne({
      where: { id: caseId },
      relations: ['listing', 'requester', 'lawyer', 'documents'],
    })
    if (!c) throw new NotFoundException('Dava bulunamadı.')

    const isLawyer = userRole === UserRole.LAWYER || userRole === UserRole.ADMIN
    const isRequester = c.requesterId === userId
    if (!isLawyer && !isRequester) throw new ForbiddenException()

    return c
  }

  async assignLawyer(caseId: string, dto: AssignLawyerDto): Promise<LegalCase> {
    const c = await this.caseRepo.findOneBy({ id: caseId })
    if (!c) throw new NotFoundException()
    c.lawyerId = dto.lawyerId
    c.status = 'under_review'
    return this.caseRepo.save(c)
  }

  async submitReview(caseId: string, lawyerId: string, dto: SubmitReviewDto): Promise<LegalCase> {
    const c = await this.caseRepo.findOneBy({ id: caseId })
    if (!c) throw new NotFoundException()
    if (c.lawyerId !== lawyerId) throw new ForbiddenException('Bu dava size atanmamış.')

    c.status = dto.verdict === 'approved' ? 'approved' : 'rejected'
    c.riskScore = dto.riskScore
    c.riskNotes = dto.riskNotes
    c.lawyerNotes = dto.lawyerNotes ?? null
    c.fee = dto.fee ?? null
    c.reviewedAt = new Date()
    return this.caseRepo.save(c)
  }

  async addDocument(caseId: string, uploaderId: string, dto: AddDocumentDto): Promise<LegalDocument> {
    const c = await this.caseRepo.findOneBy({ id: caseId })
    if (!c) throw new NotFoundException()

    const doc = this.docRepo.create({ caseId, uploaderId, ...dto })
    return this.docRepo.save(doc)
  }

  async cancelCase(caseId: string, requesterId: string): Promise<void> {
    const c = await this.caseRepo.findOneBy({ id: caseId })
    if (!c) throw new NotFoundException()
    if (c.requesterId !== requesterId) throw new ForbiddenException()
    if (c.status === 'under_review' || c.status === 'approved') {
      throw new ForbiddenException('İnceleme aşamasındaki dava iptal edilemez.')
    }
    await this.caseRepo.update(caseId, { status: 'cancelled' })
  }

  // ── Certificates ──────────────────────────────────────────────────────────

  async issueCertificate(caseId: string, lawyerId: string): Promise<PropertyCertificate> {
    const c = await this.caseRepo.findOneBy({ id: caseId })
    if (!c) throw new NotFoundException()
    if (c.status !== 'approved') {
      throw new ForbiddenException('Sertifika yalnızca onaylanmış davalar için düzenlenebilir.')
    }

    // Check if active cert already exists
    const existing = await this.certRepo.findOne({
      where: { listingId: c.listingId, status: 'issued' },
    })
    if (existing) throw new ConflictException('Bu ilan için aktif sertifika zaten mevcut.')

    const validUntil = new Date()
    validUntil.setFullYear(validUntil.getFullYear() + 1)

    const certHash = this.generateCertHash(c.listingId, caseId, lawyerId, validUntil)

    const cert = this.certRepo.create({
      listingId: c.listingId,
      caseId,
      issuedBy: lawyerId,
      certHash,
      status: 'issued',
      validUntil,
    })
    return this.certRepo.save(cert)
  }

  async verifyCertificate(certHash: string) {
    const cert = await this.certRepo.findOne({
      where: { certHash },
      relations: ['listing', 'issuedByUser'],
    })
    if (!cert) return { valid: false, reason: 'Sertifika bulunamadı.' }
    if (cert.status === 'revoked') return { valid: false, reason: 'Sertifika iptal edilmiş.' }
    if (cert.status === 'expired') return { valid: false, reason: 'Sertifika süresi dolmuş.' }
    if (cert.validUntil && cert.validUntil < new Date()) {
      await this.certRepo.update(cert.id, { status: 'expired' })
      return { valid: false, reason: 'Sertifika süresi dolmuş.' }
    }

    return {
      valid: true,
      certId: cert.id,
      listingId: cert.listingId,
      listingTitle: cert.listing?.title,
      issuedAt: cert.issuedAt,
      validUntil: cert.validUntil,
      issuedBy: cert.issuedByUser?.fullName ?? 'Avukat',
    }
  }

  async getListingCertificate(listingId: string) {
    return this.certRepo.findOne({
      where: { listingId, status: 'issued' },
      relations: ['issuedByUser'],
    })
  }

  async revokeCertificate(certId: string, dto: RevokeCertificateDto): Promise<void> {
    const cert = await this.certRepo.findOneBy({ id: certId })
    if (!cert) throw new NotFoundException()
    await this.certRepo.update(certId, { status: 'revoked', revokeReason: dto.reason })
  }

  // ── Lawyer stats ─────────────────────────────────────────────────────────

  async getLawyerStats(lawyerId: string) {
    const [total, pending, approved, rejected, certs] = await Promise.all([
      this.caseRepo.count({ where: { lawyerId } }),
      this.caseRepo.count({ where: { lawyerId, status: 'under_review' } }),
      this.caseRepo.count({ where: { lawyerId, status: 'approved' } }),
      this.caseRepo.count({ where: { lawyerId, status: 'rejected' } }),
      this.certRepo.count({ where: { issuedBy: lawyerId } }),
    ])
    return { total, pending, approved, rejected, certsIssued: certs }
  }

  private generateCertHash(listingId: string, caseId: string, lawyerId: string, validUntil: Date): string {
    const data = `${listingId}:${caseId}:${lawyerId}:${validUntil.toISOString()}`
    return createHash('sha256').update(data).digest('hex')
  }
}
