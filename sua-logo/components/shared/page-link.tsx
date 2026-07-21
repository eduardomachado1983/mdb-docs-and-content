import Link from 'next/link'
import { cn } from '@/lib/utils'

export function PageLink({
  href,
  active,
  disabled,
  children,
}: {
  href: string
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
}) {
  if (disabled) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-navy-100">
        {children}
      </span>
    )
  }
  return (
    <Link
      href={href}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold',
        active ? 'bg-admin-500 text-white' : 'text-navy-500 hover:bg-surface-page'
      )}
    >
      {children}
    </Link>
  )
}
