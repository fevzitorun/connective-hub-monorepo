import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AgencyService } from './agency.service'
import { AgencyController } from './agency.controller'
import { Subscription } from './entities/subscription.entity'
import { Agency } from '../users/entities/agency.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Agency, Subscription])],
  controllers: [AgencyController],
  providers: [AgencyService],
  exports: [AgencyService],
})
export class AgencyModule {}
