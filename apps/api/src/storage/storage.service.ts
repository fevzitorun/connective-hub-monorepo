import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name)
  private readonly s3: S3Client
  private readonly bucket: string
  private readonly publicUrl: string

  constructor(private readonly config: ConfigService) {
    this.bucket    = config.get<string>('R2_BUCKET_NAME', '7fil-media')
    this.publicUrl = config.get<string>('R2_PUBLIC_URL', 'https://media.7fil.com.tr')

    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${config.get('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId:     config.get<string>('R2_ACCESS_KEY_ID', ''),
        secretAccessKey: config.get<string>('R2_SECRET_ACCESS_KEY', ''),
      },
    })
  }

  /** Dosya yükle → public URL döner */
  async upload(
    buffer: Buffer,
    options: { folder: string; filename?: string; mimeType: string }
  ): Promise<{ url: string; key: string }> {
    const ext = options.mimeType.split('/')[1] ?? 'jpg'
    const key = `${options.folder}/${options.filename ?? randomUUID()}.${ext}`

    await this.s3.send(
      new PutObjectCommand({
        Bucket:      this.bucket,
        Key:         key,
        Body:        buffer,
        ContentType: options.mimeType,
        CacheControl: 'public, max-age=31536000',
      })
    )

    return { url: `${this.publicUrl}/${key}`, key }
  }

  /** R2'den sil */
  async delete(key: string): Promise<void> {
    try {
      await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }))
    } catch (err) {
      this.logger.warn(`R2 silme hatası: ${key}`, err)
    }
  }

  /** Presigned upload URL (ilerleyen modüllerde direkt frontend upload için) */
  async presignedUploadUrl(key: string, mimeType: string, expiresIn = 300): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: mimeType,
    })
    return getSignedUrl(this.s3, command, { expiresIn })
  }
}
