import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-bold transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
  {
    variants: {
      variant: {
        default: 'bg-brand-500 text-white shadow-[0_10px_22px_rgba(22,104,214,.28)] hover:bg-brand-600',
        teal: 'bg-teal-500 text-white hover:bg-teal-600',
        admin: 'bg-admin-500 text-white hover:bg-admin-600',
        outline: 'border border-line-400 bg-white text-navy-700 hover:bg-surface-soft dark:border-slate-700 dark:bg-transparent dark:text-slate-100 dark:hover:bg-slate-800',
        ghost: 'text-navy-500 hover:bg-surface-page dark:hover:bg-slate-800',
        destructive: 'bg-error-500 text-white hover:bg-red-700',
      },
      size: {
        default: 'h-11 px-5 text-[15px]',
        sm: 'h-9 px-3.5 text-sm',
        lg: 'h-[52px] px-7 text-base',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
)
Button.displayName = 'Button'
