import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const schema = z.object({ email: z.string().email() })

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Informe um e-mail válido' }, { status: 400 })
  }

  const supabase = await createClient()
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/redefinir-senha`,
  })

  // Sempre responde ok, exista ou não a conta — evita confirmar por
  // enumeração se um e-mail está cadastrado.
  return NextResponse.json({ ok: true })
}
