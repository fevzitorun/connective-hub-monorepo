import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToOne, JoinColumn,
} from 'typeorm'
import { User } from './user.entity'

export enum AgencyPlan {
  FREE      = 'free',
  PRO       = 'pro',
  CORPORATE = 'corporate',
}

@Entity('agencies')
export class Agency {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'user_id' })
  userId: string

  @Column({ name: 'company_name' })
  companyName: string

  @Column({ name: 'license_no', nullable: true })
  licenseNo: string

  @Column({ type: 'enum', enum: AgencyPlan, default: AgencyPlan.FREE })
  plan: AgencyPlan

  @Column({ nullable: true, unique: true })
  subdomain: string

  @Column({ name: 'logo_url', nullable: true })
  logoUrl: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: true })
  address: string

  @Column({ nullable: true })
  city: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
