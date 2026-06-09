/**
 * CrmModule — M-01
 *
 * Lead yönetimi + aktivite geçmişi + Kanban pipeline.
 * DataSource üzerinden raw SQL kullanır (InjectDataSource).
 *
 * AppModule'e şu şekilde eklenmiştir:
 *   import { CrmModule } from './crm/crm.module'
 *   CrmModule,  // M-01 — CRM & Lead Yönetimi
 */

import { Module } from '@nestjs/common'
import { CrmService }    from './crm.service'
import { CrmController } from './crm.controller'

@Module({
  controllers: [CrmController],
  providers:   [CrmService],
  exports:     [CrmService], // SCRIBE / CAMPAIGNER agent'lar için export
})
export class CrmModule {}
