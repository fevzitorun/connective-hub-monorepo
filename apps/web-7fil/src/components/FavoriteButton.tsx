'use client'
import { useCallback } from 'react'
import { useFavoritesStore } from '../store/favorites'
import { useAuthStore } from '../store/auth'
import { cn } from '../lib/utils'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'

interface Props {
  listingId: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function FavoriteButton({ listingId, size = 'md', className }: Props) {
  const { isFav, toggle } = useFavoritesStore()
  const { accessToken } = useAuthStore()
  const active = isFav(listingId)

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  }

  const iconSize = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      // Optimistic UI — önce store'u güncelle
      toggle(listingId)

      // Giriş yapmışsa API'ye de yaz
      if (accessToken) {
        try {
          await fetch(`${BASE}/favorites/${listingId}`, {
            method: active ? 'DELETE' : 'POST',
            headers: { Authorization: `Bearer ${accessToken}` },
          })
        } catch {
          // Başarısız olursa geri al
          toggle(listingId)
        }
      }
    },
    [listingId, active, toggle, accessToken]
  )

  return (
    <button
      onClick={handleClick}
      aria-label={active ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      className={cn(
        'flex items-center justify-center rounded-full transition-all duration-200',
        'bg-white/90 backdrop-blur hover:bg-white shadow-sm',
        active ? 'text-red-500' : 'text-muted hover:text-red-400',
        sizeClasses[size],
        className
      )}
    >
      <svg
        className={cn(iconSize[size], 'transition-transform', active ? 'scale-110' : '')}
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={active ? 0 : 1.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  )
}
