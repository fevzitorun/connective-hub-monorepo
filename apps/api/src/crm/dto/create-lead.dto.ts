import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsPhoneNumber,
  IsUUID,
  IsNumber,
  IsPositive,
  IsBoolean,
  MaxLength,
  IsDateString,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LeadSource, LeadStatus, LeadType, LeadPriority } from '../entities/lead.entity'
import { Transform } from 'class-transformer'

export class CreateLeadDto {
  // ─── Müşteri Bilgileri ────────────────────────────────────────────────

  @ApiProperty({ example: 'Ahmet' })
  @IsString()
  @MaxLength(100)
  firstName: string

  @ApiProperty({ example: 'Yılmaz' })
  @IsString()
  @MaxLength(100)
  lastName: string

  @ApiPropertyOptional({ example: '+905321234567' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string

  @ApiPropertyOptional({ example: 'ahmet@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string

  // ─── CRM Durumu ──────────────────────────────────────────────────────

  @ApiPropertyOptional({ enum: LeadSource, default: LeadSource.WEBSITE })
  @IsOptional()
  @IsEnum(LeadSource)
  source?: LeadSource

  @ApiPropertyOptional({ enum: LeadType, default: LeadType.BUYER })
  @IsOptional()
  @IsEnum(LeadType)
  type?: LeadType

  @ApiPropertyOptional({ enum: LeadPriority, default: LeadPriority.MEDIUM })
  @IsOptional()
  @IsEnum(LeadPriority)
  priority?: LeadPriority

  // ─── Mülk Kriterleri ─────────────────────────────────────────────────

  @ApiPropertyOptional({ description: 'Direkt bağlanacak ilan UUID' })
  @IsOptional()
  @IsUUID()
  listingId?: string

  @ApiPropertyOptional({ example: 'İstanbul' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  preferredCity?: string

  @ApiPropertyOptional({ example: 'Kadıköy' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  preferredDistrict?: string

  @ApiPropertyOptional({ example: 1500000 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  budgetMin?: number

  @ApiPropertyOptional({ example: 3000000 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  budgetMax?: number

  @ApiPropertyOptional({ example: 80 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  sizeMinM2?: number

  @ApiPropertyOptional({ example: 150 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  sizeMaxM2?: number

  @ApiPropertyOptional({ example: '2+1, 3+1' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  roomPreference?: string

  // ─── Takip ───────────────────────────────────────────────────────────

  @ApiPropertyOptional({ example: '2026-06-15T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  nextFollowUpAt?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string

  @ApiPropertyOptional({ description: 'Sorumlu danışman UUID (atamak için)' })
  @IsOptional()
  @IsUUID()
  assignedAgentId?: string

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  kvkkConsent?: boolean
}
