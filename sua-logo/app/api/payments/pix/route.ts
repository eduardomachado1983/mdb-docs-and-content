import { NextResponse } from 'next/server'
import { createClient, getUser } from '@/lib/supabase/server'
import { createPixPayment } from '@/lib/mercadopago'

export async function POST() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const supabase = await createClient()
  const { data: patient } = await supabase
    .from('patients').select('id, status, personal_data').eq('user_id', user.id).single()

  if (!patient) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })
  if (patient.status !== 'aguardando_pagamento') {
    return NextResponse.json({ error: 'Paciente não está aguardando pagamento' }, { status: 400 })
  }

  const personalData = (patient.personal_data ?? {}) as { full_name?: string; cpf?: string }

  try {
    const pix = await createPixPayment({
      patientId: patient.id,
      name: personalData.full_name || 'Paciente',
      email: user.email!,
      cpf: personalData.cpf || '00000000000',
    })

    await supabase.from('payment_transactions').insert({
      patient_id: patient.id,
      reference_id: pix.referenceId,
      amount: Number(process.env.CONSULTATION_AMOUNT || '200'),
      method: 'pix',
      status: 'pending',
      gateway_response: pix,
    })

    return NextResponse.json(pix)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Falha ao gerar pagamento' }, { status: 500 })
  }
}
