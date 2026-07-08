import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient, getProfile } from '@/lib/supabase/server'

const schema = z.object({
  full_name: z.string().min(2),
  cpf: z.string().min(11),
  rg: z.string().min(1),
  birth_date: z.string().min(1),
  phone: z.string().min(8),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await getProfile()
  if (!profile || profile.role !== 'admin') return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await params
  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

  const supabase = await createServiceClient()
  const { data: patient } = await supabase.from('patients').select('personal_data').eq('id', id).single()
  if (!patient) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })

  const existing = (patient.personal_data ?? {}) as Record<string, unknown>
  const { error } = await supabase
    .from('patients')
    .update({ personal_data: { ...existing, ...parsed.data } })
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Falha ao salvar' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
