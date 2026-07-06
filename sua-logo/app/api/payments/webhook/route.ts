import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getPaymentById, validateWebhookSignature } from '@/lib/mercadopago'

export async function POST(request: Request) {
  const xSignature = request.headers.get('x-signature') ?? ''
  const xRequestId = request.headers.get('x-request-id') ?? ''
  const url = new URL(request.url)
  const dataId = url.searchParams.get('data.id') ?? ''
  const ts = xSignature.split(',').find((p) => p.startsWith('ts='))?.replace('ts=', '') ?? ''

  if (!validateWebhookSignature(xSignature, xRequestId, dataId, ts)) {
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 })
  }

  const body = await request.json()
  if (body.type !== 'payment' || !dataId) return NextResponse.json({ ok: true })

  const payment = await getPaymentById(dataId)
  const referenceId = payment.external_reference
  if (!referenceId) return NextResponse.json({ ok: true })

  const supabase = await createServiceClient()
  const { data: transaction } = await supabase
    .from('payment_transactions').select('id, patient_id').eq('reference_id', referenceId).single()
  if (!transaction) return NextResponse.json({ ok: true })

  await supabase.from('payment_transactions')
    .update({
      status: payment.status === 'approved' ? 'approved' : 'rejected',
      gateway_response: JSON.parse(JSON.stringify(payment)),
    })
    .eq('id', transaction.id)

  if (payment.status === 'approved') {
    await supabase.from('patients').update({
      status: 'aguardando_medico',
      payment: {
        confirmed: true,
        method: 'pix',
        amount: payment.transaction_amount ? payment.transaction_amount * 100 : null,
        confirmed_at: new Date().toISOString(),
        reference_id: referenceId,
      },
    }).eq('id', transaction.patient_id)
  }

  return NextResponse.json({ ok: true })
}
