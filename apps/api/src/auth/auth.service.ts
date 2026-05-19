import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcryptjs'
import { UsersService } from '../users/users.service'
import { SmsService } from '../common/services/sms.service'
import { OtpService } from '../common/services/otp.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { User } from '../users/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly smsService: SmsService,
    private readonly otpService: OtpService,
  ) {}

  // ─── Register ─────────────────────────────────────────────────────────────

  async register(dto: RegisterDto, ip: string, userAgent: string) {
    const user = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      fullName: dto.fullName,
      role: dto.role,
    })

    await this.usersService.audit({
      userId: user.id,
      action: 'REGISTER',
      resource: 'users',
      ipAddress: ip,
      userAgent,
    })

    // Eğer telefon varsa OTP gönder
    if (dto.phone) {
      await this.sendPhoneOtp(dto.phone)
    }

    const tokens = await this.generateTokens(user)
    return { user: this.sanitize(user), ...tokens }
  }

  // ─── Login ────────────────────────────────────────────────────────────────

  async login(dto: LoginDto, ip: string, userAgent: string) {
    const user = await this.usersService.findByEmail(dto.email)

    if (!user || !(await user.validatePassword(dto.password))) {
      throw new UnauthorizedException('E-posta veya şifre hatalı')
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Hesabınız devre dışı bırakılmıştır')
    }

    await this.usersService.audit({
      userId: user.id,
      action: 'LOGIN',
      resource: 'auth',
      ipAddress: ip,
      userAgent,
    })

    const tokens = await this.generateTokens(user)
    return { user: this.sanitize(user), ...tokens }
  }

  // ─── SMS OTP ──────────────────────────────────────────────────────────────

  async sendPhoneOtp(phone: string) {
    const otp = await this.otpService.generate(phone)
    await this.smsService.sendOtp(phone, otp)
    return { message: `Doğrulama kodu ${phone} numarasına gönderildi` }
  }

  async verifyPhoneOtp(phone: string, otp: string, userId?: string) {
    await this.otpService.verify(phone, otp)

    if (userId) {
      await this.usersService.markVerified(userId)
      await this.usersService.audit({
        userId,
        action: 'PHONE_VERIFIED',
        resource: 'users',
      })
    }
    return { message: 'Telefon numarası doğrulandı' }
  }

  // ─── Refresh Token ────────────────────────────────────────────────────────

  async refresh(user: User) {
    const tokens = await this.generateTokens(user)
    return tokens
  }

  // ─── Logout ───────────────────────────────────────────────────────────────

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null)
    return { message: 'Çıkış yapıldı' }
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
        expiresIn: this.config.get('REFRESH_TOKEN_EXPIRES_IN', '7d'),
      }),
    ])

    // Refresh token'ı hash'leyerek sakla (düz metin değil)
    const hash = await bcrypt.hash(refreshToken, 10)
    await this.usersService.updateRefreshToken(user.id, hash)

    return { accessToken, refreshToken }
  }

  private sanitize(user: User) {
    const { password, refreshTokenHash, ...safe } = user as any
    return safe
  }
}
