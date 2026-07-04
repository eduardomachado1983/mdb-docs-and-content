import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }
  const { name, email, password } = parsed.data

  const serviceClient = await createServiceClient()
  const { data: created, error: createError } = await serviceClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, role: 'patient' },
  })

  if (createError || !created.user) {
    const message = createError?.message.includes('already been registered')
      ? 'Este email já está cadastrado'
      : 'Não foi possível criar a conta'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const supabase = await createClient()
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  if (signInError) {
    return NextResponse.json({ error: 'Conta criada, mas falha ao entrar. Tente fazer login.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
