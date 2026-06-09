import {
  Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Req, Version,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto, VerifyOtpDto, SendOtpDto } from './dto/login.dto'
import { JwtAuthGuard, JwtRefreshGuard } from './guards/jwt-auth.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import { User } from '../users/entities/user.entity'

@ApiTags('Auth')
@Controller('auth')
@Version('1')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/v1/auth/register
  @Post('register')
  @Throttle({ short: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: 'Yeni kullanıcı kaydı' })
  async register(@Body() dto: RegisterDto, @Req() req: any) {
    return this.authService.register(
      dto,
      req.ip,
      req.headers['user-agent'] ?? '',
    )
  }

  // POST /api/v1/auth/login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { ttl: 60000, limit: 10 } })
  @ApiOperation({ summary: 'Giriş yap' })
  async login(@Body() dto: LoginDto, @Req() req: any) {
    return this.authService.login(dto, req.ip, req.headers['user-agent'] ?? '')
  }

  // POST /api/v1/auth/send-otp
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { ttl: 60000, limit: 3 } })
  @ApiOperation({ summary: 'SMS OTP gönder' })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendPhoneOtp(dto.phone)
  }

  // POST /api/v1/auth/verify-otp
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'SMS OTP doğrula' })
  async verifyOtp(@Body() dto: VerifyOtpDto, @CurrentUser() user: User) {
    return this.authService.verifyPhoneOtp(dto.phone, dto.otp, user.id)
  }

  // POST /api/v1/auth/refresh
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Access token yenile' })
  async refresh(@CurrentUser() user: User) {
    return this.authService.refresh(user)
  }

  // POST /api/v1/auth/logout
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Çıkış yap' })
  async logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id)
  }

  // POST /api/v1/auth/forgot-password
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { ttl: 60000, limit: 3 } })
  @ApiOperation({ summary: 'Şifre sıfırlama e-postası gönder' })
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email)
  }

  // POST /api/v1/auth/reset-password
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: 'Şifreyi sıfırla' })
  async resetPassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    return this.authService.resetPassword(token, password)
  }

  // POST /api/v1/auth/verify-email
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { ttl: 60000, limit: 10 } })
  @ApiOperation({ summary: 'E-posta doğrulama tokenını işle' })
  async verifyEmail(@Body('token') token: string) {
    return this.authService.verifyEmail(token)
  }

  // POST /api/v1/auth/resend-verification
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Throttle({ short: { ttl: 60000, limit: 3 } })
  @ApiOperation({ summary: 'Doğrulama e-postasını yeniden gönder' })
  async resendVerification(@CurrentUser() user: User) {
    return this.authService.resendVerificationEmail(user.id)
  }

  // POST /api/v1/auth/me
  @Post('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mevcut kullanıcı bilgileri' })
  async me(@CurrentUser() user: User) {
    const { password, refreshTokenHash, ...safe } = user as any
    return safe
  }
}
