import * as React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export function Card({ hover = true, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`card ${hover ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardBody({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-t-xl ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  )
}
