import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WhitelabelService } from './whitelabel.service'
import { WhitelabelController, WhitelabelPublicController } from './whitelabel.controller'
import { AgencyBranding } from './entities/agency-branding.entity'

@Module({
  imports: [TypeOrmModule.forFeature([AgencyBranding])],
  controllers: [WhitelabelController, WhitelabelPublicController],
  providers: [WhitelabelService],
  exports: [WhitelabelService],
})
export class WhitelabelModule {}
