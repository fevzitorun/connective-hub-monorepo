import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '../../../components/Navbar'
import { Footer } from '../../../components/Footer'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

interface Props {
  params: { hash: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Sertifika Doğrulama — 7fil`,
    description: 'Mülk sertifikanızı doğrulayın.',
    robots: 'noindex',
  }
}

type VerifyResult =
  | { valid: true; certId: string; listingId: string; listingTitle: string; issuedAt: string; validUntil: string; issuedBy: string }
  | { valid: false; reason: string }

async function verifyCert(hash: string): Promise<VerifyResult> {
  try {
    const res = await fetch(`${BASE}/legal/verify/${hash}`, { cache: 'no-store' })
    return res.json()
  } catch {
    return { valid: false, reason: 'Sunucuya bağlanılamadı.' }
  }
}

export default async function CertificateVerifyPage({ params }: Props) {
  const result = await verifyCert(params.hash)

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-lg w-full py-16">
          {result.valid ? (
            <ValidCert result={result} hash={params.hash} />
          ) : (
            <InvalidCert reason={result.reason} hash={params.hash} />
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

function ValidCert({ result, hash }: { result: Extract<VerifyResult, { valid: true }>; hash: string }) {
  const issuedDate = new Date(result.issuedAt).toLocaleDateString('tr-TR', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const validUntilDate = new Date(result.validUntil).toLocaleDateString('tr-TR', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="card p-8 text-center">
      {/* Green checkmark */}
      <div className="w-20 h-20 rounded-full bg-green-50 border-4 border-green-200 flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="font-display text-2xl font-bold text-ink mb-1">Sertifika Geçerli</h1>
      <p className="text-sm text-muted mb-6">Bu mülk, 7fil tarafından onaylı bir avukat tarafından incelenmiştir.</p>

      <div className="bg-cream rounded-xl p-5 text-left space-y-3 mb-6">
        <div>
          <p className="text-xs text-muted">İlan</p>
          <Link href={`/ilan/${result.listingId}`} className="text-sm font-semibold text-ink hover:text-teal transition-colors">
            {result.listingTitle}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted">Düzenleyen</p>
            <p className="text-sm font-medium text-ink">{result.issuedBy}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Düzenleme Tarihi</p>
            <p className="text-sm font-medium text-ink">{issuedDate}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Geçerlilik</p>
            <p className="text-sm font-medium text-ink">{validUntilDate}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Sertifika ID</p>
            <p className="text-xs font-mono text-ink/60">{result.certId.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>
      </div>

      <div className="text-xs text-muted/60 bg-green-50/50 border border-green-100 rounded-lg p-3 mb-6">
        <p className="font-mono break-all">{hash}</p>
      </div>

      <div className="flex flex-col gap-2">
        <Link href={`/ilan/${result.listingId}`} className="btn-primary w-full text-sm py-3">
          İlanı Görüntüle
        </Link>
        <Link href="/" className="text-sm text-muted hover:text-ink transition-colors">
          Ana Sayfa →
        </Link>
      </div>

      <p className="text-[10px] text-muted/40 mt-6">
        Bu sertifika 7fil.com.tr tarafından verilen hukuki ön inceleme sertifikasıdır.
        Tapu tescili, resmi ekspertiz veya noter onayı yerine geçmez.
      </p>
    </div>
  )
}

function InvalidCert({ reason, hash }: { reason: string; hash: string }) {
  return (
    <div className="card p-8 text-center">
      <div className="w-20 h-20 rounded-full bg-red-50 border-4 border-red-200 flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h1 className="font-display text-2xl font-bold text-ink mb-1">Geçersiz Sertifika</h1>
      <p className="text-sm text-muted mb-6">{reason}</p>

      <div className="text-xs text-muted/60 bg-red-50/50 border border-red-100 rounded-lg p-3 mb-6">
        <p className="font-mono break-all">{hash}</p>
      </div>

      <Link href="/" className="btn-primary w-full text-sm py-3">
        Ana Sayfaya Dön
      </Link>

      <p className="text-xs text-muted mt-4">
        Sertifika hakkında sorun yaşıyorsanız{' '}
        <a href="mailto:destek@7fil.com.tr" className="text-teal hover:text-gold">
          destek@7fil.com.tr
        </a>
        {' '}adresine yazabilirsiniz.
      </p>
    </div>
  )
}
