import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { IsString, IsEmail, IsOptional, IsBoolean, IsIn, MaxLength } from 'class-validator'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

class PublicLeadDto {
  @IsString() @MaxLength(200)
  fullName: string

  @IsOptional() @IsEmail()
  email?: string

  @IsOptional() @IsString() @MaxLength(30)
  phone?: string

  @IsOptional() @IsIn(['buyer', 'seller', 'agency'])
  leadType?: string

  @IsOptional() @IsString() @MaxLength(100)
  city?: string

  @IsOptional() @IsString() @MaxLength(1000)
  notes?: string

  @IsOptional() @IsBoolean()
  kvkkConsent?: boolean

  @IsOptional() @IsString() @MaxLength(100)
  utmSource?: string
}

@ApiTags('public')
@Controller('public')
export class PublicController {
  constructor(@InjectDataSource() private ds: DataSource) {}

  @Post('leads')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Landing page lead kaydı — kimlik doğrulama gerektirmez' })
  async createPublicLead(@Body() dto: PublicLeadDto) {
    await this.ds.query(
      `INSERT INTO public_leads (full_name, email, phone, lead_type, city, notes, kvkk_consent, utm_source)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        dto.fullName,
        dto.email ?? null,
        dto.phone ?? null,
        dto.leadType ?? 'buyer',
        dto.city ?? null,
        dto.notes ?? null,
        dto.kvkkConsent ?? false,
        dto.utmSource ?? null,
      ],
    )
    return { success: true }
  }
}
