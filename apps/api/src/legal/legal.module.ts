import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LegalCase, LegalDocument } from './entities/legal-case.entity'
import { PropertyCertificate } from './entities/property-certificate.entity'
import { LegalService } from './legal.service'
import { LegalController, CertificateVerifyController } from './legal.controller'

@Module({
  imports: [TypeOrmModule.forFeature([LegalCase, LegalDocument, PropertyCertificate])],
  controllers: [LegalController, CertificateVerifyController],
  providers: [LegalService],
  exports: [LegalService],
})
export class LegalModule {}
