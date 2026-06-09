import { IsOptional, IsEnum, IsString, IsInt, Min, Max, IsUUID } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { LeadStatus, LeadSource, LeadType, LeadPriority } from '../entities/lead.entity'

export class LeadFiltersDto {
  @ApiPropertyOptional({ enum: LeadStatus })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus

  @ApiPropertyOptional({ enum: LeadSource })
  @IsOptional()
  @IsEnum(LeadSource)
  source?: LeadSource

  @ApiPropertyOptional({ enum: LeadType })
  @IsOptional()
  @IsEnum(LeadType)
  type?: LeadType

  @ApiPropertyOptional({ enum: LeadPriority })
  @IsOptional()
  @IsEnum(LeadPriority)
  priority?: LeadPriority

  @ApiPropertyOptional({ description: 'Sorumlu danışman UUID' })
  @IsOptional()
  @IsUUID()
  assignedAgentId?: string

  @ApiPropertyOptional({ example: 'İstanbul' })
  @IsOptional()
  @IsString()
  city?: string

  /** Full-text search: isim, telefon, email */
  @ApiPropertyOptional({ example: 'Ahmet' })
  @IsOptional()
  @IsString()
  q?: string

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ default: 25, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  perPage?: number = 25
}
