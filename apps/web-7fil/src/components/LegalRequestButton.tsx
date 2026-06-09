'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '../store/auth'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

interface Props {
  listingId: string
}

export function LegalRequestButton({ listingId }: Props) {
  const { accessToken } = useAuthStore()
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function requestReview() {
    if (!accessToken) return
    setState('loading')
    try {
      const res = await fetch(`${BASE}/legal/cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ listingId }),
      })
      const json = await res.json()
      if (!res.ok) {
        setMessage(json.message ?? 'Talep oluşturulamadı.')
        setState('error')
        return
      }
      setMessage('Hukuki inceleme talebiniz oluşturuldu. En kısa sürede bir avukat atanacak.')
      setState('done')
    } catch {
      setMessage('Sunucu hatası.')
      setState('error')
    }
  }

  if (!accessToken) {
    return (
      <Link
        href={`/giris?redirect=/ilan/${listingId}`}
        className="flex items-center gap-2 text-sm border border-border rounded-xl px-4 py-3 hover:border-gold/40 transition-colors w-full"
      >
        <span className="text-lg">⚖️</span>
        <div className="text-left">
          <p className="font-medium text-ink text-sm">Hukuki İnceleme İste</p>
          <p className="text-xs text-muted">Giriş yaparak talep oluşturun</p>
        </div>
      </Link>
    )
  }

  if (state === 'done') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
        <p className="font-semibold mb-1">✓ Talep Oluşturuldu</p>
        <p className="text-xs">{message}</p>
        <Link href="/hukuk/taleplerim" className="text-xs text-teal hover:text-gold mt-2 block font-medium">
          Taleplerim →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={requestReview}
        disabled={state === 'loading'}
        className="flex items-center gap-2 text-sm border border-border rounded-xl px-4 py-3 hover:border-gold/40 transition-colors w-full disabled:opacity-60 group"
      >
        <span className="text-lg">⚖️</span>
        <div className="text-left flex-1">
          <p className="font-medium text-ink text-sm group-hover:text-teal transition-colors">
            {state === 'loading' ? 'Talep oluşturuluyor...' : 'Hukuki İnceleme İste'}
          </p>
          <p className="text-xs text-muted">7fil avukat ağı ile güvende olun</p>
        </div>
        <svg className="w-4 h-4 text-muted group-hover:text-teal transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {state === 'error' && (
        <p className="text-xs text-red-500 px-1">{message}</p>
      )}
    </div>
  )
}
