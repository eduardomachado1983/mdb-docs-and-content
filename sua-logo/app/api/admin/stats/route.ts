import { NextResponse } from 'next/server'
import { createServiceClient, getProfile } from '@/lib/supabase/server'
import type { PatientStatus } from '@/types'

const STATUSES: PatientStatus[] = [
  'cadastro_incompleto',
  'aguardando_pagamento',
  'aguardando_medico',
  'retido_admin',
  'concluido',
]

export async function GET() {
  const profile = await getProfile()
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }

  const supabase = await createServiceClient()
  const counts: Record<string, number> = {}
  for (const status of STATUSES) {
    const { count } = await supabase.from('patients').select('*', { count: 'exact', head: true }).eq('status', status)
    counts[status] = count ?? 0
  }

  return NextResponse.json({ counts })
}
