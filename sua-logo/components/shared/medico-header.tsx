'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ClipboardList, Users } from 'lucide-react'
import { AreaDrawer } from '@/components/shared/area-drawer'
import { BottomNav, type BottomNavItem } from '@/components/shared/bottom-nav'
import { LogoutButton } from '@/components/shared/logout-button'
import { SiteLogo } from '@/components/shared/site-logo'
import { cn, initials } from '@/lib/utils'

const TABS = [
  { href: '/medico', label: 'Fila de atendimento' },
  { href: '/medico/pacientes', label: 'Lista de pacientes' },
]

// Rótulos curtos para a barra inferior do mobile.
const BOTTOM_TABS: BottomNavItem[] = [
  { href: '/medico', label: 'Fila', icon: ClipboardList },
  { href: '/medico/pacientes', label: 'Pacientes', icon: Users },
]

export function MedicoHeader({
  doctorName,
  crm,
  specialty,
}: {
  doctorName: string
  crm?: string | null
  specialty?: string | null
}) {
  const pathname = usePathname()

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto grid max-w-[1140px] grid-cols-[1fr_auto_1fr] items-center px-6">
          <div className="py-[15px]">
            <SiteLogo href="/medico" iconClassName="bg-teal-500" />
          </div>
          <nav className="hidden items-center gap-6 justify-self-center md:flex">
            {TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'border-b-2 py-[18px] text-sm font-bold',
                  pathname === tab.href ? 'border-teal-500 text-navy-900' : 'border-transparent text-navy-700'
                )}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
          <div className="col-start-3 flex items-center justify-self-end gap-3.5">
            <div className="hidden items-center gap-3.5 md:flex">
              <div className="flex items-center gap-2">
                <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-teal-100 text-[13px] font-bold text-navy-900">
                  {initials(doctorName)}
                </div>
                <div>
                  <div className="text-sm font-bold leading-tight">{doctorName}</div>
                  {(specialty || crm) && (
                    <div className="text-xs leading-tight text-navy-200">
                      {[specialty, crm].filter(Boolean).join(' · ')}
                    </div>
                  )}
                </div>
              </div>
              <LogoutButton />
            </div>
            <AreaDrawer
              tabs={TABS}
              userName={doctorName}
              userDetail={[specialty, crm].filter(Boolean).join(' · ') || null}
              avatarClass="bg-teal-100 text-navy-900"
            />
          </div>
        </div>
      </header>
      <BottomNav items={BOTTOM_TABS} activeClass="text-teal-600" />
    </>
  )
}
