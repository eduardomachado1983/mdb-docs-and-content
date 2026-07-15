import { NextResponse } from 'next/server'
import { createServiceClient, getProfile } from '@/lib/supabase/server'

export async function GET() {
  const profile = await getProfile()
  if (!profile || profile.role !== 'doctor') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }

  const supabase = await createServiceClient()
  const { data: patients } = await supabase
    .from('patients')
    .select('*')
    .eq('status', 'aguardando_medico')
    .order('updated_at', { ascending: true })

  return NextResponse.json({ patients: patients ?? [] })
}
