import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import * as bcrypt from 'bcryptjs'
import { UsersService } from '../../users/users.service'
import { JwtPayload } from './jwt.strategy'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: config.get<string>('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.body?.refreshToken
    const user = await this.usersService.findById(payload.sub)

    if (!user?.refreshTokenHash || !refreshToken) throw new UnauthorizedException()

    const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash)
    if (!matches) throw new UnauthorizedException()

    return user
  }
}
