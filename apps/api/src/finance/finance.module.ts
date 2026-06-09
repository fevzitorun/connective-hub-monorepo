import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FinanceService } from './finance.service'
import { IyzicoService } from './iyzico.service'
import { FinanceController, BankController } from './finance.controller'
import { MortgageLead } from './entities/mortgage-lead.entity'
import { InsuranceQuote } from './entities/insurance-quote.entity'
import { PaymentOrder } from './entities/payment-order.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MortgageLead, InsuranceQuote, PaymentOrder])],
  controllers: [FinanceController, BankController],
  providers: [FinanceService, IyzicoService],
  exports: [FinanceService, IyzicoService],
})
export class FinanceModule {}
