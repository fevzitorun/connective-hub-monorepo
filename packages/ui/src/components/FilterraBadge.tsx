import * as React from 'react'

interface FilterraBadgeProps {
  className?: string
}

export function FilterraBadge({ className = '' }: FilterraBadgeProps) {
  return (
    <span className={`filterra-badge ${className}`}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 6l1.5 1.5L8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Powered by FILTERRA.AI
    </span>
  )
}
