import { IsOptional, IsString, MaxLength, Matches } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateAgencyDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(255)
  companyName?: string

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100)
  licenseNo?: string

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20)
  phone?: string

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500)
  address?: string

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100)
  city?: string

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(2000)
  description?: string

  @ApiPropertyOptional({ description: 'Subdomain — sadece harf, rakam ve tire' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/, { message: 'Subdomain sadece küçük harf, rakam ve tire içerebilir' })
  subdomain?: string
}
