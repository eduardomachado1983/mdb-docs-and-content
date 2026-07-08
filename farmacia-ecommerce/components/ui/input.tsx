import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-[46px] w-full rounded-[11px] border bg-white px-3.5 py-2 text-[15px] text-navy-800 placeholder:text-navy-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50',
        error ? 'border-error-500 bg-error-50' : 'border-line-400',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'
