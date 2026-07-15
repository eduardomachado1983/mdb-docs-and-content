import { NextResponse } from 'next/server'
import { createClient, createServiceClient, getUser } from '@/lib/supabase/server'
import { createPixPayment } from '@/lib/mercadopago'
import { extractMpError } from '@/lib/mp-error'

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
  const cpf = (personalData.cpf ?? '').replace(/\D/g, '')
  if (cpf.length !== 11) {
    return NextResponse.json(
      { error: 'CPF inválido no cadastro. Atualize seus dados pessoais com um CPF válido antes de pagar.' },
      { status: 400 }
    )
  }

  try {
    const pix = await createPixPayment({
      patientId: patient.id,
      name: personalData.full_name || 'Paciente',
      email: user.email!,
      cpf,
    })

    const serviceClient = await createServiceClient()
    await serviceClient.from('payment_transactions').insert({
      patient_id: patient.id,
      reference_id: pix.referenceId,
      amount: Number(process.env.CONSULTATION_AMOUNT || '200'),
      method: 'pix',
      status: 'pending',
      gateway_response: pix,
    })

    return NextResponse.json(pix)
  } catch (error) {
    return NextResponse.json({ error: extractMpError(error) }, { status: 500 })
  }
}
