import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Agency } from './entities/agency.entity'
import { KvkkAuditLog } from './entities/kvkk-audit.entity'
import { UsersService } from './users.service'

@Module({
  imports: [TypeOrmModule.forFeature([User, Agency, KvkkAuditLog])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
