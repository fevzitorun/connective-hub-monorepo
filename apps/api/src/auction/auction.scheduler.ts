import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { AuctionService } from './auction.service'
import { AuctionGateway } from './auction.gateway'
import { MailService } from '../mail/mail.service'

@Injectable()
export class AuctionScheduler {
  private readonly logger = new Logger(AuctionScheduler.name)

  constructor(
    private readonly auctionService: AuctionService,
    private readonly gateway: AuctionGateway,
    private readonly mail: MailService,
    @InjectDataSource() private readonly ds: DataSource,
  ) {}

  // Every minute: activate scheduled auctions
  @Cron(CronExpression.EVERY_MINUTE)
  async activateAuctions() {
    const activated = await this.auctionService.activateDueAuctions()
    if (activated.length > 0) {
      this.logger.log(`Activated ${activated.length} auctions`)
    }
  }

  // Every minute: close expired auctions
  @Cron(CronExpression.EVERY_MINUTE)
  async closeExpiredAuctions() {
    const closed = await this.auctionService.closeExpiredAuctions()
    for (const row of closed as { id: string; title: string; current_price: string; winner_user_id: string | null }[]) {
      this.logger.log(`Closed auction ${row.id}, winner: ${row.winner_user_id ?? 'none'}`)
      this.gateway.broadcastEnd(row.id, row.winner_user_id)

      // Winner e-mail
      if (row.winner_user_id) {
        this.notifyWinner(row.id, row.winner_user_id, row.title, Number(row.current_price))
          .catch(() => undefined)
      }
    }
  }

  private async notifyWinner(auctionId: string, winnerId: string, title: string, finalPrice: number) {
    const users = await this.ds.query(
      `SELECT email, full_name FROM users WHERE id = $1`, [winnerId],
    ) as { email: string; full_name: string }[]
    const winner = users[0]
    if (!winner) return
    await this.mail.sendAuctionWon(winner.email, winner.full_name, { title, id: auctionId, finalPrice })
  }
}
