export const Colors = {
  ink: '#1a1a2e',
  inkLight: '#22223b',
  teal: '#2dd4bf',
  tealDark: '#0f9488',
  gold: '#f5c842',
  cream: '#f8f5f0',
  muted: '#6b7280',
  mutedLight: '#9ca3af',
  border: '#e5e7eb',
  white: '#ffffff',
  error: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
  sale: '#2dd4bf',
  rent: '#a78bfa',
}

export const Fonts = {
  regular: { fontWeight: '400' as const },
  medium: { fontWeight: '500' as const },
  semibold: { fontWeight: '600' as const },
  bold: { fontWeight: '700' as const },
  extrabold: { fontWeight: '800' as const },
}

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
}

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 5,
  },
}
