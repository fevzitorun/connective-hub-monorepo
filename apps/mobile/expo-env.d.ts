/// <reference types="expo/types" />

// Expo Metro bundler makes EXPO_PUBLIC_* vars available via process.env
declare const process: {
  env: {
    readonly EXPO_PUBLIC_API_URL?: string
    readonly NODE_ENV?: string
  }
}
