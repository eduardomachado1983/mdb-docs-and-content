'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/mock-auth'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('carlos@email.com')
  const [password, setPassword] = useState('Paciente1')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const user = login(email, password)
    if (!user) {
      setError('E-mail ou senha incorretos.')
      return
    }
    router.push(user.role === 'admin' ? '/admin' : '/loja')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-500 to-brand-400 p-4">
      <div className="w-full max-w-[380px]">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-[28px]">💊</div>
          <h1 className="text-[22px] font-black text-white">PharmaCRM</h1>
          <p className="mt-1 text-[12px] text-white/70">Medicamentos com segurança e cuidado</p>
        </div>
        <Card className="p-6">
          <h2 className="mb-4 text-base font-extrabold text-navy-800">Entrar na conta</h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <Label>E-mail</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Senha</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && (
              <div className="rounded-lg border-l-[3px] border-error-500 bg-error-50 px-3 py-2 text-[12px] font-semibold text-error-500">
                {error}
              </div>
            )}
            <Button className="justify-center" onClick={handleSubmit}>Entrar</Button>
          </div>
          <div className="mt-3.5 border-t border-line-200 pt-3.5 text-center">
            <span className="text-[12px] text-navy-300">Não tem conta? </span>
            <Link href="/registro" className="text-[12px] font-bold text-brand-500">Cadastre-se</Link>
          </div>
        </Card>
        <div className="mt-3.5 rounded-lg bg-white/10 p-3">
          <p className="mb-1.5 text-[11px] font-bold text-white/80">🔑 Credenciais demo:</p>
          <p className="text-[11px] text-white/65">👤 Cliente: carlos@email.com / Paciente1</p>
          <p className="mt-0.5 text-[11px] text-white/65">🔧 Admin: admin@pharmacrm.com / Admin123</p>
        </div>
        <div className="mt-3 text-center">
          <Link href="/" className="text-[12px] text-white/60">← Voltar ao site</Link>
        </div>
      </div>
    </div>
  )
}
