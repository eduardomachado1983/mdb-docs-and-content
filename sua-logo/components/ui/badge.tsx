import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold', {
  variants: {
    variant: {
      default: 'bg-surface-page text-navy-600',
      teal: 'bg-teal-100 text-teal-600',
      amber: 'bg-amber-100 text-amber-800',
      green: 'bg-teal-100 text-teal-600',
      red: 'bg-error-50 text-error-500',
      brand: 'bg-brand-100 text-brand-500',
    },
  },
  defaultVariants: { variant: 'default' },
})

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
