import {
  IsUUID, IsEnum, IsNumber, IsOptional, IsString,
  IsInt, Min, Max, MinLength, MaxLength, IsDateString,
  ValidateIf,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CommissionType } from '../entities/mls-listing.entity'

/**
 * POST /api/v1/mls/listings
 *
 * Yetkili emlakçı bir ilanı MLS havuzuna açar.
 * Komisyon yapısı (tip + toplam değer + pay dağılımı) zorunludur.
 */
export class CreateMlsListingDto {

  @ApiProperty({
    description: 'Paylaşıma açılacak listings.id',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsUUID()
  listingId: string

  // ── Komisyon ──────────────────────────────────────────────────────────────

  @ApiProperty({ enum: CommissionType, default: CommissionType.PERCENTAGE })
  @IsEnum(CommissionType)
  commissionType: CommissionType

  /**
   * PERCENTAGE modunda: 0-100 arasında yüzde değeri (ör. 3.5 = %3.5)
   * FIXED_TRY modunda: TL tutarı (ör. 50000)
   */
  @ApiProperty({
    example: 3.5,
    description: 'Komisyon tipi PERCENTAGE ise yüzde, FIXED_TRY ise TL tutarı',
  })
  @IsNumber()
  @Min(0)
  @ValidateIf((o) => o.commissionType === CommissionType.PERCENTAGE, { each: false })
  @Max(100, { message: 'Yüzde bazlı komisyon 100\'ü geçemez' })
  @Type(() => Number)
  totalCommissionValue: number

  @ApiProperty({
    example: 50,
    description: 'Yetkili emlakçının alacağı komisyon payı (%). Kalan işbirlikçiye gider.',
  })
  @IsInt()
  @Min(0)
  @Max(100)
  authorizedAgentShare: number

  // ── Kısıtlar ──────────────────────────────────────────────────────────────

  @ApiPropertyOptional({
    example: 'İstanbul',
    description: 'NULL → Türkiye geneli, dolu → sadece o şehirden emlakçılar katılabilir',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  regionFilter?: string

  @ApiPropertyOptional({ example: 5, description: 'Maksimum işbirlikçi sayısı' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  maxCollaborators?: number

  @ApiPropertyOptional({ description: 'Son başvuru tarihi (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string

  @ApiPropertyOptional({
    description: 'İşbirlikçiler için not / özel koşullar',
    example: 'Yalnızca kurumsal müşteri getirecek ajanslar başvurabilir.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  agentNotes?: string
}
