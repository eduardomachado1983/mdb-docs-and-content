import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] font-bold transition-transform active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
  {
    variants: {
      variant: {
        // Marine — botão primário, texto Forest (branco sobre Marine tem contraste insuficiente)
        default: 'bg-brand-500 text-primary-on shadow-[0_10px_22px_rgba(87,188,144,.30)] hover:bg-brand-600',
        teal: 'bg-teal-500 text-primary-on hover:bg-teal-600',
        // Forest — admin, contraste alto o suficiente para texto branco
        admin: 'bg-admin-500 text-white hover:bg-admin-600',
        outline: 'border border-line-400 bg-white/70 text-navy-700 backdrop-blur-md hover:bg-white',
        ghost: 'text-navy-500 hover:bg-surface-page',
        destructive: 'bg-error-500 text-white hover:bg-[#e0362c]',
      },
      size: {
        default: 'h-11 px-5 text-[15px]',
        // 44px no mobile (alvo de toque mínimo); 36px no desktop.
        sm: 'h-11 px-3.5 text-sm sm:h-9',
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
