import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, getUser } from '@/lib/supabase/server'

const schema = z.object({
  full_name: z.string().min(2),
  cpf: z.string().min(11),
  rg: z.string().min(1),
  birth_date: z.string().min(1),
  phone: z.string().min(8),
})

export async function PATCH(request: Request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

  const supabase = await createClient()
  const { data: patient } = await supabase
    .from('patients').select('id, status').eq('user_id', user.id).single()
  if (!patient) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })

  const { error } = await supabase
    .from('patients')
    .update({ personal_data: { ...parsed.data, email: user.email } })
    .eq('id', patient.id)

  if (error) return NextResponse.json({ error: 'Falha ao salvar' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
