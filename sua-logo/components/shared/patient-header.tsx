'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, CircleHelp, UserRound } from 'lucide-react'
import { AreaDrawer } from '@/components/shared/area-drawer'
import { BottomNav, type BottomNavItem } from '@/components/shared/bottom-nav'
import { LogoutButton } from '@/components/shared/logout-button'
import { SiteLogo } from '@/components/shared/site-logo'
import { cn, initials } from '@/lib/utils'

const TABS = [
  { href: '/dashboard', label: 'Minhas consultas' },
  { href: '/dashboard/dados', label: 'Meus dados' },
  { href: '/dashboard/ajuda', label: 'Ajuda' },
]

// Rótulos curtos para a barra inferior do mobile.
const BOTTOM_TABS: BottomNavItem[] = [
  { href: '/dashboard', label: 'Consultas', icon: CalendarDays },
  { href: '/dashboard/dados', label: 'Meus dados', icon: UserRound },
  { href: '/dashboard/ajuda', label: 'Ajuda', icon: CircleHelp },
]

export function PatientHeader({ patientName, statusLabel }: { patientName: string; statusLabel?: string }) {
  const pathname = usePathname()

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto grid max-w-[1140px] grid-cols-[1fr_auto_1fr] items-center px-6">
          <div className="py-[15px]">
            <SiteLogo href="/dashboard" />
          </div>
          <nav className="hidden items-center gap-6 justify-self-center md:flex">
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
          <div className="col-start-3 flex items-center justify-self-end gap-3.5">
            <div className="hidden items-center gap-3.5 md:flex">
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
            <AreaDrawer
              tabs={TABS}
              userName={patientName}
              userDetail={statusLabel}
              avatarClass="bg-brand-100 text-brand-700"
            />
          </div>
        </div>
      </header>
      <BottomNav items={BOTTOM_TABS} activeClass="text-brand-700" />
    </>
  )
}
