import * as React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-[46px] w-full rounded-2xl border border-line-400 bg-white/65 px-3.5 py-2 text-[15px] text-navy-800 backdrop-blur-md placeholder:text-navy-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/40 focus-visible:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'
