import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuctionService } from './auction.service'
import { AuctionController } from './auction.controller'
import { AuctionGateway } from './auction.gateway'
import { AuctionScheduler } from './auction.scheduler'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (cfg: ConfigService) => ({ secret: cfg.get('JWT_SECRET') }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuctionController],
  providers: [AuctionService, AuctionGateway, AuctionScheduler],
})
export class AuctionModule {}
