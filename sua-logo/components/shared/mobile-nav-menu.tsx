'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'

const LINKS = [
  { href: '/', label: 'Início' },
  { href: '/#quem-somos', label: 'Quem somos' },
  { href: '/#como-funciona', label: 'Como funciona' },
]

const ROLES = [
  { href: '/login?role=patient', icon: '👤', label: 'Entrar como paciente' },
  { href: '/login?role=doctor', icon: '🩺', label: 'Entrar como médico' },
  { href: '/login?role=admin', icon: '🛡️', label: 'Entrar como administrador' },
]

export function MobileNavMenu() {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    // Trava o scroll da página enquanto o drawer está aberto.
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

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-line-300 text-navy-700"
      >
        ☰
      </button>
      {open &&
        // Portal no body: o backdrop-blur do header cria um containing block
        // que prenderia o drawer `fixed` dentro dele.
        createPortal(
          <>
            <div className="fixed inset-0 z-40 animate-fade-in bg-navy-900/50 md:hidden" onClick={() => setOpen(false)} />
            <nav
              id="mobile-nav-drawer"
              aria-label="Navegação principal"
              className="fixed inset-y-0 right-0 z-50 flex w-[300px] max-w-[85vw] animate-slide-in-right flex-col bg-white shadow-[-18px_0_40px_rgba(20,50,90,.18)] md:hidden"
            >
            <div className="flex items-center justify-between border-b border-line-200 px-4 py-3">
              <span className="text-[15px] font-extrabold text-navy-800">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-line-300 text-navy-700"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto p-3">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[44px] items-center rounded-[9px] px-3 py-2.5 text-sm font-semibold text-navy-700 hover:bg-surface-soft"
                >
                  {link.label}
                </Link>
              ))}

              <div className="my-2 border-t border-dashed border-line-300" />

              {ROLES.map((role) => (
                <Link
                  key={role.href}
                  href={role.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[44px] items-center gap-2.5 rounded-[9px] px-3 py-2.5 text-sm font-semibold text-navy-700 hover:bg-surface-soft"
                >
                  <span aria-hidden="true">{role.icon}</span>
                  {role.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-line-200 p-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
              <Link
                href="/registro"
                onClick={() => setOpen(false)}
                className="flex min-h-[44px] items-center justify-center rounded-[8px] bg-brand-500 px-3 py-2.5 text-sm font-bold text-primary-on"
              >
                Iniciar consulta
              </Link>
            </div>
          </nav>
        </>,
        document.body
      )}
    </div>
  )
}
