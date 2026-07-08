'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from '@/components/shared/logout-button'
import { cn, initials } from '@/lib/utils'

const TABS = [
  { href: '/admin', label: 'Aguardando validação' },
  { href: '/admin/pacientes', label: 'Lista de pacientes' },
]

export function AdminHeader({ adminName }: { adminName: string }) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 border-b border-line-200 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[960px] items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5 py-[13px]">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-admin-500 text-[11px] font-extrabold text-white">
              SL
            </div>
            <span className="text-[15px] font-extrabold">Sua Logo</span>
          </div>
          <nav className="flex items-center gap-6">
            {TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'border-b-2 py-[18px] text-sm font-bold',
                  pathname === tab.href ? 'border-admin-500 text-admin-500' : 'border-transparent text-navy-700'
                )}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-admin-100 text-[13px] font-bold text-admin-500">
              {initials(adminName)}
            </div>
            <div>
              <div className="text-sm font-bold leading-tight">{adminName}</div>
              <div className="text-xs leading-tight text-navy-200">Administrador</div>
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
