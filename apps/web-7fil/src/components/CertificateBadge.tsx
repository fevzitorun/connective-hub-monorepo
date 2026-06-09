import Link from 'next/link'

interface Props {
  certHash: string
  issuedAt: string
  issuedBy?: string
  validUntil?: string
}

export function CertificateBadge({ certHash, issuedAt, issuedBy, validUntil }: Props) {
  const issuedDate = new Date(issuedAt).toLocaleDateString('tr-TR', {
    year: 'numeric', month: 'short', day: 'numeric',
  })

  return (
    <Link
      href={`/sertifika/${certHash}`}
      className="block border border-green-200 bg-green-50/70 rounded-xl p-4 hover:border-green-300 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-green-700">7fil Mülk Sertifikası</p>
            <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full font-medium">GEÇERLİ</span>
          </div>
          <p className="text-xs text-green-600/80 mt-0.5">
            {issuedDate} tarihinde düzenlendi{issuedBy ? ` · ${issuedBy}` : ''}
          </p>
        </div>
        <svg className="w-4 h-4 text-green-400 group-hover:text-green-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
      <p className="text-[10px] text-green-600/60 mt-2 font-mono truncate">{certHash}</p>
    </Link>
  )
}
