import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { parseIncomingMessages, verifyWebhookSignature, verifyWebhookToken } from '@/lib/whatsapp'

// Handshake de verificação exigido pela Meta ao cadastrar o webhook.
export async function GET(request: Request) {
  const url = new URL(request.url)
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')

  if (mode === 'subscribe' && challenge && verifyWebhookToken(token)) {
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Verificação inválida' }, { status: 403 })
}

// Recebe mensagens novas do WhatsApp Cloud API e registra na caixa de
// entrada do admin (whatsapp_conversations / whatsapp_messages).
export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-hub-signature-256')
  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 })
  }

  const incoming = parseIncomingMessages(JSON.parse(rawBody))
  if (incoming.length === 0) return NextResponse.json({ ok: true })

  const supabase = await createServiceClient()

  for (const message of incoming) {
    const { data: conversation } = await supabase
      .from('whatsapp_conversations')
      .select('id, unread_count')
      .eq('phone', message.phone)
      .maybeSingle()

    const conversationId = conversation
      ? conversation.id
      : (
          await supabase
            .from('whatsapp_conversations')
            .insert({ phone: message.phone, contact_name: message.contactName })
            .select('id')
            .single()
        ).data?.id

    if (!conversationId) continue

    await supabase.from('whatsapp_messages').insert({
      conversation_id: conversationId,
      direction: 'inbound',
      content: message.content,
      wa_message_id: message.waMessageId,
      status: 'received',
    })

    await supabase
      .from('whatsapp_conversations')
      .update({
        unread_count: (conversation?.unread_count ?? 0) + 1,
        last_message_at: new Date().toISOString(),
        ...(message.contactName ? { contact_name: message.contactName } : {}),
      })
      .eq('id', conversationId)
  }

  return NextResponse.json({ ok: true })
}
