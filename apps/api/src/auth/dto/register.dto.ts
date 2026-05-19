import { IsEmail, IsString, MinLength, IsOptional, Matches, IsEnum } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { UserRole } from '../../users/entities/user.entity'

export class RegisterDto {
  @ApiProperty({ example: 'ahmet@example.com' })
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi girin' })
  email: string

  @ApiProperty({ example: 'Güçlü1Şifre!' })
  @IsString()
  @MinLength(8, { message: 'Şifre en az 8 karakter olmalıdır' })
  password: string

  @ApiPropertyOptional({ example: '05321234567' })
  @IsOptional()
  @Matches(/^(05)[0-9]{9}$/, { message: 'Geçerli bir Türk telefon numarası girin (05XX...)' })
  phone?: string

  @ApiPropertyOptional({ example: 'Ahmet Yılmaz' })
  @IsOptional()
  @IsString()
  fullName?: string

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.BUYER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole
}
