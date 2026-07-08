import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold', {
  variants: {
    variant: {
      default: 'bg-surface-page text-navy-600',
      brand: 'bg-brand-100 text-brand-600',
      admin: 'bg-admin-100 text-admin-600',
      amber: 'bg-amber-50 text-amber-600',
      green: 'bg-success-50 text-success-600',
      red: 'bg-error-50 text-error-500',
    },
  },
  defaultVariants: { variant: 'default' },
})

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
