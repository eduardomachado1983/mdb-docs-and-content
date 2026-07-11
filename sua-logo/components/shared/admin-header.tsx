'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShieldCheck, Users } from 'lucide-react'
import { BottomNav, type BottomNavItem } from '@/components/shared/bottom-nav'
import { LogoutButton } from '@/components/shared/logout-button'
import { cn, initials } from '@/lib/utils'

const TABS = [
  { href: '/admin', label: 'Aguardando validação' },
  { href: '/admin/pacientes', label: 'Lista de pacientes' },
]

// Rótulos curtos para a barra inferior do mobile.
const BOTTOM_TABS: BottomNavItem[] = [
  { href: '/admin', label: 'Validação', icon: ShieldCheck },
  { href: '/admin/pacientes', label: 'Pacientes', icon: Users },
]

export function AdminHeader({ adminName }: { adminName: string }) {
  const pathname = usePathname()

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line-200 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[1140px] grid-cols-[1fr_auto_1fr] items-center px-6">
          <div className="flex items-center gap-2.5 py-[13px]">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-admin-500 text-[11px] font-extrabold text-white">
              SL
            </div>
            <span className="text-[15px] font-extrabold">Sua Logo</span>
          </div>
          <nav className="hidden items-center gap-6 justify-self-center md:flex">
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
          <div className="col-start-3 flex items-center justify-self-end gap-3.5">
            <div className="flex items-center gap-2">
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-admin-100 text-[13px] font-bold text-admin-500">
                {initials(adminName)}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold leading-tight">{adminName}</div>
                <div className="text-xs leading-tight text-navy-200">Administrador</div>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>
      <BottomNav items={BOTTOM_TABS} activeClass="text-admin-500" />
    </>
  )
}
