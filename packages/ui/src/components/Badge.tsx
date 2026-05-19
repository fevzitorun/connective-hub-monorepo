import * as React from 'react'

type BadgeVariant = 'gold' | 'teal' | 'success' | 'warning' | 'danger' | 'muted'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  gold:    'badge-gold',
  teal:    'badge-teal',
  success: 'bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full',
  warning: 'bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-0.5 rounded-full',
  danger:  'bg-red-100 text-red-700 text-xs font-medium px-2.5 py-0.5 rounded-full',
  muted:   'bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full',
}

export function Badge({ variant = 'teal', children, className = '' }: BadgeProps) {
  return (
    <span className={`${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}
