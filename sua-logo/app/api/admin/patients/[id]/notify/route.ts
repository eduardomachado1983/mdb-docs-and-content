import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient, getProfile } from '@/lib/supabase/server'
import { sendWhatsAppMessage } from '@/lib/whatsapp'
import { sendEmail } from '@/lib/email'
import { phoneDigits, samePhoneNumber } from '@/lib/utils'
import type { AdminValidation, Patient, ReminderReason } from '@/types'

const MESSAGES: Record<ReminderReason, { subject: string; text: string }> = {
  documentos: {
    subject: 'Documentos pendentes — BioSativa',
    text: 'Olá! Notamos que ainda faltam documentos no seu cadastro. Envie seu documento de identidade e comprovante de endereço na área "Meus dados" para continuarmos sua avaliação.',
  },
  pagamento: {
    subject: 'Pagamento pendente — BioSativa',
    text: 'Olá! O pagamento da sua consulta ainda não foi confirmado. Finalize o pagamento no seu painel para entrar na fila de atendimento médico.',
  },
  prontuario: {
    subject: 'Sua consulta está em análise — BioSativa',
    text: 'Olá! Seu caso já foi avaliado pelo médico e está em análise final com a nossa equipe. Assim que liberado, você recebe sua receita e laudo por aqui.',
  },
}

const schema = z.object({ reason: z.enum(['documentos', 'pagamento', 'prontuario']) })

// Notifica o paciente sobre uma pendência (documentos, pagamento ou
// prontuário em análise) por WhatsApp e e-mail. Sem credenciais reais
// configuradas, cada canal roda em modo simulado — mesmo padrão do
// Mercado Pago e do inbox de WhatsApp sem token.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await getProfile()
  if (!profile || profile.role !== 'admin') return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Motivo inválido' }, { status: 400 })
  const { reason } = parsed.data

  const { id } = await params
  const supabase = await createServiceClient()
  const { data: patient } = await supabase
    .from('patients')
    .select('personal_data, admin_validation')
    .eq('id', id)
    .single<Pick<Patient, 'personal_data' | 'admin_validation'>>()
  if (!patient) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })

  const { full_name: name, phone, email } = patient.personal_data ?? {}
  const message = MESSAGES[reason]

  let whatsappSimulated = true
  if (phone) {
    try {
      const to = phoneDigits(phone).length <= 11 ? `55${phoneDigits(phone)}` : phoneDigits(phone)
      const result = await sendWhatsAppMessage(to, message.text)
      whatsappSimulated = result.simulated

      // Compara por dígitos — uma conversa recebida de fato pelo webhook do
      // WhatsApp pode ter o telefone num formato diferente do cadastro.
      const { data: conversations } = await supabase.from('whatsapp_conversations').select('id, phone')
      const conversation = conversations?.find((c) => samePhoneNumber(c.phone, phone))

      const conversationId = conversation?.id ?? (
        await supabase
          .from('whatsapp_conversations')
          .insert({ phone, contact_name: name ?? null, unread_count: 0, last_message_at: new Date().toISOString() })
          .select('id')
          .single()
      ).data?.id

      if (conversationId) {
        await supabase.from('whatsapp_messages').insert({
          conversation_id: conversationId,
          direction: 'outbound',
          content: message.text,
          wa_message_id: result.waMessageId,
          status: 'sent',
        })
        await supabase.from('whatsapp_conversations').update({ last_message_at: new Date().toISOString() }).eq('id', conversationId)
      }
    } catch {
      // Falha no envio não deve travar a notificação por e-mail.
    }
  }

  let emailSimulated = true
  if (email) {
    try {
      const result = await sendEmail({
        to: email,
        subject: message.subject,
        html: `<p>${message.text}</p>`,
      })
      emailSimulated = result.simulated
    } catch {
      // Falha no envio não deve travar o registro da notificação.
    }
  }

  const adminValidation = (patient.admin_validation ?? {}) as AdminValidation
  const { error } = await supabase.from('patients').update({
    admin_validation: {
      ...adminValidation,
      reminder_sent_at: new Date().toISOString(),
      reminder_reason: reason,
    },
  }).eq('id', id)

  if (error) return NextResponse.json({ error: 'Falha ao registrar notificação' }, { status: 500 })
  return NextResponse.json({ ok: true, whatsappSimulated, emailSimulated })
}
