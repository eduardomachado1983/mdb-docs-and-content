'use client'

import { useState } from 'react'
import Link from 'next/link'

const ROLES = [
  { href: '/login?role=patient', icon: '👤', label: 'Paciente' },
  { href: '/login?role=doctor', icon: '🩺', label: 'Médico' },
  { href: '/login?role=admin', icon: '🛡️', label: 'Administrador' },
]

export function LoginMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-[10px] border border-line-400 bg-white px-4 py-2.5 text-sm font-bold text-navy-700"
      >
        Entrar ▾
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-[52px] z-50 w-[210px] rounded-2xl border border-line-200 bg-white p-2 shadow-[0_18px_40px_rgba(20,50,90,.16)]">
            <div className="px-2.5 pb-1 pt-2 text-[11px] font-bold tracking-wide text-navy-100">ENTRAR COMO</div>
            {ROLES.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="flex items-center gap-2.5 rounded-[9px] px-2.5 py-2.5 text-sm font-semibold text-navy-700 hover:bg-surface-soft"
              >
                <span>{r.icon}</span>
                {r.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
