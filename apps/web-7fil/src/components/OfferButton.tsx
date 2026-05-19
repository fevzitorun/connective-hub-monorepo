'use client'
import { useState } from 'react'
import { formatPrice } from '../lib/utils'

interface Props {
  whatsappLink: string | null | undefined
  listingTitle: string
  listingPrice: number | null | undefined
  currency?: string
}

export function OfferButton({ whatsappLink, listingTitle, listingPrice, currency = 'TRY' }: Props) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')

  if (!whatsappLink) return null

  // WhatsApp numarasını linkten çıkar
  const phoneMatch = whatsappLink.match(/wa\.me\/(\d+)/)
  const phone = phoneMatch?.[1]
  if (!phone) return null

  function buildOfferLink() {
    const offerAmount = amount ? Number(amount.replace(/\D/g, '')) : null
    const msg = offerAmount
      ? `Merhaba, "${listingTitle}" ilanı için *${offerAmount.toLocaleString('tr-TR')} ${currency}* teklif vermek istiyorum. Müsait olduğunuzda görüşebilir miyiz?`
      : `Merhaba, "${listingTitle}" ilanıyla ilgili görüşmek istiyorum.`
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn-outline w-full flex items-center justify-center gap-2 mt-3"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        Teklif Ver
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-ink/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <h3 className="font-display text-lg font-bold text-ink mb-1">Teklif Ver</h3>
            <p className="text-sm text-muted mb-4 line-clamp-2">{listingTitle}</p>

            {listingPrice && (
              <p className="text-xs text-muted mb-3">
                İlan fiyatı: <span className="font-semibold text-gold">{formatPrice(listingPrice, currency)}</span>
              </p>
            )}

            <div className="mb-4">
              <label className="block text-xs font-medium text-muted mb-1.5">
                Teklif tutarınız ({currency})
              </label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={listingPrice ? String(Math.round(listingPrice * 0.9)) : '0'}
                className="input-base"
                inputMode="numeric"
              />
              <p className="text-xs text-muted mt-1">
                Boş bırakırsanız genel bir iletişim mesajı gönderilir.
              </p>
            </div>

            <div className="flex gap-3">
              <a
                href={buildOfferLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="whatsapp-btn flex-1 text-sm py-2.5"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp ile Gönder
              </a>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 rounded-lg border border-border text-sm text-muted hover:text-ink transition-colors"
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
