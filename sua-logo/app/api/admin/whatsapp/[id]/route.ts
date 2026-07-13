import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient, getProfile } from '@/lib/supabase/server'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

async function requireAdmin() {
  const profile = await getProfile()
  if (!profile || profile.role !== 'admin') return null
  return profile
}

// Marca a conversa como lida (zera unread_count).
export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await requireAdmin()
  if (!profile) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await params
  const supabase = await createServiceClient()
  const { error } = await supabase.from('whatsapp_conversations').update({ unread_count: 0 }).eq('id', id)
  if (error) return NextResponse.json({ error: 'Falha ao atualizar conversa' }, { status: 500 })
  return NextResponse.json({ ok: true })
}

const schema = z.object({ content: z.string().trim().min(1, 'Mensagem vazia').max(4096) })

// Envia uma resposta via WhatsApp e registra como mensagem outbound.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await requireAdmin()
  if (!profile) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await params
  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dados inválidos' }, { status: 400 })

  const supabase = await createServiceClient()
  const { data: conversation } = await supabase
    .from('whatsapp_conversations')
    .select('id, phone')
    .eq('id', id)
    .maybeSingle()
  if (!conversation) return NextResponse.json({ error: 'Conversa não encontrada' }, { status: 404 })

  let waMessageId: string | null = null
  try {
    const result = await sendWhatsAppMessage(conversation.phone, parsed.data.content)
    waMessageId = result.waMessageId
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Falha ao enviar mensagem' }, { status: 502 })
  }

  await supabase.from('whatsapp_messages').insert({
    conversation_id: conversation.id,
    direction: 'outbound',
    content: parsed.data.content,
    wa_message_id: waMessageId,
    status: 'sent',
  })

  await supabase
    .from('whatsapp_conversations')
    .update({ last_message_at: new Date().toISOString(), unread_count: 0 })
    .eq('id', conversation.id)

  return NextResponse.json({ ok: true })
}
