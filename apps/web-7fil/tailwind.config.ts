import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink:    '#1a1a2e',
        gold:   '#c9a84c',
        teal:   '#2d6a6a',
        cream:  '#f8f4ee',
        muted:  '#6b7280',
        border: '#e5e0d8',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
    },
  },
  plugins: [],
} satisfies Config
