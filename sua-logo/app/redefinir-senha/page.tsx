'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { SiteHeader } from '@/components/shared/site-header'
import { createClient } from '@/lib/supabase/client'
import { validatePassword } from '@/lib/validators'
import { cn } from '@/lib/utils'

function RedefinirSenhaForm() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [senha, setSenha] = useState('')
  const [senha2, setSenha2] = useState('')
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState<{ senha?: string | null; senha2?: string | null }>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // O link do e-mail carrega o token no hash da URL; o client do Supabase
    // detecta e troca por uma sessão automaticamente (detectSessionInUrl).
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        toast.error('Link inválido ou expirado. Solicite a recuperação novamente.')
        router.push('/login')
        return
      }
      setReady(true)
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next = {
      senha: validatePassword(senha),
      senha2: senha2 !== senha ? 'As senhas não coincidem.' : null,
    }
    setErrors(next)
    if (next.senha || next.senha2) {
      toast.error('Revise os campos destacados.')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: senha })
      if (error) {
        toast.error('Não foi possível redefinir a senha. Tente novamente.')
        return
      }
      toast.success('Senha redefinida! Faça login com a nova senha.')
      await supabase.auth.signOut()
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
          <div className="mb-1 text-[21px] font-extrabold leading-tight">Nova senha</div>
          <p className="mb-6 text-sm leading-relaxed text-navy-300">Escolha uma nova senha para sua conta.</p>

          {!ready ? (
            <p className="text-sm text-navy-300">Verificando link...</p>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1.5 block text-[13px] font-bold text-navy-700">Nova senha</label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Crie uma senha"
                    autoComplete="new-password"
                    aria-invalid={Boolean(errors.senha)}
                    className={cn(
                      'w-full rounded-[11px] border px-3.5 py-3 pr-11 outline-none focus:ring-2 focus:ring-brand-200',
                      errors.senha ? 'border-error-500 focus:border-error-500' : 'border-line-400 focus:border-brand-500'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-300 hover:text-navy-600"
                  >
                    {show ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
                {errors.senha ? (
                  <p className="mt-1 text-xs font-semibold text-error-500">{errors.senha}</p>
                ) : (
                  <p className="mt-1 text-xs text-navy-200">Mínimo 8 caracteres, com maiúscula, minúscula e número.</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-bold text-navy-700">Confirmar nova senha</label>
                <input
                  type={show ? 'text' : 'password'}
                  value={senha2}
                  onChange={(e) => setSenha2(e.target.value)}
                  placeholder="Repita a senha"
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.senha2)}
                  className={cn(
                    'w-full rounded-[11px] border px-3.5 py-3 outline-none focus:ring-2 focus:ring-brand-200',
                    errors.senha2 ? 'border-error-500 focus:border-error-500' : 'border-line-400 focus:border-brand-500'
                  )}
                />
                {errors.senha2 && <p className="mt-1 text-xs font-semibold text-error-500">{errors.senha2}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-1 rounded-full bg-brand-500 py-3.5 text-[15px] font-bold text-primary-on disabled:opacity-60"
              >
                {loading ? 'Salvando...' : 'Salvar nova senha'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense>
      <RedefinirSenhaForm />
    </Suspense>
  )
}
