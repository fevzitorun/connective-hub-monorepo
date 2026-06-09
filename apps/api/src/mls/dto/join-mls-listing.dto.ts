import { IsUUID, IsOptional, IsString, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/**
 * POST /api/v1/mls/listings/:mlsListingId/join
 *
 * Bir emlakçı MLS havuzundaki ilana işbirlikçi olarak katılır.
 * Başvuru durumu PENDING olarak açılır; yetkili emlakçı onaylayana kadar
 * ilan bu emlakçının portföyünde görünmez.
 */
export class JoinMlsListingDto {

  @ApiPropertyOptional({
    description: 'Katılan emlakçının temsil ettiği agencies.id (varsa)',
  })
  @IsOptional()
  @IsUUID()
  collaboratorAgencyId?: string

  @ApiPropertyOptional({
    description: 'Müşteri referans notu (KVKK: ad soyad / telefon ilk 6 hane gibi kısmi bilgi)',
    example: 'Ahmet K. - 0532 *** ** 89 - 3+1 arıyor',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  clientRefNote?: string
}
