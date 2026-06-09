import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToOne, BeforeInsert, BeforeUpdate,
} from 'typeorm'
import * as bcrypt from 'bcryptjs'

export enum UserRole {
  BUYER        = 'buyer',
  AGENCY       = 'agency',
  AGENT_PERSON = 'agent_person',
  LAWYER       = 'lawyer',
  BANK         = 'bank',
  INSURER      = 'insurer',
  PARTNER      = 'partner',
  ADMIN        = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  email: string

  @Column({ nullable: true, unique: true })
  phone: string

  @Column({ nullable: true, name: 'tc_kimlik' })
  tcKimlik: string

  @Column()
  password: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.BUYER })
  role: UserRole

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @Column({ name: 'full_name', nullable: true })
  fullName: string

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string

  // Refresh token hash — güvenli saklama
  @Column({ name: 'refresh_token_hash', nullable: true })
  refreshTokenHash: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Sadece düz metin şifre varsa hash'le
    if (this.password && !this.password.startsWith('$2')) {
      this.password = await bcrypt.hash(this.password, 12)
    }
  }

  async validatePassword(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.password)
  }
}
