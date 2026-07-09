import { NextResponse } from 'next/server'
import { createServiceClient, getUser } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const referenceId = new URL(request.url).searchParams.get('referenceId')
  if (!referenceId) return NextResponse.json({ error: 'referenceId obrigatório' }, { status: 400 })

  const supabase = await createServiceClient()
  const { data: patient } = await supabase.from('patients').select('id, status').eq('user_id', user.id).single()
  if (!patient) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })

  const { data: transaction } = await supabase
    .from('payment_transactions')
    .select('status')
    .eq('reference_id', referenceId)
    .eq('patient_id', patient.id)
    .single()

  if (!transaction) return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 })
  return NextResponse.json({ status: transaction.status, patientStatus: patient.status })
}
