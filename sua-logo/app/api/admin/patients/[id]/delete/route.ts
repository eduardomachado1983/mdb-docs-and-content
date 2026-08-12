import { NextResponse } from 'next/server'
import { createServiceClient, getProfile } from '@/lib/supabase/server'

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const profile = await getProfile()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const supabase = await createServiceClient()

    // Delete documents first (cascade would handle, but explicit is safer)
    await supabase.from('documents').delete().eq('patient_id', id)

    // Delete chat history
    await supabase.from('chat_history').delete().eq('patient_id', id)

    // Delete payment transactions
    await supabase.from('payment_transactions').delete().eq('patient_id', id)

    // Delete patient
    const { error } = await supabase.from('patients').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Delete patient error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
