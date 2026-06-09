import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcryptjs'
import * as crypto from 'crypto'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { UsersService } from '../users/users.service'
import { SmsService } from '../common/services/sms.service'
import { OtpService } from '../common/services/otp.service'
import { MailService } from '../mail/mail.service'
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
    private readonly mail: MailService,
    @InjectDataSource() private readonly ds: DataSource,
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

    if (dto.phone) {
      await this.sendPhoneOtp(dto.phone)
    }

    const tokens = await this.generateTokens(user)

    // E-posta doğrulama gönder (fire & forget)
    this.sendVerificationEmail(user.id, user.email, user.fullName ?? user.email).catch(() => undefined)

    return { user: this.sanitize(user), ...tokens, emailVerificationSent: true }
  }

  // ─── E-posta Doğrulama ────────────────────────────────────────────────────

  async sendVerificationEmail(userId: string, email: string, name: string) {
    const rawToken = crypto.randomBytes(32).toString('hex')
    const hash = crypto.createHash('sha256').update(rawToken).digest('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1_000) // 24 saat

    await this.ds.query(
      `DELETE FROM email_verification_tokens WHERE user_id = $1`,
      [userId],
    )
    await this.ds.query(
      `INSERT INTO email_verification_tokens (user_id, token_hash, expires_at) VALUES ($1,$2,$3)`,
      [userId, hash, expiresAt.toISOString()],
    )

    await this.mail.sendEmailVerification(email, name, rawToken)
    return { message: 'Doğrulama e-postası gönderildi.' }
  }

  async verifyEmail(token: string) {
    const hash = crypto.createHash('sha256').update(token).digest('hex')
    const rows = await this.ds.query(`
      SELECT evt.id, evt.user_id
      FROM email_verification_tokens evt
      WHERE evt.token_hash = $1
        AND evt.expires_at > NOW()
        AND evt.used_at IS NULL
      LIMIT 1
    `, [hash])

    const row = rows[0] as { id: string; user_id: string } | undefined
    if (!row) throw new BadRequestException('Geçersiz veya süresi dolmuş doğrulama bağlantısı.')

    await Promise.all([
      this.ds.query(`UPDATE users SET is_verified = TRUE WHERE id = $1`, [row.user_id]),
      this.ds.query(`UPDATE email_verification_tokens SET used_at = NOW() WHERE id = $1`, [row.id]),
    ])

    await this.usersService.audit({ userId: row.user_id, action: 'EMAIL_VERIFIED', resource: 'users' })
    return { message: 'E-posta adresiniz başarıyla doğrulandı.' }
  }

  async resendVerificationEmail(userId: string) {
    const user = await this.usersService.findById(userId)
    if (user.isVerified) throw new BadRequestException('E-posta adresiniz zaten doğrulanmış.')
    return this.sendVerificationEmail(user.id, user.email, user.fullName ?? user.email)
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

  // ─── Şifre Sıfırlama ─────────────────────────────────────────────────────

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email)
    // Güvenlik: kullanıcı yoksa da aynı yanıtı döndür (timing attack önlemi)
    if (!user) return { message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.' }

    const rawToken = crypto.randomBytes(32).toString('hex')
    const hash = crypto.createHash('sha256').update(rawToken).digest('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1_000) // 1 saat

    // Eski tokenları geçersiz kıl
    await this.ds.query(
      `DELETE FROM password_reset_tokens WHERE user_id = $1`, [user.id],
    )
    await this.ds.query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1,$2,$3)`,
      [user.id, hash, expiresAt.toISOString()],
    )

    this.mail.sendPasswordReset(user.email, user.fullName, rawToken).catch(() => undefined)
    return { message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.' }
  }

  async resetPassword(token: string, newPassword: string) {
    const hash = crypto.createHash('sha256').update(token).digest('hex')
    const rows = await this.ds.query(`
      SELECT prt.id, prt.user_id, u.email, u.full_name
      FROM password_reset_tokens prt
      JOIN users u ON u.id = prt.user_id
      WHERE prt.token_hash = $1
        AND prt.expires_at > NOW()
        AND prt.used_at IS NULL
      LIMIT 1
    `, [hash])

    const row = rows[0] as { id: string; user_id: string; email: string; full_name: string } | undefined
    if (!row) throw new BadRequestException('Geçersiz veya süresi dolmuş bağlantı.')

    if (newPassword.length < 8) throw new BadRequestException('Şifre en az 8 karakter olmalı.')

    const passwordHash = await bcrypt.hash(newPassword, 12)
    await Promise.all([
      this.ds.query(`UPDATE users SET password = $1 WHERE id = $2`, [passwordHash, row.user_id]),
      this.ds.query(`UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1`, [row.id]),
    ])

    return { message: 'Şifreniz başarıyla güncellendi.' }
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
