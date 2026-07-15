import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, getUser } from '@/lib/supabase/server'

const schema = z.object({
  full_name: z.string().min(2),
  cpf: z.string().min(11),
  rg: z.string().min(1),
  birth_date: z.string().min(1),
  phone: z.string().min(8),
  cep: z.string().optional(),
  address: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
})

export async function PATCH(request: Request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

  const supabase = await createClient()
  const { data: patient } = await supabase
    .from('patients').select('id, status, personal_data').eq('user_id', user.id).single()
  if (!patient) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })

  // Mescla com o personal_data existente — formulários que não enviam todos
  // os campos (ex.: "Meus dados" ainda não edita endereço) não podem apagar
  // o que já foi salvo em outra etapa.
  const existing = (patient.personal_data ?? {}) as Record<string, unknown>
  const { error } = await supabase
    .from('patients')
    .update({ personal_data: { ...existing, ...parsed.data, email: user.email } })
    .eq('id', patient.id)

  if (error) return NextResponse.json({ error: 'Falha ao salvar' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
