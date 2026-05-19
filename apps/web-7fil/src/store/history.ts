'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SearchParams } from '../lib/api'

export interface HistoryEntry {
  id: string
  params: SearchParams
  label: string
  timestamp: number
}

interface HistoryState {
  entries: HistoryEntry[]
  push: (params: SearchParams, label: string) => void
  remove: (id: string) => void
  clear: () => void
}

function makeLabel(p: SearchParams): string {
  const parts: string[] = []
  if (p.city) parts.push(p.city)
  if (p.district) parts.push(p.district)
  if (p.roomCount) parts.push(p.roomCount)
  if (p.listingType === 'sale') parts.push('Satılık')
  if (p.listingType === 'rent') parts.push('Kiralık')
  if (p.q) parts.push(`"${p.q}"`)
  return parts.join(' · ') || 'Tüm İlanlar'
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      entries: [],

      push: (params, label) => {
        const entry: HistoryEntry = {
          id: `${Date.now()}`,
          params,
          label: label || makeLabel(params),
          timestamp: Date.now(),
        }
        // Aynı parametreli kaydı tekrar ekleme
        const existing = get().entries.find((e) => e.label === entry.label)
        if (existing) {
          set({ entries: [entry, ...get().entries.filter((e) => e.id !== existing.id)].slice(0, 10) })
        } else {
          set({ entries: [entry, ...get().entries].slice(0, 10) })
        }
      },

      remove: (id) => set({ entries: get().entries.filter((e) => e.id !== id) }),

      clear: () => set({ entries: [] }),
    }),
    { name: '7fil-search-history' }
  )
)
