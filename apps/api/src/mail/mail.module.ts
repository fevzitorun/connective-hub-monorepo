import { Global, Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { MailService } from './mail.service'
import { MailScheduler } from './mail.scheduler'
import { PushService } from './push.service'

@Global()
@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [MailService, MailScheduler, PushService],
  exports: [MailService, PushService],
})
export class MailModule {}
