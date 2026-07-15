import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient, getProfile } from '@/lib/supabase/server'

async function requireDoctor() {
  const profile = await getProfile()
  if (!profile || profile.role !== 'doctor') return null
  return profile
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await requireDoctor()
  if (!profile) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await params
  const supabase = await createServiceClient()
  const { data: patient } = await supabase.from('patients').select('*').eq('id', id).single()
  if (!patient) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })

  const { data: documents } = await supabase.from('documents').select('*').eq('patient_id', id)
  return NextResponse.json({ patient, documents: documents ?? [] })
}

const schema = z.object({
  prescription: z.string().optional(),
  report: z.string().optional(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await requireDoctor()
  if (!profile) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await params
  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

  const supabase = await createServiceClient()
  const { error } = await supabase.from('patients').update({
    status: 'retido_admin',
    clinical: {
      ...parsed.data,
      saved_by_doctor: true,
      saved_at: new Date().toISOString(),
    },
  }).eq('id', id)

  if (error) return NextResponse.json({ error: 'Falha ao salvar prontuário' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
