import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('agency_branding')
export class AgencyBranding {
  @PrimaryGeneratedColumn('uuid') id: string

  @Column({ name: 'agency_id', type: 'uuid', unique: true }) agencyId: string

  @Column({ name: 'logo_url', nullable: true, type: 'text' }) logoUrl: string | null
  @Column({ name: 'logo_r2_key', nullable: true, type: 'text' }) logoR2Key: string | null
  @Column({ name: 'favicon_url', nullable: true, type: 'text' }) faviconUrl: string | null

  @Column({ name: 'primary_color', length: 7, default: '#1B3A4B' }) primaryColor: string
  @Column({ name: 'secondary_color', length: 7, default: '#C9A84C' }) secondaryColor: string
  @Column({ name: 'font_family', length: 100, default: 'Inter' }) fontFamily: string

  @Column({ name: 'hero_title', length: 255, nullable: true }) heroTitle: string | null
  @Column({ name: 'hero_subtitle', type: 'text', nullable: true }) heroSubtitle: string | null
  @Column({ name: 'about_text', type: 'text', nullable: true }) aboutText: string | null

  @Column({ name: 'contact_phone', length: 20, nullable: true }) contactPhone: string | null
  @Column({ name: 'contact_email', length: 255, nullable: true }) contactEmail: string | null
  @Column({ name: 'contact_address', type: 'text', nullable: true }) contactAddress: string | null

  @Column({ name: 'instagram_url', type: 'text', nullable: true }) instagramUrl: string | null
  @Column({ name: 'facebook_url', type: 'text', nullable: true }) facebookUrl: string | null
  @Column({ name: 'twitter_url', type: 'text', nullable: true }) twitterUrl: string | null
  @Column({ name: 'linkedin_url', type: 'text', nullable: true }) linkedinUrl: string | null
  @Column({ name: 'youtube_url', type: 'text', nullable: true }) youtubeUrl: string | null

  @Column({ name: 'custom_css', type: 'text', nullable: true }) customCss: string | null
  @Column({ name: 'seo_title', length: 255, nullable: true }) seoTitle: string | null
  @Column({ name: 'seo_description', type: 'text', nullable: true }) seoDescription: string | null

  @Column({ name: 'custom_domain', length: 255, nullable: true }) customDomain: string | null
  @Column({ name: 'domain_verified', type: 'boolean', default: false }) domainVerified: boolean
  @Column({ name: 'domain_verify_token', length: 64, nullable: true }) domainVerifyToken: string | null

  @Column({ name: 'show_7fil_badge', type: 'boolean', default: true }) show7filBadge: boolean
  @Column({ name: 'listings_per_page', type: 'smallint', default: 12 }) listingsPerPage: number

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date
}
