'use client'
import { create } from 'zustand'
import type { SearchParams, SearchResponse } from '../lib/api'

interface SearchState {
  params: SearchParams
  result: SearchResponse | null
  loading: boolean
  error: string | null
  mapView: boolean

  setParams: (p: Partial<SearchParams>) => void
  setResult: (r: SearchResponse) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
  toggleMapView: () => void
  reset: () => void
}

const defaultParams: SearchParams = {
  page: 1,
  perPage: 20,
  sortBy: 'newest',
}

export const useSearchStore = create<SearchState>((set) => ({
  params: defaultParams,
  result: null,
  loading: false,
  error: null,
  mapView: false,

  setParams: (p) => set((s) => ({ params: { ...s.params, ...p, page: 1 } })),
  setResult: (r) => set({ result: r }),
  setLoading: (v) => set({ loading: v }),
  setError: (e) => set({ error: e }),
  toggleMapView: () => set((s) => ({ mapView: !s.mapView })),
  reset: () => set({ params: defaultParams, result: null }),
}))
