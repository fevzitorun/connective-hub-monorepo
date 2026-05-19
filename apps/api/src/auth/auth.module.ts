import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy'
import { UsersModule } from '../users/users.module'
import { SmsService } from '../common/services/sms.service'
import { OtpService } from '../common/services/otp.service'

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),  // Dinamik secret — stratejilerde ConfigService kullanılıyor
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    SmsService,
    OtpService,
  ],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
