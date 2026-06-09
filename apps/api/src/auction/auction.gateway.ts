import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  MessageBody, ConnectedSocket, OnGatewayDisconnect,
} from '@nestjs/websockets'
import type { Server, Socket } from 'socket.io'
import { AuctionService } from './auction.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

type BidPayload = { auctionId: string; amount: number; token?: string }

@WebSocketGateway({ namespace: '/auction', cors: { origin: '*' } })
export class AuctionGateway implements OnGatewayDisconnect {
  @WebSocketServer() server!: Server

  constructor(
    private readonly auctionService: AuctionService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  handleDisconnect(_client: Socket) {
    // Cleanup if needed
  }

  // Client joins auction room to receive live updates
  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() data: { auctionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    void client.join(`auction:${data.auctionId}`)
    client.emit('joined', { auctionId: data.auctionId })
  }

  @SubscribeMessage('leave')
  handleLeave(
    @MessageBody() data: { auctionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    void client.leave(`auction:${data.auctionId}`)
  }

  @SubscribeMessage('bid')
  async handleBid(
    @MessageBody() payload: BidPayload,
    @ConnectedSocket() client: Socket,
  ) {
    // Authenticate via JWT token sent in payload
    const userId = this.extractUserId(payload.token)
    if (!userId) {
      client.emit('bid_error', { message: 'Teklif vermek için giriş yapmalısınız.' })
      return
    }

    if (!payload.auctionId || !payload.amount || payload.amount <= 0) {
      client.emit('bid_error', { message: 'Geçersiz teklif verisi.' })
      return
    }

    try {
      const result = await this.auctionService.placeBid(
        payload.auctionId, userId, payload.amount,
        client.handshake.address,
      )

      // Broadcast to all watchers in the room
      this.server.to(`auction:${payload.auctionId}`).emit('bid_placed', {
        auctionId: payload.auctionId,
        currentPrice: result.currentPrice,
        bidCount: (result.bid as Record<string, unknown>)['id'] ? undefined : 0,
        buyNowTriggered: result.buyNowTriggered,
        timestamp: new Date().toISOString(),
      })

      if (result.buyNowTriggered) {
        this.server.to(`auction:${payload.auctionId}`).emit('auction_ended', {
          auctionId: payload.auctionId,
          reason: 'buy_now',
        })
      }

      client.emit('bid_success', { amount: payload.amount })
    } catch (e) {
      client.emit('bid_error', { message: e instanceof Error ? e.message : 'Teklif başarısız.' })
    }
  }

  // Called by AuctionScheduler when auction ends naturally
  broadcastEnd(auctionId: string, winnerId: string | null) {
    this.server.to(`auction:${auctionId}`).emit('auction_ended', {
      auctionId,
      reason: 'time_expired',
      winnerId,
    })
  }

  private extractUserId(token?: string): string | null {
    if (!token) return null
    try {
      const secret = this.config.get<string>('JWT_SECRET') ?? ''
      const payload = this.jwtService.verify<{ sub: string }>(token, { secret })
      return payload.sub
    } catch {
      return null
    }
  }
}
