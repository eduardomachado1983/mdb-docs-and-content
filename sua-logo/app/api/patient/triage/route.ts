import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, getUser } from '@/lib/supabase/server'

const schema = z.object({
  main_symptom: z.string().min(1),
  pain_location: z.string().min(1),
  pain_intensity: z.number().min(1).max(10),
  medical_history: z.string().min(1),
  health_history: z.record(z.string()).optional(),
  mental_health: z.array(z.string()).optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  sex: z.string().optional(),
  product_preferences: z.array(z.string()).optional(),
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

  const personalData = (patient.personal_data ?? {}) as { full_name?: string }
  const nextStatus = personalData.full_name ? 'aguardando_pagamento' : patient.status

  const { error } = await supabase.from('patients').update({
    triage: parsed.data,
    status: nextStatus,
  }).eq('id', patient.id)

  if (error) return NextResponse.json({ error: 'Falha ao salvar triagem' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
