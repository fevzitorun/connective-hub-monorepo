import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'

@Entity('mortgage_leads')
export class MortgageLead {
  @PrimaryGeneratedColumn('uuid') id: string

  @Column({ name: 'listing_id', type: 'uuid', nullable: true }) listingId: string | null
  @Column({ name: 'user_id', type: 'uuid', nullable: true }) userId: string | null
  @Column({ name: 'bank_user_id', type: 'uuid', nullable: true }) bankUserId: string | null

  @Column({ name: 'loan_type', type: 'enum', enum: ['conventional', 'islamic'], default: 'conventional' })
  loanType: 'conventional' | 'islamic'

  @Column({ name: 'property_price', type: 'decimal', precision: 14, scale: 2 })
  propertyPrice: number

  @Column({ name: 'down_payment', type: 'decimal', precision: 14, scale: 2 })
  downPayment: number

  @Column({ name: 'loan_amount', type: 'decimal', precision: 14, scale: 2 })
  loanAmount: number

  @Column({ name: 'loan_term_years', type: 'smallint' }) loanTermYears: number
  @Column({ name: 'interest_rate', type: 'decimal', precision: 5, scale: 2, nullable: true }) interestRate: number | null
  @Column({ name: 'monthly_payment', type: 'decimal', precision: 10, scale: 2, nullable: true }) monthlyPayment: number | null
  @Column({ name: 'ltv_ratio', type: 'decimal', precision: 5, scale: 2, nullable: true }) ltvRatio: number | null

  @Column({ type: 'enum', enum: ['new', 'contacted', 'qualified', 'rejected', 'converted'], default: 'new' })
  status: 'new' | 'contacted' | 'qualified' | 'rejected' | 'converted'

  @Column({ name: 'contact_name', type: 'varchar', nullable: true }) contactName: string | null
  @Column({ name: 'contact_phone', type: 'varchar', nullable: true }) contactPhone: string | null
  @Column({ name: 'contact_email', type: 'varchar', nullable: true }) contactEmail: string | null
  @Column({ type: 'varchar', nullable: true }) city: string | null

  @Column({ name: 'property_type', type: 'enum', enum: ['residential', 'commercial', 'land', 'industrial'], nullable: true })
  propertyType: string | null

  @Column({ name: 'is_first_home', default: true }) isFirstHome: boolean
  @Column({ nullable: true, type: 'text' }) notes: string | null

  @ManyToOne(() => User, { nullable: true }) @JoinColumn({ name: 'user_id' }) user: User
  @ManyToOne(() => User, { nullable: true }) @JoinColumn({ name: 'bank_user_id' }) bankUser: User

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date
}
