import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { MlsStatus } from '../entities/mls-listing.entity'

/**
 * GET /api/v1/mls/pool
 *
 * Partner portalında "Havuzdaki Portföyler (MLS)" sekmesi için filtreler.
 * Yalnızca OPEN durumdaki ilanlar listelenir (varsayılan).
 */
export class MlsPoolFiltersDto {

  @ApiPropertyOptional({ enum: MlsStatus, default: MlsStatus.OPEN })
  @IsOptional()
  @IsEnum(MlsStatus)
  status?: MlsStatus

  @ApiPropertyOptional({ example: 'İstanbul' })
  @IsOptional()
  @IsString()
  city?: string

  @ApiPropertyOptional({ example: 'Kadıköy' })
  @IsOptional()
  @IsString()
  district?: string

  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number

  @ApiPropertyOptional({ example: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  perPage?: number
}
