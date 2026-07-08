'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { SiteLogo } from '@/components/shared/site-logo'
import { LogoutButton } from '@/components/shared/logout-button'
import { useAuth } from '@/lib/mock-auth'
import { cn, initials } from '@/lib/utils'

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/pedidos', label: 'Pedidos', icon: '📦' },
  { href: '/admin/clientes', label: 'Clientes', icon: '👥' },
  { href: '/admin/produtos', label: 'Produtos', icon: '💊' },
  { href: '/admin/relatorios', label: 'Relatórios', icon: '📈' },
]

export function AdminHeader() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 flex-shrink-0 items-center gap-3 bg-admin-500 px-4 text-white shadow-[0_2px_8px_rgba(0,0,0,.2)]">
        <button
          onClick={() => setMenuOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 sm:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <SiteLogo light />
        <nav className="ml-2 hidden flex-1 items-center gap-1 overflow-auto sm:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[13px] font-semibold',
                pathname === l.href ? 'bg-white/20' : 'hover:bg-white/10'
              )}
            >
              <span>{l.icon}</span> {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex flex-shrink-0 items-center gap-2">
          <div className="hidden items-center gap-2 rounded-lg bg-white/15 px-2.5 py-1.5 sm:flex">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-[10px] font-black">
              {user ? initials(user.name) : ''}
            </div>
            <span className="text-[13px] font-semibold">{user?.name.split(' ')[0]}</span>
          </div>
          <LogoutButton className="hidden text-white hover:bg-white/15 sm:inline-flex" />
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/50" onClick={() => setMenuOpen(false)}>
          <div className="flex h-full w-[82vw] max-w-[280px] animate-slide-in flex-col bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between bg-admin-500 p-4 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/25 text-sm font-black">
                  {user ? initials(user.name) : ''}
                </div>
                <div>
                  <div className="text-[13px] font-extrabold">{user?.name}</div>
                  <div className="text-[10px] uppercase tracking-wide text-white/70">Administrador</div>
                </div>
              </div>
              <button onClick={() => setMenuOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-2.5">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'mb-1 flex min-h-[44px] items-center gap-2.5 rounded-lg px-3.5 py-3 text-[14px] font-semibold',
                    pathname === l.href ? 'bg-admin-50 text-admin-600' : 'text-navy-700'
                  )}
                >
                  <span className="text-lg">{l.icon}</span> {l.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-line-200 p-2.5">
              <LogoutButton className="w-full justify-start text-error-500" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
