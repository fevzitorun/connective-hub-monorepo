import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TicariService } from './ticari.service'
import { TicariController } from './ticari.controller'
import { TicariReport } from './entities/ticari-report.entity'
import { TicariSnapshot } from './entities/ticari-snapshot.entity'

@Module({
  imports: [TypeOrmModule.forFeature([TicariReport, TicariSnapshot])],
  controllers: [TicariController],
  providers: [TicariService],
  exports: [TicariService],
})
export class TicariModule {}
