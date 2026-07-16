import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  expectedRole: z.enum(['patient', 'doctor', 'admin']).optional(),
})

// Nome da área de cada papel, para a mensagem de erro quando o papel
// selecionado no login não corresponde ao da conta.
const AREA_LABEL: Record<string, string> = {
  patient: 'do paciente',
  doctor: 'do médico',
  admin: 'do administrador',
}

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
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

  // O papel selecionado na tela de login precisa bater com o papel da conta.
  // Se não bater, encerra a sessão recém-criada e bloqueia o acesso.
  if (parsed.data.expectedRole && parsed.data.expectedRole !== role) {
    await supabase.auth.signOut()
    return NextResponse.json(
      { error: `Esta conta é da área ${AREA_LABEL[role]}. Selecione a área correta para entrar.` },
      { status: 403 }
    )
  }

  return NextResponse.json({ role })
}
