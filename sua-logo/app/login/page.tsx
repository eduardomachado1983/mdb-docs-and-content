'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const ROLE_REDIRECT: Record<string, string> = {
  patient: '/dashboard',
  doctor: '/medico',
  admin: '/admin',
}

const ROLES = {
  patient: {
    label: 'Paciente',
    icon: '👤',
    desc: 'Acompanhe seu atendimento e baixe seus documentos.',
    bg: 'bg-brand-500',
    lightBg: 'bg-brand-100',
    text: 'text-brand-500',
    demo: { label: 'Paciente demo', email: 'contato@em.art.br', password: 'A1234567' },
  },
  doctor: {
    label: 'Médico',
    icon: '🩺',
    desc: 'Atenda pacientes e emita receitas e laudos.',
    bg: 'bg-teal-500',
    lightBg: 'bg-teal-100',
    text: 'text-teal-600',
    demo: { label: 'Médico demo', email: 'medico@sualogo.com.br', password: 'medico123' },
  },
  admin: {
    label: 'Administrador',
    icon: '🛡️',
    desc: 'Valide documentos e gerencie a plataforma.',
    bg: 'bg-admin-500',
    lightBg: 'bg-admin-100',
    text: 'text-admin-500',
    demo: { label: 'Admin demo', email: 'admin@sualogo.com.br', password: 'admin123' },
  },
} as const

type RoleKey = keyof typeof ROLES

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRole = (searchParams.get('role') as RoleKey) in ROLES ? (searchParams.get('role') as RoleKey) : 'patient'

  const [role, setRole] = useState<RoleKey>(initialRole)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const config = ROLES[role]

  function selectRole(next: RoleKey) {
    setRole(next)
    setEmail('')
    setPassword('')
  }

  async function doLogin(emailValue: string, passwordValue: string) {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailValue, password: passwordValue }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Falha ao entrar')
        return
      }
      router.push(ROLE_REDIRECT[data.role] ?? '/dashboard')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-surface-page to-brand-50 px-6 py-8">
      <div className="mx-auto flex w-full max-w-[1140px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-brand-500 to-teal-500 text-xs font-extrabold text-white">
            SL
          </div>
          <span className="text-base font-extrabold text-navy-800">Sua Logo</span>
        </Link>
        <Link href="/" className="text-sm font-semibold text-navy-500">← Voltar ao início</Link>
      </div>

      <div className="mx-auto mt-16 w-full max-w-[376px]">
        <div className="rounded-[22px] border border-line-200 bg-white p-8 shadow-[0_24px_50px_rgba(20,50,90,.08)]">
          <div className="mb-5 flex items-center gap-3.5">
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-[13px] text-2xl', config.bg)}>
              {config.icon}
            </div>
            <div>
              <div className="text-xs font-bold tracking-wide text-navy-100">ÁREA DO</div>
              <div className="text-[21px] font-extrabold leading-tight">{config.label}</div>
            </div>
          </div>
          <p className="mb-6 text-sm leading-relaxed text-navy-300">{config.desc}</p>

          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              doLogin(email, password)
            }}
          >
            <div>
              <label className="mb-1.5 block text-[13px] font-bold text-navy-700">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-[11px] border border-line-400 px-3.5 py-3 outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-bold text-navy-700">Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full rounded-[11px] border border-line-400 px-3.5 py-3 outline-none focus:border-brand-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={cn('mt-1 rounded-[11px] py-3.5 text-[15px] font-bold text-white disabled:opacity-60', config.bg)}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="my-6 border-t border-dashed border-line-300" />

          <div className="mb-3 text-xs font-bold tracking-wide text-navy-100">CONTAS DE DEMONSTRAÇÃO</div>
          <button
            disabled={loading}
            onClick={() => doLogin(config.demo.email, config.demo.password)}
            className="flex w-full items-center justify-between gap-2.5 rounded-[10px] border border-line-200 bg-surface-subtle px-3 py-2.5 text-left hover:border-brand-200 hover:bg-brand-50"
          >
            <span className="text-[13px] font-bold text-navy-700">{config.demo.label}</span>
            <span className="text-xs text-navy-200">{config.demo.email}</span>
          </button>

          <p className="mt-6 text-center text-sm text-navy-300">
            Não tem conta? <Link href="/registro" className="font-semibold text-brand-500">Cadastre-se</Link>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2.5 text-sm text-navy-300">
          {(Object.keys(ROLES) as RoleKey[]).map((key, i) => (
            <span key={key} className="flex items-center gap-2.5">
              {i > 0 && <span className="text-line-400">•</span>}
              <button
                onClick={() => selectRole(key)}
                className={role === key ? 'font-bold text-navy-700' : 'text-navy-300'}
              >
                {ROLES[key].label}
              </button>
            </span>
          ))}
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
