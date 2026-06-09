import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import type { AuthUser } from '../lib/api'

const KEYS = { access: 'yedifil_access', refresh: 'yedifil_refresh', user: 'yedifil_user' }

type AuthState = {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  isHydrated: boolean
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => Promise<void>
  clearAuth: () => Promise<void>
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isHydrated: false,

  setAuth: async (user, accessToken, refreshToken) => {
    await Promise.all([
      SecureStore.setItemAsync(KEYS.access, accessToken),
      SecureStore.setItemAsync(KEYS.refresh, refreshToken),
      SecureStore.setItemAsync(KEYS.user, JSON.stringify(user)),
    ])
    set({ user, accessToken, refreshToken })
  },

  clearAuth: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.access),
      SecureStore.deleteItemAsync(KEYS.refresh),
      SecureStore.deleteItemAsync(KEYS.user),
    ])
    set({ user: null, accessToken: null, refreshToken: null })
  },

  hydrate: async () => {
    try {
      const [access, refresh, userRaw] = await Promise.all([
        SecureStore.getItemAsync(KEYS.access),
        SecureStore.getItemAsync(KEYS.refresh),
        SecureStore.getItemAsync(KEYS.user),
      ])
      if (access && refresh && userRaw) {
        const user = JSON.parse(userRaw) as AuthUser
        set({ user, accessToken: access, refreshToken: refresh })
      }
    } catch {
      // silently ignore — user stays logged out
    } finally {
      set({ isHydrated: true })
    }
  },
}))
