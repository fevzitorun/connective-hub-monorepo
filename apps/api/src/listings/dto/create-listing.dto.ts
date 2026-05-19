import {
  IsString, IsEnum, IsOptional, IsNumber, IsBoolean,
  Min, Max, MinLength, MaxLength, IsIn,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PropertyType, ListingType } from '../entities/listing.entity'

export class CreateListingDto {
  @ApiProperty({ example: 'Kadıköy\'de 3+1 Deniz Manzaralı Daire' })
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  title: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string

  @ApiPropertyOptional({ example: 4500000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price?: number

  @ApiPropertyOptional({ enum: ['TRY', 'USD', 'EUR', 'GBP'], default: 'TRY' })
  @IsOptional()
  @IsIn(['TRY', 'USD', 'EUR', 'GBP'])
  currency?: string

  @ApiProperty({ enum: PropertyType })
  @IsEnum(PropertyType)
  propertyType: PropertyType

  @ApiProperty({ enum: ListingType })
  @IsEnum(ListingType)
  listingType: ListingType

  @ApiPropertyOptional({ example: 'apartment' })
  @IsOptional()
  @IsString()
  category?: string

  // Konum
  @ApiProperty({ example: 'İstanbul' })
  @IsString()
  city: string

  @ApiPropertyOptional({ example: 'Kadıköy' })
  @IsOptional()
  @IsString()
  district?: string

  @ApiPropertyOptional({ example: 'Moda' })
  @IsOptional()
  @IsString()
  neighborhood?: string

  @ApiPropertyOptional({ example: 'Moda Caddesi No:12' })
  @IsOptional()
  @IsString()
  addressText?: string

  @ApiPropertyOptional({ example: 40.9877 })
  @IsOptional()
  @IsNumber()
  @Min(-90) @Max(90)
  @Type(() => Number)
  lat?: number

  @ApiPropertyOptional({ example: 29.0225 })
  @IsOptional()
  @IsNumber()
  @Min(-180) @Max(180)
  @Type(() => Number)
  lng?: number

  // Özellikler
  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  areaM2?: number

  @ApiPropertyOptional({ example: '3+1' })
  @IsOptional()
  @IsIn(['stüdyo', '1+0', '1+1', '2+1', '3+1', '4+1', '5+1', '5+'])
  roomCount?: string

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  floorNo?: number

  @ApiPropertyOptional({ example: 8 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalFloors?: number

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  buildingAge?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFurnished?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasParking?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasElevator?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasBalcony?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasGarden?: boolean

  // WhatsApp — agent'ın telefon numarası
  @ApiPropertyOptional({ example: '05321234567' })
  @IsOptional()
  @IsString()
  agentPhone?: string
}
