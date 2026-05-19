'use client'
import { useState } from 'react'
import { useAuthStore } from '../store/auth'
import { useSearchStore } from '../store/search'
import { useHistoryStore } from '../store/history'
import { cn } from '../lib/utils'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'

export function SaveSearchButton() {
  const { accessToken } = useAuthStore()
  const { params } = useSearchStore()
  const { push } = useHistoryStore()
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'needLogin'>('idle')

  async function handleSave() {
    if (!accessToken) {
      setState('needLogin')
      setTimeout(() => setState('idle'), 3000)
      return
    }

    setState('saving')
    try {
      await fetch(`${BASE}/search/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ filters: params, channel: 'email' }),
      })
      // Arama geçmişine de ekle
      push(params, '')
      setState('saved')
      setTimeout(() => setState('idle'), 4000)
    } catch {
      setState('idle')
    }
  }

  return (
    <button
      onClick={handleSave}
      disabled={state === 'saving'}
      className={cn(
        'flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-all',
        state === 'saved'
          ? 'border-teal bg-teal/10 text-teal'
          : state === 'needLogin'
          ? 'border-gold bg-gold/10 text-gold'
          : 'border-border text-muted hover:border-teal/50 hover:text-teal'
      )}
    >
      {state === 'saved' ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Alarm kuruldu
        </>
      ) : state === 'needLogin' ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Giriş gerekli
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {state === 'saving' ? 'Kaydediliyor...' : 'Bu aramayı kaydet'}
        </>
      )}
    </button>
  )
}
