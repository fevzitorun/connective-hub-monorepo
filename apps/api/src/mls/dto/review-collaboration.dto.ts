import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export enum ReviewAction {
  APPROVE = 'approve',
  REJECT  = 'reject',
}

/**
 * PATCH /api/v1/mls/collaborations/:collaborationId/review
 *
 * Yetkili emlakçı bir işbirlikçi başvurusunu onaylar veya reddeder.
 */
export class ReviewCollaborationDto {

  @ApiProperty({ enum: ReviewAction, description: 'approve veya reject' })
  @IsEnum(ReviewAction)
  action: ReviewAction

  @ApiPropertyOptional({ description: 'Red gerekçesi (reddedilince zorunlu değil ama önerilir)' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string
}
