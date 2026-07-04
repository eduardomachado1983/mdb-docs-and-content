'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const ROLE_REDIRECT: Record<string, string> = {
  patient: '/dashboard',
  doctor: '/medico',
  admin: '/admin',
}

const DEMO_ACCOUNTS = [
  { label: 'Paciente demo', email: 'contato@em.art.br', password: 'A1234567' },
  { label: 'Médico demo', email: 'medico@sualogo.com.br', password: 'medico123' },
  { label: 'Admin demo', email: 'admin@sualogo.com.br', password: 'admin123' },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

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
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>Acesse sua conta da Sua Logo Telemedicina.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              doLogin(email, password)
            }}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            acesso rápido (demo)
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="flex flex-col gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <Button
                key={acc.email}
                variant="outline"
                disabled={loading}
                onClick={() => doLogin(acc.email, acc.password)}
              >
                {acc.label}
              </Button>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500">
            Não tem conta? <Link href="/registro" className="text-teal-600 hover:underline">Cadastre-se</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
