import { IsString, IsUUID, IsOptional, IsEnum, IsNumber, Min, Max, IsNotEmpty } from 'class-validator'
import { DocType } from '../entities/legal-case.entity'

export class CreateCaseDto {
  @IsUUID()
  listingId: string

  @IsOptional()
  @IsString()
  notes?: string
}

export class AssignLawyerDto {
  @IsUUID()
  lawyerId: string
}

export class SubmitReviewDto {
  @IsEnum(['approved', 'rejected'])
  verdict: 'approved' | 'rejected'

  @IsNumber()
  @Min(0)
  @Max(100)
  riskScore: number

  @IsString()
  @IsNotEmpty()
  riskNotes: string

  @IsOptional()
  @IsString()
  lawyerNotes?: string

  @IsOptional()
  @IsNumber()
  fee?: number
}

export class AddDocumentDto {
  @IsEnum(['tapu', 'iskan', 'ruhsat', 'kadastro', 'vekaletname', 'dask', 'ipotek', 'other'])
  docType: DocType

  @IsString()
  fileUrl: string

  @IsString()
  r2Key: string

  @IsOptional()
  @IsString()
  notes?: string
}

export class RevokeCertificateDto {
  @IsString()
  @IsNotEmpty()
  reason: string
}
