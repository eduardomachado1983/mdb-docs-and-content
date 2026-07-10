'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const LINKS = [
  { href: '/', label: 'Início' },
  { href: '/#quem-somos', label: 'Quem somos' },
  { href: '/#consultas', label: 'Consultas' },
  { href: '/#como-funciona', label: 'Como funciona' },
  { href: '/#faq', label: 'Dúvidas' },
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
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <div className="relative md:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-line-300 text-navy-700"
      >
        {open ? '✕' : '☰'}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <nav
            id="mobile-nav-panel"
            aria-label="Navegação principal"
            className="absolute right-0 top-[52px] z-50 w-[240px] rounded-2xl border border-white/30 bg-white/90 backdrop-blur-xl p-2 shadow-[0_18px_40px_rgba(20,50,90,.16)]"
          >
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-[9px] px-3 py-2.5 text-sm font-semibold text-navy-700 hover:bg-surface-soft"
              >
                {link.label}
              </Link>
            ))}

            <div className="my-1.5 border-t border-dashed border-line-300" />

            {ROLES.map((role) => (
              <Link
                key={role.href}
                href={role.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-[9px] px-3 py-2.5 text-sm font-semibold text-navy-700 hover:bg-surface-soft"
              >
                <span aria-hidden="true">{role.icon}</span>
                {role.label}
              </Link>
            ))}

            <Link
              href="/registro"
              onClick={() => setOpen(false)}
              className="mt-1.5 block rounded-[4px] bg-brand-500 px-3 py-2.5 text-center text-sm font-bold text-primary-on"
            >
              Iniciar consulta
            </Link>
          </nav>
        </>
      )}
    </div>
  )
}
