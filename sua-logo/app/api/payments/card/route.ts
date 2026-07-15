import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceClient, getUser } from '@/lib/supabase/server'
import { createCardPayment } from '@/lib/mercadopago'
import { extractMpError } from '@/lib/mp-error'

const schema = z.object({
  token: z.string().min(1),
  paymentMethodId: z.string().min(1),
  issuerId: z.union([z.string(), z.number()]).optional(),
})

export async function POST(request: Request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const detail = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')
    return NextResponse.json({ error: `Dados inválidos (${detail})` }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: patient } = await supabase
    .from('patients').select('id, status, personal_data').eq('user_id', user.id).single()

  if (!patient) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })
  if (patient.status !== 'aguardando_pagamento') {
    return NextResponse.json({ error: 'Paciente não está aguardando pagamento' }, { status: 400 })
  }

  const personalData = (patient.personal_data ?? {}) as { cpf?: string }

  try {
    const result = await createCardPayment({
      patientId: patient.id,
      email: user.email!,
      cpf: personalData.cpf || '00000000000',
      token: parsed.data.token,
      paymentMethodId: parsed.data.paymentMethodId,
      issuerId: parsed.data.issuerId !== undefined ? String(parsed.data.issuerId) : undefined,
      installments: 1,
    })

    const approved = result.status === 'approved'

    const serviceClient = await createServiceClient()
    await serviceClient.from('payment_transactions').insert({
      patient_id: patient.id,
      reference_id: result.referenceId,
      amount: Number(process.env.CONSULTATION_AMOUNT || '200'),
      method: 'card',
      status: approved ? 'approved' : 'pending',
      gateway_response: result,
    })

    if (approved) {
      await serviceClient.from('patients').update({
        status: 'aguardando_medico',
        payment: {
          confirmed: true,
          method: 'card',
          amount: Number(process.env.CONSULTATION_AMOUNT || '200'),
          confirmed_at: new Date().toISOString(),
          reference_id: result.referenceId,
        },
      }).eq('id', patient.id)
    }

    return NextResponse.json({ ok: true, status: result.status, approved })
  } catch (error) {
    return NextResponse.json({ error: extractMpError(error) }, { status: 500 })
  }
}
