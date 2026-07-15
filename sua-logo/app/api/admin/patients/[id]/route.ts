import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient, getProfile, getUser } from '@/lib/supabase/server'

async function requireAdmin() {
  const profile = await getProfile()
  if (!profile || profile.role !== 'admin') return null
  return profile
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await requireAdmin()
  if (!profile) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await params
  const supabase = await createServiceClient()
  const { data: patient } = await supabase.from('patients').select('*').eq('id', id).single()
  if (!patient) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })

  const { data: documents } = await supabase.from('documents').select('*').eq('patient_id', id)
  return NextResponse.json({ patient, documents: documents ?? [] })
}

const schema = z.object({
  identity_approved: z.boolean(),
  financial_approved: z.boolean(),
  clinical_approved: z.boolean(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await requireAdmin()
  if (!profile) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const user = await getUser()
  const { id } = await params
  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

  const allApproved = parsed.data.identity_approved && parsed.data.financial_approved && parsed.data.clinical_approved

  const supabase = await createServiceClient()
  const { error } = await supabase.from('patients').update({
    status: allApproved ? 'concluido' : 'retido_admin',
    admin_validation: {
      ...parsed.data,
      ...(allApproved ? { released_at: new Date().toISOString(), released_by: user?.id } : {}),
    },
  }).eq('id', id)

  if (error) return NextResponse.json({ error: 'Falha ao salvar validação' }, { status: 500 })
  return NextResponse.json({ ok: true, released: allApproved })
}
