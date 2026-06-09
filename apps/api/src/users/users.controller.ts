import {
  Controller, Post, Delete, Body, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User } from './entities/user.entity'
import { PushService } from '../mail/push.service'

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly push: PushService) {}

  @Post('push-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registerPushToken(
    @CurrentUser() user: User,
    @Body('token') token: string,
    @Body('platform') platform: 'ios' | 'android' | 'web',
  ) {
    if (!token || !platform) return
    await this.push.registerToken(user.id, token, platform)
  }

  @Delete('push-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePushToken(
    @CurrentUser() user: User,
    @Body('token') token: string,
  ) {
    if (!token) return
    await this.push.removeToken(user.id, token)
  }
}
