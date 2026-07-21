'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { SiteHeader } from '@/components/shared/site-header'
import { cn } from '@/lib/utils'
import { validateEmail } from '@/lib/validators'

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
    text: 'text-brand-700',
    onBg: 'text-primary-on',
    demo: { label: 'Paciente demo', email: 'contato@em.art.br', displayEmail: 'contato@em.art.br', password: 'A1234567' },
  },
  doctor: {
    label: 'Médico',
    icon: '🩺',
    desc: 'Atenda pacientes e emita receitas e laudos.',
    bg: 'bg-teal-500',
    lightBg: 'bg-teal-100',
    text: 'text-navy-900',
    onBg: 'text-primary-on',
    demo: { label: 'Médico demo', email: 'medico@sualogo.com.br', displayEmail: 'medico@biosativa.com.br', password: 'medico123' },
  },
  admin: {
    label: 'Administrador',
    icon: '🛡️',
    desc: 'Valide documentos e gerencie a plataforma.',
    bg: 'bg-admin-500',
    lightBg: 'bg-admin-100',
    text: 'text-admin-500',
    onBg: 'text-white',
    demo: { label: 'Admin demo', email: 'admin@sualogo.com.br', displayEmail: 'admin@biosativa.com.br', password: 'admin123' },
  },
} as const

type RoleKey = keyof typeof ROLES

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role')
  // O papel é derivado da URL (?role=...) a cada render, para que o
  // menu "Entrar" do header troque o formulário sem precisar recarregar.
  const role: RoleKey = roleParam && roleParam in ROLES ? (roleParam as RoleKey) : 'patient'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null }>({})
  const [loading, setLoading] = useState(false)

  const [forgotMode, setForgotMode] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotError, setForgotError] = useState<string | null>(null)

  const config = ROLES[role]

  async function doLogin(emailValue: string, passwordValue: string, opts: { skipValidation?: boolean } = {}) {
    if (!opts.skipValidation) {
      const next = {
        email: validateEmail(emailValue),
        password: passwordValue ? null : 'Informe sua senha.',
      }
      setErrors(next)
      if (next.email || next.password) {
        toast.error('Revise os campos destacados.')
        return
      }
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailValue, password: passwordValue, expectedRole: role }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Falha ao entrar')
        return
      }
      // Só push: a resposta do fetch já aplicou o cookie de sessão, então a
      // navegação já busca a rota de destino autenticada. Um router.refresh()
      // aqui duplicaria essa busca e deixaria o login mais lento.
      router.push(ROLE_REDIRECT[data.role] ?? '/dashboard')
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault()
    const error = validateEmail(forgotEmail)
    setForgotError(error)
    if (error) {
      toast.error('Revise o campo destacado.')
      return
    }

    setLoading(true)
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      })
      toast.success('Se houver uma conta com esse e-mail, enviamos um link para redefinir a senha.')
      setForgotMode(false)
      setForgotEmail('')
      setForgotError(null)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-surface-page to-brand-50">
      <SiteHeader />

      <div className="mx-auto grid max-w-[1140px] justify-items-center px-6 pb-12 pt-16">
        <div className="w-full max-w-[376px] rounded-[22px] border border-white/30 bg-white/65 backdrop-blur-xl p-8 shadow-[0_24px_50px_rgba(20,50,90,.08)]">
          {forgotMode ? (
            <>
              <div className="mb-1 text-[21px] font-extrabold leading-tight">Recuperar senha</div>
              <p className="mb-6 text-sm leading-relaxed text-navy-300">
                Informe seu e-mail e enviaremos um link para redefinir a senha.
              </p>

              <form className="flex flex-col gap-4" onSubmit={handleForgotSubmit}>
                <div>
                  <label className="mb-1.5 block text-[13px] font-bold text-navy-700">E-mail</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value)
                      if (forgotError) setForgotError(null)
                    }}
                    placeholder="seu@email.com"
                    autoComplete="off"
                    aria-invalid={Boolean(forgotError)}
                    className={cn(
                      'w-full rounded-[11px] border px-3.5 py-3 outline-none focus:ring-2 focus:ring-brand-200',
                      forgotError ? 'border-error-500 focus:border-error-500' : 'border-line-400 focus:border-brand-500'
                    )}
                  />
                  {forgotError && <p className="mt-1 text-xs font-semibold text-error-500">{forgotError}</p>}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={cn('mt-1 rounded-[8px] py-3.5 text-[15px] font-bold disabled:opacity-60', config.bg, config.onBg)}
                >
                  {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                </button>
              </form>

              <button
                onClick={() => {
                  setForgotMode(false)
                  setForgotEmail('')
                  setForgotError(null)
                }}
                className="mt-6 w-full text-center text-sm font-semibold text-brand-600"
              >
                ← Voltar para o login
              </button>
            </>
          ) : (
            <>
              <div className="mb-5 flex items-center gap-3.5">
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-[13px] text-2xl', config.bg)}>
                  {config.icon}
                </div>
                <div>
                  <div className="text-xs font-bold tracking-wide text-navy-100">ÁREA DO</div>
                  <div className="text-[21px] font-extrabold leading-tight">{config.label}</div>
                </div>
              </div>
              <p className="mb-6 min-h-[45px] text-sm leading-relaxed text-navy-300">{config.desc}</p>

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
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors((prev) => ({ ...prev, email: null }))
                    }}
                    placeholder="seu@email.com"
                    autoComplete="off"
                    aria-invalid={Boolean(errors.email)}
                    className={cn(
                      'w-full rounded-[11px] border px-3.5 py-3 outline-none focus:ring-2 focus:ring-brand-200',
                      errors.email ? 'border-error-500 focus:border-error-500' : 'border-line-400 focus:border-brand-500'
                    )}
                  />
                  {errors.email && <p className="mt-1 text-xs font-semibold text-error-500">{errors.email}</p>}
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-[13px] font-bold text-navy-700">Senha</label>
                    <button
                      type="button"
                      onClick={() => setForgotMode(true)}
                      className="text-xs font-semibold text-brand-600"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors((prev) => ({ ...prev, password: null }))
                    }}
                    placeholder="••••••"
                    autoComplete="off"
                    aria-invalid={Boolean(errors.password)}
                    className={cn(
                      'w-full rounded-[11px] border px-3.5 py-3 outline-none focus:ring-2 focus:ring-brand-200',
                      errors.password ? 'border-error-500 focus:border-error-500' : 'border-line-400 focus:border-brand-500'
                    )}
                  />
                  {errors.password && <p className="mt-1 text-xs font-semibold text-error-500">{errors.password}</p>}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={cn('mt-1 rounded-[8px] py-3.5 text-[15px] font-bold disabled:opacity-60', config.bg, config.onBg)}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </form>

              <div className="my-6 border-t border-dashed border-line-300" />

              <div className="mb-3 text-xs font-bold tracking-wide text-navy-100">CONTAS DE DEMONSTRAÇÃO</div>
              <button
                disabled={loading}
                onClick={() => doLogin(config.demo.email, config.demo.password, { skipValidation: true })}
                className="flex w-full items-center justify-between gap-2.5 rounded-[10px] border border-line-200 bg-surface-subtle px-3 py-2.5 text-left hover:border-brand-200 hover:bg-brand-50"
              >
                <span className="text-[13px] font-bold text-navy-700">{config.demo.label}</span>
                <span className="text-xs text-navy-200">{config.demo.displayEmail}</span>
              </button>

              <p className="mt-6 text-center text-sm text-navy-300">
                Não tem conta? <Link href="/registro" className="font-semibold text-brand-600">Cadastre-se</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
