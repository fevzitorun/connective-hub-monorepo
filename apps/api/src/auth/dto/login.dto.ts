import { IsEmail, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ example: 'ahmet@example.com' })
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi girin' })
  email: string

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string
}

export class VerifyOtpDto {
  @ApiProperty({ example: '05321234567' })
  @IsString()
  phone: string

  @ApiProperty({ example: '123456' })
  @IsString()
  otp: string
}

export class SendOtpDto {
  @ApiProperty({ example: '05321234567' })
  @IsString()
  phone: string
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string
}
