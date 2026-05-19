import { IsOptional, IsEnum, IsNumber, IsString, IsBoolean, Min, Max } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { PropertyType, ListingType } from '../entities/listing.entity'

export class ListingFiltersDto {
  @ApiPropertyOptional() @IsOptional() @IsString()
  city?: string

  @ApiPropertyOptional() @IsOptional() @IsString()
  district?: string

  @ApiPropertyOptional() @IsOptional() @IsString()
  neighborhood?: string

  @ApiPropertyOptional({ enum: PropertyType })
  @IsOptional() @IsEnum(PropertyType)
  propertyType?: PropertyType

  @ApiPropertyOptional({ enum: ListingType })
  @IsOptional() @IsEnum(ListingType)
  listingType?: ListingType

  @ApiPropertyOptional() @IsOptional() @IsString()
  category?: string

  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) @Type(() => Number)
  priceMin?: number

  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) @Type(() => Number)
  priceMax?: number

  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) @Type(() => Number)
  areaMin?: number

  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) @Type(() => Number)
  areaMax?: number

  @ApiPropertyOptional({ example: '3+1' })
  @IsOptional() @IsString()
  roomCount?: string

  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number)
  buildingAgeMax?: number

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  hasParking?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  hasElevator?: boolean

  // Coğrafi arama
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(-90) @Max(90) @Type(() => Number)
  lat?: number

  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(-180) @Max(180) @Type(() => Number)
  lng?: number

  @ApiPropertyOptional({ description: 'Yarıçap (km)', default: 5 })
  @IsOptional() @IsNumber() @Min(0.5) @Max(50) @Type(() => Number)
  radiusKm?: number

  // Sayfalama
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @IsNumber() @Min(1) @Type(() => Number)
  page?: number

  @ApiPropertyOptional({ default: 20 }) @IsOptional() @IsNumber() @Min(1) @Max(100) @Type(() => Number)
  perPage?: number

  // Sıralama
  @ApiPropertyOptional({ enum: ['price_asc', 'price_desc', 'date_desc', 'area_asc'] })
  @IsOptional() @IsString()
  sortBy?: string
}
