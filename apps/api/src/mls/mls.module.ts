/**
 * MlsModule — Modül B
 *
 * DataSource üzerinden raw SQL kullandığı için TypeORM entity importuna
 * gerek yoktur; InjectDataSource yeterlidir.
 *
 * AppModule'e şu şekilde eklenmeli:
 *
 *   import { MlsModule } from './mls/mls.module'
 *
 *   @Module({
 *     imports: [
 *       ...
 *       MlsModule,
 *     ],
 *   })
 *   export class AppModule {}
 */

import { Module } from '@nestjs/common'
import { MlsService }    from './mls.service'
import { MlsController } from './mls.controller'

@Module({
  controllers: [MlsController],
  providers:   [MlsService],
  exports:     [MlsService], // Diğer modüller (PDF broşür vb.) ihtiyaç duyarsa
})
export class MlsModule {}
