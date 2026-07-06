import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold', {
  variants: {
    variant: {
      default: 'bg-surface-page text-navy-600 dark:bg-slate-800 dark:text-slate-200',
      teal: 'bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-200',
      amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      green: 'bg-teal-100 text-teal-600 dark:bg-green-900 dark:text-green-200',
      red: 'bg-error-50 text-error-500 dark:bg-red-900 dark:text-red-200',
      brand: 'bg-brand-100 text-brand-500 dark:bg-blue-900 dark:text-blue-200',
    },
  },
  defaultVariants: { variant: 'default' },
})

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
