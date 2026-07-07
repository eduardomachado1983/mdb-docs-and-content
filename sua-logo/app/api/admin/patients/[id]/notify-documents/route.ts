import { NextResponse } from 'next/server'
import { createServiceClient, getProfile } from '@/lib/supabase/server'
import type { AdminValidation } from '@/types'

// Não há provedor de e-mail/SMS configurado neste ambiente (ver CLAUDE.md —
// só Supabase e Mercado Pago). Em vez de enviar de fato, registramos a
// solicitação em admin_validation para o paciente ver o aviso na área dele.
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await getProfile()
  if (!profile || profile.role !== 'admin') return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await params
  const supabase = await createServiceClient()
  const { data: patient } = await supabase.from('patients').select('admin_validation').eq('id', id).single()
  if (!patient) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })

  const adminValidation = (patient.admin_validation ?? {}) as AdminValidation

  const { error } = await supabase.from('patients').update({
    admin_validation: {
      ...adminValidation,
      document_reminder_sent_at: new Date().toISOString(),
    },
  }).eq('id', id)

  if (error) return NextResponse.json({ error: 'Falha ao registrar notificação' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
