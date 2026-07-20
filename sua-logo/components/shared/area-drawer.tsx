'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { cn, initials } from '@/lib/utils'

export interface AreaDrawerTab {
  href: string
  label: string
}

// Drawer de navegação mobile das áreas logadas (paciente, médico, admin).
// Fundo sólido, desliza da direita via portal no body (o backdrop-blur do
// header criaria um containing block que clipava o painel `fixed`).
export function AreaDrawer({
  tabs,
  userName,
  userDetail,
  avatarClass,
}: {
  tabs: AreaDrawerTab[]
  userName: string
  userDetail?: string | null
  avatarClass: string
}) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        aria-expanded={open}
        aria-controls="area-drawer"
        className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-line-300 text-navy-700"
      >
        ☰
      </button>
      {open &&
        createPortal(
          <>
            <div className="fixed inset-0 z-40 animate-fade-in bg-navy-900/50 md:hidden" onClick={() => setOpen(false)} />
            <nav
              id="area-drawer"
              aria-label="Navegação da área"
              className="fixed inset-y-0 right-0 z-50 flex w-[300px] max-w-[85vw] animate-slide-in-right flex-col bg-white shadow-[-18px_0_40px_rgba(20,50,90,.18)] md:hidden"
            >
              <div className="flex items-center justify-between border-b border-line-200 px-4 py-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className={cn('flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full text-[13px] font-bold', avatarClass)}>
                    {initials(userName)}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold leading-tight text-navy-800">{userName}</div>
                    {userDetail && <div className="truncate text-xs leading-tight text-navy-200">{userDetail}</div>}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fechar menu"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] border border-line-300 text-navy-700"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-1 flex-col overflow-y-auto p-3">
                {tabs.map((tab) => (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex min-h-[44px] items-center rounded-[9px] px-3 py-2.5 text-sm font-semibold hover:bg-surface-soft',
                      pathname === tab.href ? 'bg-surface-soft text-navy-900' : 'text-navy-700'
                    )}
                  >
                    {tab.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-line-200 p-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[8px] border border-line-300 px-3 py-2.5 text-sm font-bold text-navy-700"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Sair
                </button>
              </div>
            </nav>
          </>,
          document.body
        )}
    </div>
  )
}
