import { PartialType } from '@nestjs/swagger'
import { IsOptional, IsEnum, IsString, MaxLength, IsNumber, IsPositive, IsDateString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { CreateLeadDto } from './create-lead.dto'
import { LeadStatus, LeadPriority } from '../entities/lead.entity'

export class UpdateLeadDto extends PartialType(CreateLeadDto) {
  @ApiPropertyOptional({ enum: LeadStatus })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus

  @ApiPropertyOptional({ enum: LeadPriority })
  @IsOptional()
  @IsEnum(LeadPriority)
  priority?: LeadPriority

  @ApiPropertyOptional({ example: 2500000, description: 'Kazanılan deal değeri (won)' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  dealValueTry?: number

  @ApiPropertyOptional({ example: 'Bütçe uyuşmadı', description: 'Kaybedilme sebebi (lost)' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  lostReason?: string
}
