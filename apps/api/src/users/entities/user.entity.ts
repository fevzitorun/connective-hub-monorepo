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
  BETA_USER    = 'beta_user',
  ADMIN        = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', unique: true })
  email: string

  @Column({ type: 'varchar', nullable: true, unique: true })
  phone: string

  @Column({ type: 'varchar', nullable: true, name: 'tc_kimlik' })
  tcKimlik: string

  @Column({ type: 'varchar' })
  password: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.BUYER })
  role: UserRole

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean

  @Column({ name: 'full_name', type: 'varchar', nullable: true })
  fullName: string

  @Column({ name: 'avatar_url', type: 'varchar', nullable: true })
  avatarUrl: string

  @Column({ name: 'refresh_token_hash', type: 'varchar', nullable: true })
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
