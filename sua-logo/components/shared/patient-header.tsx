'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from '@/components/shared/logout-button'
import { cn, initials } from '@/lib/utils'

const TABS = [
  { href: '/dashboard', label: 'Minhas consultas' },
  { href: '/dashboard/dados', label: 'Meus dados' },
  { href: '/dashboard/ajuda', label: 'Ajuda' },
]

export function PatientHeader({ patientName, statusLabel }: { patientName: string; statusLabel?: string }) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 border-b border-line-200 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto grid max-w-[1140px] grid-cols-[1fr_auto_1fr] items-center px-6">
        <div className="flex items-center gap-2.5 py-[13px]">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-brand-500 to-teal-500 text-[11px] font-extrabold text-white">
            SL
          </div>
          <span className="text-[15px] font-extrabold">Sua Logo</span>
        </div>
        <nav className="flex items-center gap-6 justify-self-center">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'border-b-2 py-[18px] text-sm font-bold',
                pathname === tab.href ? 'border-brand-500 text-navy-900' : 'border-transparent text-navy-700'
              )}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-self-end gap-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-brand-100 text-[13px] font-bold text-brand-700">
              {initials(patientName)}
            </div>
            <div>
              <div className="text-sm font-bold leading-tight">{patientName}</div>
              {statusLabel && <div className="text-xs leading-tight text-navy-200">{statusLabel}</div>}
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
