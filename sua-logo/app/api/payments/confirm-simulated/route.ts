import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceClient, getUser } from '@/lib/supabase/server'

const schema = z.object({ referenceId: z.string() })

// Confirma um pagamento PIX simulado (sem MERCADOPAGO_ACCESS_TOKEN configurado),
// substituindo o webhook real que normalmente confirmaria o pagamento.
export async function POST(request: Request) {
  if (process.env.MERCADOPAGO_ACCESS_TOKEN) {
    return NextResponse.json({ error: 'Pagamento real configurado — use o webhook' }, { status: 400 })
  }

  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

  const supabase = await createClient()
  const { data: patient } = await supabase.from('patients').select('id').eq('user_id', user.id).single()
  if (!patient) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })

  const serviceClient = await createServiceClient()
  const { data: transaction } = await serviceClient
    .from('payment_transactions')
    .select('id, patient_id, amount')
    .eq('reference_id', parsed.data.referenceId)
    .eq('patient_id', patient.id)
    .single()

  if (!transaction) return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 })

  await serviceClient.from('payment_transactions').update({ status: 'approved' }).eq('id', transaction.id)

  await serviceClient.from('patients').update({
    status: 'aguardando_medico',
    payment: {
      confirmed: true,
      method: 'pix',
      amount: transaction.amount,
      confirmed_at: new Date().toISOString(),
      reference_id: parsed.data.referenceId,
    },
  }).eq('id', patient.id)

  return NextResponse.json({ ok: true })
}
