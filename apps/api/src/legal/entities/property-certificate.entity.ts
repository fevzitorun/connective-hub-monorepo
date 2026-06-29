import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Listing } from '../../listings/entities/listing.entity'
import { LegalCase } from './legal-case.entity'

export type CertStatus = 'issued' | 'expired' | 'revoked' | 'pending'

@Entity('property_certificates')
export class PropertyCertificate {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'listing_id', type: 'uuid' })
  listingId: string

  @ManyToOne(() => Listing, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listing_id' })
  listing: Listing

  @Column({ name: 'case_id', type: 'uuid', nullable: true })
  caseId: string

  @ManyToOne(() => LegalCase, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'case_id' })
  case: LegalCase

  @Column({ name: 'issued_by', type: 'uuid', nullable: true })
  issuedBy: string

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'issued_by' })
  issuedByUser: User

  @Column({ name: 'cert_hash', length: 64, unique: true })
  certHash: string

  @Column({
    type: 'enum',
    enum: ['issued', 'expired', 'revoked', 'pending'],
    default: 'issued',
  })
  status: CertStatus

  @Column({ name: 'valid_until', type: 'timestamptz', nullable: true })
  validUntil: Date

  @Column({ name: 'revoke_reason', type: 'varchar', nullable: true })
  revokeReason: string

  @CreateDateColumn({ name: 'issued_at' })
  issuedAt: Date
}
