'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
  // Anlık UI için lokal set (giriş yapmamış kullanıcılar da kullanabilir)
  ids: Set<string>
  // Seri hale getirilebilir versiyon
  _ids: string[]

  toggle: (id: string) => void
  setAll: (ids: string[]) => void
  isFav: (id: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: new Set<string>(),
      _ids: [],

      toggle: (id) => {
        const next = new Set(get().ids)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        set({ ids: next, _ids: Array.from(next) })
      },

      setAll: (ids) => set({ ids: new Set(ids), _ids: ids }),

      isFav: (id) => get().ids.has(id),
    }),
    {
      name: '7fil-favorites',
      // Set serileşmez — _ids array'ini kullan
      partialize: (s) => ({ _ids: s._ids }),
      onRehydrateStorage: () => (state) => {
        if (state) state.ids = new Set(state._ids)
      },
    }
  )
)
