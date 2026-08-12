import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  expectedRole: z.enum(['patient', 'doctor', 'admin']).optional(),
})

const AREA_LABEL: Record<string, string> = {
  patient: 'do paciente',
  doctor: 'do médico',
  admin: 'do administrador',
}

const DEMO_CREDENTIALS = {
  'contato@em.art.br': { role: 'patient', password: 'A1234567' },
  'medico@sualogo.com.br': { role: 'doctor', password: 'medico123' },
  'admin@sualogo.com.br': { role: 'admin', password: 'admin123' },
}

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const { email, password, expectedRole } = parsed.data

  // Verificar credenciais demo
  const demo = DEMO_CREDENTIALS[email as keyof typeof DEMO_CREDENTIALS]
  if (demo && demo.password === password) {
    if (expectedRole && expectedRole !== demo.role) {
      return NextResponse.json(
        { error: `Esta conta é da área ${AREA_LABEL[demo.role]}. Selecione a área correta para entrar.` },
        { status: 403 }
      )
    }

    // Criar sessão demo
    const cookieStore = await cookies()
    cookieStore.set('demo_user', JSON.stringify({ role: demo.role, email }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    })

    return NextResponse.json({ role: demo.role })
  }

  // Tentar autenticação via Supabase
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  const role = profile?.role ?? 'patient'

  if (expectedRole && expectedRole !== role) {
    await supabase.auth.signOut()
    return NextResponse.json(
      { error: `Esta conta é da área ${AREA_LABEL[role]}. Selecione a área correta para entrar.` },
      { status: 403 }
    )
  }

  return NextResponse.json({ role })
}
