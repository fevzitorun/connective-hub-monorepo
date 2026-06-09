import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ActivityType } from '../entities/lead.entity'

export class AddActivityDto {
  @ApiProperty({ enum: ActivityType, example: ActivityType.CALL })
  @IsEnum(ActivityType)
  type: ActivityType

  @ApiPropertyOptional({ example: 'Müşteriyi aradım, yarın gezme randevusu aldık.' })
  @IsOptional()
  @IsString()
  body?: string

  @ApiPropertyOptional({ description: 'Serbest meta veri (JSON)', example: { duration_min: 5 } })
  @IsOptional()
  meta?: Record<string, unknown>
}
