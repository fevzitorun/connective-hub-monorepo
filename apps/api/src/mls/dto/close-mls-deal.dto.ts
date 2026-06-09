import { IsUUID, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/**
 * POST /api/v1/mls/listings/:mlsListingId/close
 *
 * Yetkili emlakçı işlemi tamamlar:
 * - MLS ilanı CLOSED durumuna geçer
 * - Hangi işbirlikçinin müşteriyi getirdiği belirtilir
 * - Gerçekleşen satış/kira tutarı girilir → komisyon otomatik hesaplanır
 * - MlsCommissionSplit kayıtları CALCULATED durumuyla oluşturulur
 */
export class CloseMlsDealDto {

  @ApiProperty({
    description: 'Müşteriyi getiren işbirlikçi mls_collaborations.id\'si',
  })
  @IsUUID()
  collaborationId: string

  @ApiProperty({
    example: 4500000,
    description: 'Gerçekleşen satış veya yıllık kira tutarı (TRY). Komisyon bu tutardan hesaplanır.',
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  finalPriceTry: number

  @ApiPropertyOptional({
    description: 'Ek açıklama veya işlem referans numarası',
    example: 'Tapu tarihi: 24.05.2026 — Kadıköy Tapu Müd.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  dealNote?: string
}
