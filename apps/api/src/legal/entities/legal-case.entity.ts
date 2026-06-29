import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Listing } from '../../listings/entities/listing.entity'

export type LegalCaseStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'cancelled'

@Entity('legal_cases')
export class LegalCase {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'listing_id', type: 'uuid' })
  listingId: string

  @ManyToOne(() => Listing, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listing_id' })
  listing: Listing

  @Column({ name: 'requester_id', type: 'uuid', nullable: true })
  requesterId: string

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'requester_id' })
  requester: User

  @Column({ name: 'lawyer_id', type: 'uuid', nullable: true })
  lawyerId: string

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'lawyer_id' })
  lawyer: User

  @Column({
    type: 'enum',
    enum: ['pending', 'under_review', 'approved', 'rejected', 'cancelled'],
    default: 'pending',
  })
  status: LegalCaseStatus

  @Column({ name: 'risk_score', type: 'smallint', nullable: true })
  riskScore: number

  @Column({ name: 'risk_notes', type: 'text', nullable: true })
  riskNotes: string

  @Column({ name: 'lawyer_notes', type: 'text', nullable: true })
  lawyerNotes: string

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fee: number

  @Column({ type: 'varchar', default: 'TRY' })
  currency: string

  @Column({ name: 'reviewed_at', type: 'timestamptz', nullable: true })
  reviewedAt: Date

  @OneToMany(() => LegalDocument, (doc) => doc.case, { cascade: ['insert'] })
  documents: LegalDocument[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}

export type DocType = 'tapu' | 'iskan' | 'ruhsat' | 'kadastro' | 'vekaletname' | 'dask' | 'ipotek' | 'other'

@Entity('legal_documents')
export class LegalDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'case_id', type: 'uuid' })
  caseId: string

  @ManyToOne(() => LegalCase, (c) => c.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'case_id' })
  case: LegalCase

  @Column({ name: 'uploader_id', type: 'uuid', nullable: true })
  uploaderId: string

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'uploader_id' })
  uploader: User

  @Column({
    name: 'doc_type',
    type: 'enum',
    enum: ['tapu', 'iskan', 'ruhsat', 'kadastro', 'vekaletname', 'dask', 'ipotek', 'other'],
  })
  docType: DocType

  @Column({ name: 'file_url', type: 'varchar' })
  fileUrl: string

  @Column({ name: 'r2_key', type: 'varchar' })
  r2Key: string

  @Column({ type: 'text', nullable: true })
  notes: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
